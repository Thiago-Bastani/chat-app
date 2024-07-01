const express = require('express');
const next = require('next');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

var rooms = [];

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = socketIo(httpServer);

  // Middleware para lidar com todas as rotas do Next.js
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('createRoom', () => {
      const roomId = uuidv4();
      socket.join(roomId);
      socket.emit('roomCreated', roomId);
      rooms.push({ roomId: roomId, messages: [], users: [], owner: socket.id });
      console.log(`Room created: ${roomId}`);
    });

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      const roomIndex = rooms.findIndex((room) => room.roomId === roomId);
      if (roomIndex !== -1) {
        rooms[roomIndex].users.push(socket.id);
        io.to(roomId).emit('message', rooms[roomIndex].messages);
        socket.emit('roomJoined', { roomId, users: rooms[roomIndex].users, owner: rooms[roomIndex].owner });
        console.log(`User joined room: ${roomId}`);
      } else {
        console.log(`Room ${roomId} not found`);
        socket.emit('room404');
      }
    });

    socket.on('message', ({ roomId, message }) => {
      const roomIndex = rooms.findIndex((room) => room.roomId === roomId);
      if (roomIndex !== -1) {
        rooms[roomIndex].messages.push(message);
        io.to(roomId).emit('message', rooms[roomIndex].messages);
        console.log(`Message sent to room: ${roomId} - ${message}`);
      } else {
        console.log(`Room ${roomId} not found`);
        socket.emit('room404');
      }
    });

    socket.on('leaveRoom', (roomId) => {
      const roomIndex = rooms.findIndex((room) => room.roomId === roomId);
      if (roomIndex !== -1) {
        rooms[roomIndex].users = rooms[roomIndex].users.filter((user) => user !== socket.id);
        socket.leave(roomId);
        console.log(`User left room: ${roomId}`);
        garbageCollector();
      } else {
        console.log(`Room ${roomId} not found`);
        socket.emit('room404');
      }
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
      garbageCollector();
    });
  });

  const garbageCollector = () => {
    rooms = rooms.filter((room) => room.users.length > 0);
  };

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
