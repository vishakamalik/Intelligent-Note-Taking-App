import Note from "../models/note.model.js";
import { errorHandler } from "../utils/error.js";
import { extractKeywords } from "../utils/extractKeywords.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { PdfReader } from "pdfreader";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

export const addNote = async (req, res, next) => {
  const { title, content, tags } = req.body;
  const { id } = req.user;

  if (!title) {
    return next(errorHandler(400, "Title is required"));
  }

  let text = content || "";
  // await Note.deleteMany();
  if (req.file) {
    const file = req.file;

    if (file.mimetype === "application/pdf") {
      try {
        const actualFilePath = path.join(
          __dirname,
          "..",
          "uploads",
          req.userfile
        );

        let allText = "";
        await new PdfReader().parseFileItems(
          `${actualFilePath}`,
          async (err, item) => {
            if (err) console.log("error:", err);
            else if (!item) {
              const keywords = extractKeywords(allText);
              const noteComposed = {
                title,
                content: allText,
                tags: tags || [],
                userId: id,
                keywords,
              };

              const note = await Note.create({ ...noteComposed });

              res.status(201).json({
                success: true,
                message: "Note added successfully",
                note,
              });
            } else if (item.text) {
              allText = `${allText} ${item.text}`;
            }
          }
        );
        return;
      } catch (error) {
        console.log(error);
        return next(errorHandler(500, "Error parsing PDF file...."));
      }
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }
  }

  // Extract keywords from either the parsed text or provided content
  const keywords = extractKeywords(text);

  try {
    const note = new Note({
      title,
      content: text || "",
      tags: tags || [],
      userId: id,
      keywords,
    });

    await note.save();

    res.status(201).json({
      success: true,
      message: "Note added successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};

export const editNote = async (req, res, next) => {
  const note = await Note.findById(req.params.noteId);

  if (!note) {
    return next(errorHandler(404, "Note not found"));
  }

  if (req.user.id !== note.userId) {
    return next(errorHandler(401, "You can only update your own note!"));
  }

  const { title, content, tags, isPinned } = req.body;

  if (!title && !content && !tags) {
    return next(errorHandler(404, "No changes provided"));
  }

  try {
    if (title) {
      note.title = title;
    }

    if (content) {
      note.content = content;
      const keywords = extractKeywords(content);
      if (keywords) {
        note.keywords = keywords;
        console.log(keywords);
      }
    }

    if (tags) {
      note.tags = tags;
    }

    if (isPinned) {
      note.isPinned = isPinned;
    }

    await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllNotes = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const notes = await Note.find({ userId: userId }).sort({ isPinned: -1 });

    res.status(200).json({
      success: true,
      message: "All notes retrived successfully",
      notes,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  const noteId = req.params.noteId;

  const note = await Note.findOne({ _id: noteId, userId: req.user.id });

  if (!note) {
    return next(errorHandler(404, "Note not found"));
  }

  try {
    await Note.deleteOne({ _id: noteId, userId: req.user.id });

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateNotePinned = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.noteId);

    if (!note) {
      return next(errorHandler(404, "Note not found!"));
    }

    if (req.user.id !== note.userId) {
      return next(errorHandler(401, "You can only update your own note!"));
    }

    const { isPinned } = req.body;

    note.isPinned = isPinned;

    await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};

export const searchNote = async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return next(errorHandler(400, "Search query is required"));
  }

  try {
    const matchingNotes = await Note.find({
      userId: req.user.id,
      // keywords: { $in: [query] },
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { keywords: { $in: [query] } }, // Search in keywords
      ],
    });

    console.log(matchingNotes);
    // If no matching notes, return an empty array
    if (matchingNotes.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No notes matching the search query found",
        notes: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Notes matching the search query retrieved successfully",
      notes: matchingNotes,
    });
  } catch (error) {
    next(error);
  }
};
