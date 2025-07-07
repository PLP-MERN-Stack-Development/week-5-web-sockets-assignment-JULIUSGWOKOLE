const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// User tracking
const users = new Map();

// Authentication middleware
io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("Invalid username"));
  }
  socket.username = username;
  next();
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id, socket.username);
  
  // Add user to tracking
  users.set(socket.id, { username: socket.username });
  io.emit('usersUpdate', Array.from(users.values()));

  // Message handling
  socket.on('sendMessage', (message) => {
    const messageWithMeta = {
      ...message,
      sender: socket.username,
      timestamp: new Date()
    };
    io.emit('receiveMessage', messageWithMeta);
  });

  // Typing indicator
  socket.on('typing', (isTyping) => {
    socket.broadcast.emit('userTyping', {
      username: socket.username,
      isTyping
    });
  });

  // Private messaging
  socket.on('privateMessage', ({ recipient, content }) => {
    // Find recipient socket (simplified example)
    const recipientSocket = [...io.sockets.sockets.values()]
      .find(s => s.username === recipient);
    
    if (recipientSocket) {
      recipientSocket.emit('privateMessage', {
        sender: socket.username,
        content,
        timestamp: new Date()
      });
    }
  });

  // Disconnection handling
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    users.delete(socket.id);
    io.emit('usersUpdate', Array.from(users.values()));
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
