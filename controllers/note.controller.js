import { Note } from "../models/note.model.js";

import mongoose from "mongoose";

const createNote = async(req,res)=>{
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }
        
        const note = new Note({
            title,
            content,
            user: req.user._id // Assuming user is authenticated and available in req.user
        });
        
        await note.save();
        res.status(201).json(note);
    } catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const getNote = async (req, res) => {
  const { noteId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    return res.status(400).json({ message: "Invalid note ID" });
  }

  try {
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    return res.status(200).json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 }); 
    return res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



const updateNote = async(req,res)=>{
    const {noteId} = req.params;
    const { title, content } = req.body;
    try {
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }
        
        const note = await Note.findByIdAndUpdate(noteId, { title, content }, { new: true });
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        
        return res.status(200).json(note);
    } catch (error) {
        console.error("Error updating note:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export {createNote,updateNote,getNote,getAllNotes};