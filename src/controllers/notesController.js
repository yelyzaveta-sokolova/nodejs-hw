import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;
  const { _id: userId } = req.user;

  const filter = { userId };

  if (tag) filter.tag = tag;
  if (search) filter.$text = { $search: search };

  const skip = (page - 1) * perPage;

  const totalNotes = await Note.countDocuments(filter);

  const notes = await Note.find(filter)
    .skip(skip)
    .limit(Number(perPage));

  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page: Number(page),
    perPage: Number(perPage),
    totalNotes,
    totalPages,
    notes,
  });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const { _id: userId } = req.user;

  const note = await Note.findOne({ _id: noteId, userId });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};


export const createNote = async (req, res) => {
  const { title, content, tag } = req.body;
  const { _id: userId } = req.user;

  const note = await Note.create({ title, content, tag, userId });

  res.status(201).json(note);
};


export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const { _id: userId } = req.user;
  const { title, content, tag } = req.body;

  const updatedNote = await Note.findOneAndUpdate(
    { _id: noteId, userId },
    { title, content, tag },
    { new: true }
  );

  if (!updatedNote) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(updatedNote);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const { _id: userId } = req.user;

  const deletedNote = await Note.findOneAndDelete({ _id: noteId, userId });

  if (!deletedNote) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(deletedNote);
};
