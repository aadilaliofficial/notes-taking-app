import { Request, Response } from "express";
import Note from "../models/Note";
import { AuthRequest } from "../middleware/authMiddleware";

// ✅ Create Note
export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Content required" });

    const note = await Note.create({ userId: req.userId, content });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Error creating note" });
  }
};

// ✅ Get Notes
export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch {
    res.status(500).json({ message: "Error fetching notes" });
  }
};

// ✅ Delete Note
export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await Note.findOneAndDelete({ _id: id, userId: req.userId });
    res.json({ message: "Note deleted" });
  } catch {
    res.status(500).json({ message: "Error deleting note" });
  }
};