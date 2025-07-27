// models/tokenBlacklist.model.js
import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema({
  jti: { type: String, required: true, unique: true },
  exp: { type: Date, required: true }, // Store expiry to allow cleanup later
});

const TokenBlacklist = mongoose.model("TokenBlacklist", tokenBlacklistSchema);

export default TokenBlacklist;
