const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

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

    socket.on('message', ({ to, message }) => {
        const targetSocketId = Object.keys(users).find(id => users[id].name === to);
        if (targetSocketId) {
            io.to(targetSocketId).emit('message', { from: users[socket.id].name, message });
        }
    });
});

server.listen(3001, () => {
    console.log('listening on *:3001');
});
