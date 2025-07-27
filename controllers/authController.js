import Joi from "joi";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import generateOtp from "../utils/generateOtp.js";
import sendEmail from "../utils/sendEmail.js";
import TokenBlacklist from "../models/tokenBlacklist.js";
export const register = async (req, res, next) => {
  
  try {
    const exists = await User.findOne({ email: req.body.email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create(req.body);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};


const privateKeyPath = path.resolve("config","keys", "private.pem");
const privateKey = fs.readFileSync(privateKeyPath, "utf8");

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    const jti = uuidv4(); // Unique token ID
    // ✅ Include tokenVersion in the payload
    const token = jwt.sign(
      {
        sub: user._id,
        email: user.email,
        jti,
        tokenVersion: user.tokenVersion,
      },
      privateKey,
      {
        algorithm: "RS256",
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};




export const logout = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(400).json({ message: "No token provided" });

  try {
    const decoded = jwt.decode(token); 
    if (!decoded?.jti) {
      return res.status(400).json({ message: "Invalid token" });
    }

    await TokenBlacklist.create({
      jti: decoded.jti,
      exp: new Date(decoded.exp * 1000), // exp is in seconds
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Logout failed", error: err.message });
  }
};




export const uploadProfilePic = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.sub;

    // Save file path relative to uploads/
    const filePath = path.join("uploads", req.file.filename);

    await User.findByIdAndUpdate(userId, { profilePic: filePath });

    res
      .status(200)
      .json({ message: "Profile picture updated", profilePic: filePath });
  } catch (err) {
    next(err);
  }
};



export const forgetPassword = async (req, res, next) => {
  
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(404).json({ message: "No user found with that email" });

    const otp = generateOtp();

    user.otp = otp;
    user.otpUsed = false;
    await user.save();

    await sendEmail(
      user.email,
      "Smart Note App - OTP for Password Reset",
      `<p>Your OTP is: <b>${otp}</b></p>`
    );

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    next(err);
  }
};
export const resetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user || user.otp !== req.body.otp || user.otpUsed) {
      return res.status(400).json({ message: "Invalid or used OTP" });
    }

    // ✅ Invalidate all existing tokens
    user.tokenVersion = (user.tokenVersion || 0) + 1;

    // Update password (hashed via Mongoose pre-save)
    user.password = req.body.newPassword;
    user.otpUsed = true;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};
