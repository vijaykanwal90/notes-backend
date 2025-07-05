import express from 'express';
import { userAuth } from '../middlewares/userAuth.middleware.js';
import { createNote, updateNote,getNote,getAllNotes } from '../controllers/note.controller.js';


export const noteRouter = express.Router();
noteRouter.get('/getAllNotes',getAllNotes);

noteRouter.post('/create',userAuth,createNote);
noteRouter.patch('/:noteId',updateNote);
noteRouter.get('/:noteId',getNote)







