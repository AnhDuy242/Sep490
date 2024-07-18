const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    
}
}
);

const users = {}; // Lưu trữ thông tin người dùng
const receptionist = {}; // Lưu trữ thông tin receptionist

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('login', ({ token }) => {
        const userId = getUserIdFromToken(token);
        if (!userId) {
            return socket.disconnect();
        }

        socket.userId = userId;

        if (!users[userId]) {
            users[userId] = socket;
        }

        console.log(`User ${userId} logged in`);

        socket.on('joinRoom', ({ receiverId }) => {
            const roomId = generateRoomId(userId, receiverId);
            socket.join(roomId);
            console.log(`User ${userId} joined room: ${roomId}`);
        });

        socket.on('message', ({ receiverId, message }) => {
            const roomId = generateRoomId(userId, receiverId);
            io.to(roomId).emit('message', { userId, ...message });
        });

        socket.on('disconnect', () => {
            console.log(`User ${userId} disconnected`);
            delete users[userId];
        });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected without login');
    });
});


function getUserIdFromToken(token) {
    try {
        // Giải mã token bằng secret key (được sử dụng để ký token)
        const decodedToken = jwt.verify(token, 'your_jwt_secret');
        // Trích xuất userId từ payload giải mã được
        const userId = decodedToken.userId;
        return userId;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

function generateRoomId(userId1, userId2) {
    const sortedUserIds = [userId1, userId2].sort();
    return `${sortedUserIds[0]}_${sortedUserIds[1]}`;
}

server.listen(3001, () => {
    console.log('listening on *:3001');
});
