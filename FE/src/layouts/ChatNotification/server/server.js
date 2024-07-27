const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const users = {}; // Stores user sockets
const receptionists = {}; // Stores receptionist sockets
const availableReceptionists = []; // List of available receptionists
const doctors = {}; // Stores doctor sockets
const availableDoctors = []; // List of available doctors

// Function to generate JWT token



io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('login', ({ token, nameId }) => {
        console.log("User logged in with token:", token);
        if (nameId) {
            console.log(`User ${nameId} logged in`);
            socket.nameId = nameId;
            users[nameId] = socket;
        } else {
            console.log('Invalid token, disconnecting socket.');
            socket.disconnect();
        }
    });

    socket.on('loginReceptionist', ({ token, nameId }) => {
        if (nameId) {
            if (!availableReceptionists.includes(nameId)) {
                availableReceptionists.push(nameId); // Add only if not present
            }
            receptionists[nameId] = socket;
            socket.nameId = nameId;
            io.emit('availableReceptionists', availableReceptionists); // Update all connected clients
        } else {
            socket.disconnect();
        }
    });
    socket.on('loginDoctor', ({ token, nameId }) => {
        if (nameId) {
            doctors[nameId] = socket;
            socket.nameId = nameId;
            if (!availableDoctors.includes(nameId)) {
                availableDoctors.push(nameId); // Add only if not present
            }
            io.emit('availableDoctors', availableDoctors); // Update all connected clients
        } else {
            socket.disconnect();
        }
    });




    socket.on('joinRoom', ({ receiverId }) => {
        if (socket.nameId) {
            const roomId = generateRoomId(socket.nameId, receiverId);
            socket.join(roomId);
            console.log(`User ${socket.nameId} joined room: ${roomId}`);

            // Notify the other participant about the new conversation
            if (receptionists[receiverId]) {
                receptionists[receiverId].join(roomId);
                io.to(receptionists[receiverId].id).emit('newConversation', { roomId, nameId: socket.nameId });
            } else if (doctors[receiverId]) {
                doctors[receiverId].join(roomId);
                io.to(doctors[receiverId].id).emit('newConversation', { roomId, nameId: socket.nameId });
            } else {
                console.log(`Receptionist/Doctor ${receiverId} not found`);
            }
        }
    });
    // Handle sending messages

    socket.on('message', ({ receiverId, message }) => {
        if (socket.nameId && receiverId) {
            const roomId = generateRoomId(socket.nameId, receiverId);
            if (roomId) {
                console.log(`Message from ${socket.nameId} to room ${roomId}:`, message);
                io.to(roomId).emit('message', { from: socket.nameId, ...message });
            } else {
                console.error(`Failed to send message: Invalid roomId`);
            }
        } else {
            console.error(`Message event failed: socket.nameId or receiverId is undefined`);
        }
    });




    // Get available doctors and receptionists
    socket.on('getAvailableDoctors', () => {
        socket.emit('availableDoctors', availableDoctors);
    });

    socket.on('getAvailableReceptionists', () => {
        socket.emit('availableReceptionists', availableReceptionists);
    });
    // Handle disconnection

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.nameId} disconnected`);
        delete users[socket.nameId];
        delete receptionists[socket.nameId];
        delete doctors[socket.nameId];

        // Remove from available lists
        const receptionistIndex = availableReceptionists.indexOf(socket.nameId);
        if (receptionistIndex !== -1) {
            availableReceptionists.splice(receptionistIndex, 1);
        }

        const doctorIndex = availableDoctors.indexOf(socket.nameId);
        if (doctorIndex !== -1) {
            availableDoctors.splice(doctorIndex, 1);
        }

        io.emit('availableDoctors', availableDoctors);
        io.emit('availableReceptionists', availableReceptionists);
    });
});

function generateRoomId(nameId1, nameId2) {
    const sortedNameIds = [nameId1, nameId2].sort();
    return `${sortedNameIds[0]}_${sortedNameIds[1]}`;
}

server.listen(3001, () => {
    console.log('Server listening on port 3001');
});
