import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import connectDB from './utils/database.js';
import { userRouter } from './routes/user.router.js';
import { noteRouter } from './routes/note.router.js';
import { Note } from './models/note.model.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'https://notes-frontend-sk2r.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.setTimeout(300000);
  res.setTimeout(300000);
  next();
});

// Routes
app.use('/api/user', userRouter);
app.use('/api/notes', noteRouter);

// SOCKET.IO SETUP

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});


const noteUsers = {};         
const socketToNoteMap = {};   
const noteUserDetails = {};   

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('joinNote', ({ noteId, token }) => {
    socket.join(noteId);

    let decodedUser;
    try {
      decodedUser = jwt.verify(token, 'ScriptGuru@123');
    } catch (err) {
      console.error('Invalid token');
      return;
    }

    const userInfo = {
      socketId: socket.id,
      name: decodedUser.name || 'Anonymous',
      email: decodedUser.email || '',
    };

    
    if (!noteUsers[noteId]) noteUsers[noteId] = new Set();
    noteUsers[noteId].add(socket.id);
    socketToNoteMap[socket.id] = noteId;

    if (!noteUserDetails[noteId]) noteUserDetails[noteId] = [];
    noteUserDetails[noteId].push(userInfo);

    
    io.to(noteId).emit('userCount', noteUsers[noteId].size);
    io.to(noteId).emit('userList', noteUserDetails[noteId]);
  });

  socket.on('note:update', async ({ noteId, updatedNote }) => {
    try {
      socket.to(noteId).emit('note:receive', { updatedNote });
      await Note.findByIdAndUpdate(noteId, {
        title: updatedNote.title,
        content: updatedNote.content,
        updatedAt: new Date(),
      });
    } catch (err) {
      console.error('Error saving note update:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
    const noteId = socketToNoteMap[socket.id];

    if (noteId) {
      
      noteUsers[noteId]?.delete(socket.id);
      delete socketToNoteMap[socket.id];

      if (noteUserDetails[noteId]) {
        noteUserDetails[noteId] = noteUserDetails[noteId].filter(
          (user) => user.socketId !== socket.id
        );
      }

      
      if (noteUsers[noteId]?.size === 0) {
        delete noteUsers[noteId];
        delete noteUserDetails[noteId];
      } else {
        io.to(noteId).emit('userCount', noteUsers[noteId].size);
        io.to(noteId).emit('userList', noteUserDetails[noteId]);
      }
    }
  });
});


connectDB()
  .then(() => {
    server.listen(3000, () => {
      console.log(' Server running on http://localhost:3000');
    });
  })
  .catch((err) => {
    console.error(" MongoDB connection failed:", err);
  });
