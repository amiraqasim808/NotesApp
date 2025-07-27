import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import TokenBlacklist from "../models/tokenBlacklist.js";
import User from "../models/User.js";

const publicKeyPath = path.resolve("config", "keys", "public.pem");
const publicKey = fs.readFileSync(publicKeyPath, "utf8");

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token." });
  }

  try {
    const payload = jwt.verify(token, publicKey, { algorithms: ["RS256"] });

    // Check if token is blacklisted
    const blacklisted = await TokenBlacklist.findOne({ jti: payload.jti });
    if (blacklisted) {
      return res.status(401).json({ message: "Token has been revoked." });
    }

    // ✅ Check if user's tokenVersion still matches
    const user = await User.findById(payload.sub);
    
    if (!user || user.tokenVersion !== payload.tokenVersion) {
      return res
        .status(401)
        .json({ message: "Session expired. Please log in again." });
    }

    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
};
