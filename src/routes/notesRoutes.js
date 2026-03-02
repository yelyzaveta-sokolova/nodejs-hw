import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createNote);
router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.patch('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
