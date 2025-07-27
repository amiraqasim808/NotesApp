import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const privateKey = fs.readFileSync(
  path.join(__dirname, "../config/keys/private.key")
);
const publicKey = fs.readFileSync(
  path.join(__dirname, "../config/keys/public.key")
);

export const generateToken = (payload) => {
  return jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, publicKey);
};
