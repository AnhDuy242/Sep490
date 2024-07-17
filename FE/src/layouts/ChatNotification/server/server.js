const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: '*', // Cho phép tất cả các origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

const io = new Server(server, {
    cors: {
        origin: '*', // Cho phép tất cả các origin
        methods: ['GET', 'POST']
    }
});

const users = {};  // Để lưu trữ thông tin người dùng

io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
        delete users[socket.id];
    });

    socket.on('join', ({ role, name }) => {
        users[socket.id] = { role, name };
        console.log(`${name} has joined as ${role}`);
    });

    socket.on('message', (data) => {
        console.log('Received message:', data);
        // Handle the message event (e.g., broadcast to other clients)
        socket.broadcast.emit('message', data);
      });
});

server.listen(3001, () => {
    console.log('listening on *:3001');
});
