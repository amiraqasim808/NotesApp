import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/notesRoutes.js";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./graphql/schema.js";
import resolvers from "./graphql/resolvers.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import TokenBlacklist from "./models/tokenBlacklist.js";
import User from "./models/User.js";
import { AuthenticationError } from "apollo-server-errors";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// MongoDB connection
await connectDB();

// RESTful API routes
app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);

// Load RSA public key
const publicKeyPath = path.resolve("config", "keys", "public.pem");
const publicKey = fs.readFileSync(publicKeyPath, "utf8");

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new AuthenticationError("Access denied. No token provided.");
    }

    try {
      // Verify JWT using RS256 and public key
      const payload = jwt.verify(token, publicKey, { algorithms: ["RS256"] });

      // Check if token is blacklisted
      const blacklisted = await TokenBlacklist.findOne({ jti: payload.jti });
      if (blacklisted) {
        throw new AuthenticationError("Token has been revoked.");
      }

      // Check if user still has valid tokenVersion
      const user = await User.findById(payload.sub);
      if (!user || user.tokenVersion !== payload.tokenVersion) {
        throw new AuthenticationError("Session expired. Please log in again.");
      }

      return { user: payload };
    } catch (err) {
      throw new AuthenticationError("Invalid or expired token");
    }
  },
});

// Start Apollo server and apply it to Express
await server.start();
server.applyMiddleware({ app, path: "/graphql" });

// 404 handler
app.use("*", (req, res) =>
  res.status(404).json({ message: "This route does not exist" })
);

// Global error handler
app.use(errorHandler);

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`🚀 REST server running at http://localhost:${process.env.PORT}`);
  console.log(
    `🚀 GraphQL endpoint ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
  );
});
