import Note from "../models/Note.js";
import { summarizeText } from "../utils/summarizer.js";

export const summarizeNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.sub,
    });

    if (!note) return res.status(404).json({ message: "Note not found." });

    const summary = await summarizeText(note.content);

    res.status(200).json({ summary });
  } catch (err) {
    console.error("Summarize error:", err.message);
    res.status(500).json({ message: "Failed to summarize note." });
  }
};
