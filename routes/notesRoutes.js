import express from "express";
import { summarizeNote } from "../controllers/notesController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:id/summarize", authMiddleware, summarizeNote);

export default router;
