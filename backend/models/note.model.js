import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  tags: {
    type: [String],
    default: [],
  },
  keywords: {
    type: [String],
    required: true,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Note = mongoose.model("Note", noteSchema);

export default Note;
