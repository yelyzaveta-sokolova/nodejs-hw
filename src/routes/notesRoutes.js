import { Router } from 'express';
import { celebrate } from 'celebrate';
import authenticate from '../middlewares/authenticate.js';

import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';

import {
  createNoteSchema,
  getAllNotesSchema,
  noteIdSchema,
  updateNoteSchema,
} from '../validation/notesValidation.js';

const router = Router();

router.use(authenticate);

router.get(
  '/notes',
  celebrate(getAllNotesSchema),
  getAllNotes
);

router.get(
  '/notes/:noteId',
  celebrate(noteIdSchema),
  getNoteById
);

router.post(
  '/notes',
  celebrate(createNoteSchema),
  createNote
);

router.patch(
  '/notes/:noteId',
  celebrate(updateNoteSchema),
  updateNote
);

router.delete(
  '/notes/:noteId',
  celebrate(noteIdSchema),
  deleteNote
);

export default router;
