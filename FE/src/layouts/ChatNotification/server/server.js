const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const https = require('https');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const axios = require('axios');
const agent = new https.Agent({ rejectUnauthorized: false });

const users = {}; // { nameId: { socket, name } }
const receptionists = {}; // { nameId: { socket, name } }
const doctors = {}; // { nameId: { socket, name } }
const availableReceptionists = []; // List of available receptionists
const availableDoctors = []; // List of available doctors

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('login', ({ token, nameId, name }) => {
        console.log("User logged in with token:", token);
        if (nameId) {
            const accountId = parseInt(nameId);
            console.log(`User ${accountId} logged in`);
            socket.accountId = accountId;
            users[accountId] = { socket, name };
        } else {
            console.log('Invalid token, disconnecting socket.');
            socket.disconnect();
        }
    });

    socket.on('loginReceptionist', ({ token, nameId, name }) => {
        if (nameId) {
            const accountId = parseInt(nameId);
            if (!availableReceptionists.includes(accountId)) {
                availableReceptionists.push(accountId); // Add only if not present
            }
            receptionists[accountId] = { socket, name };
            socket.accountId = accountId;
            io.emit('availableReceptionists', availableReceptionists.map(id => ({ nameId: id, name: receptionists[id].name }))); // Update all connected clients
        } else {
            socket.disconnect();
        }
    });

    socket.on('loginDoctor', ({ token, nameId, name }) => {
        if (nameId) {
            const accountId = parseInt(nameId);
            doctors[accountId] = { socket, name };
            socket.accountId = accountId;
            if (!availableDoctors.includes(accountId)) {
                availableDoctors.push(accountId); // Add only if not present
            }
            io.emit('availableDoctors', availableDoctors.map(id => ({ nameId: id, name: doctors[id].name }))); // Update all connected clients
        } else {
            socket.disconnect();
        }
    });

    socket.on('joinRoom', async ({ receiverId }) => {
        if (socket.accountId) {
            const roomId = generateRoomId(socket.accountId, receiverId);
            socket.join(roomId);
            console.log(`User ${socket.accountId} joined room: ${roomId}`);
            console.log(`User ${receiverId} joined room: ${roomId}`);

            // Notify the other participant about the new conversation
            if (receptionists[receiverId]) {
                receptionists[receiverId].socket.join(roomId);
                io.to(receptionists[receiverId].socket.id).emit('newConversation', { roomId, nameId: socket.accountId.toString(), name: users[socket.accountId].name });
            } else if (doctors[receiverId]) {
                doctors[receiverId].socket.join(roomId);
                io.to(doctors[receiverId].socket.id).emit('newConversation', { roomId, nameId: socket.accountId.toString(), name: users[socket.accountId].name });
            } else {
                console.log(`Receptionist/Doctor ${receiverId} not found`);
            }
        }
    });

    socket.on('message', ({ receiverId, message }) => {
        if (socket.accountId && receiverId) {
            const roomId = generateRoomId(socket.accountId, receiverId);
            if (roomId) {
                console.log(`Message from ${socket.accountId} to room ${roomId}:`, message);
                const senderName = users[socket.accountId]?.name || receptionists[socket.accountId]?.name || doctors[socket.accountId]?.name;
                io.to(roomId).emit('message', { from: socket.accountId.toString(), name: senderName, ...message });
            } else {
                console.error(`Failed to send message: Invalid roomId`);
            }
        } else {
            console.error(`Message event failed: socket.accountId or receiverId is undefined`);
        }
    });

    socket.on('getAvailableReceptionists', () => {
        socket.emit('availableReceptionists', availableReceptionists.map(id => ({ nameId: id, name: receptionists[id].name })));
    });

    socket.on('getAvailableDoctors', () => {
        socket.emit('availableDoctors', availableDoctors.map(id => ({ nameId: id, name: doctors[id].name })));
    });

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.accountId} disconnected`);
        delete users[socket.accountId];
        delete receptionists[socket.accountId];
        delete doctors[socket.accountId];

        // Remove from available lists
        const receptionistIndex = availableReceptionists.indexOf(socket.accountId);
        if (receptionistIndex !== -1) {
            availableReceptionists.splice(receptionistIndex, 1);
        }

        const doctorIndex = availableDoctors.indexOf(socket.accountId);
        if (doctorIndex !== -1) {
            availableDoctors.splice(doctorIndex, 1);
        }

        io.emit('availableDoctors', availableDoctors.map(id => ({ nameId: id, name: doctors[id]?.name })));
        io.emit('availableReceptionists', availableReceptionists.map(id => ({ nameId: id, name: receptionists[id]?.name })));
    });
});

function generateRoomId(accountId1, accountId2) {
    const sortedIds = [parseInt(accountId1), parseInt(accountId2)].sort((a, b) => a - b);
    return `${sortedIds[0]}_${sortedIds[1]}`;
}

server.listen(3001, () => {
    console.log('Server listening on port 3001');
});