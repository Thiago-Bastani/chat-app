const express = require('express');
const next = require('next');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

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
      console.log(`Room created: ${roomId}`);
    });

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    socket.on('message', ({ roomId, message }) => {
      io.to(roomId).emit('message', message);
      console.log(`RoomId: ${roomId.slice(0, 5)}, Message: ${message}`);
    });

    socket.on('leaveRoom', (roomId) => {
      socket.leave(roomId);
      console.log(`User left room: ${roomId}`);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
