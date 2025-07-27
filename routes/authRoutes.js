import express from "express";
import {
  register,
  login,
  logout,
  uploadProfilePic,
  forgetPassword,
  resetPassword,
} from "../controllers/authController.js";

import validate from "../middlewares/validate.js";
import {
  registerSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
} from "../validations/authSchema.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", authMiddleware, logout);
router.patch(
  "/upload-profile-pic",
  authMiddleware,
  upload.single("profilePic"),
  uploadProfilePic
);
router.post("/forget-password", validate(forgetPasswordSchema), forgetPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;
