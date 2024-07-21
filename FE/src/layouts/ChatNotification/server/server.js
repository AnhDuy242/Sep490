    const express = require('express');
    const http = require('http');
    const { Server } = require('socket.io');
    const jwt = require('jsonwebtoken');

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
    const JWT_SECRET = 'your_secret_key_here'; // Secret key for JWT

    // Function to generate JWT token
    function generateToken(nameId) {
        return jwt.sign({ nameId }, JWT_SECRET, { expiresIn: '1h' });
    }



    io.on('connection', (socket) => {
        console.log('A user connected');
        socket.on('login', ({ token, nameId }) => {
            console.log("User logged in with token:", token);
            if (nameId) {
                console.log(`User ${nameId} logged in`);
                socket.nameId = nameId;
                users[nameId] = socket;
                socket.emit('newToken', generateToken(nameId));
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
        
        

        socket.on('joinRoom', ({ receiverId }) => {
            if (socket.nameId) {
                const roomId = generateRoomId(socket.nameId, receiverId);
                socket.join(roomId);
                console.log(`User ${socket.nameId} joined room: ${roomId}`);
        
                // Notify the receptionist about the new conversation if they are online
                if (receptionists[receiverId]) {
                    io.to(receptionists[receiverId].id).emit('newConversation', { roomId, nameId: socket.nameId });
                } else {
                    console.log(`Receptionist ${receiverId} not found`);
                }
            }
        });

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
        
        

        socket.on('getAvailableReceptionists', () => {
            socket.emit('availableReceptionists', availableReceptionists);
        });

        socket.on('disconnect', () => {
            console.log(`Socket ${socket.nameId} disconnected`);
            delete users[socket.nameId];
            delete receptionists[socket.nameId];
            const index = availableReceptionists.indexOf(socket.nameId);
            if (index !== -1) {
                availableReceptionists.splice(index, 1); // Remove from available receptionists
            }
        });
    });

    function generateRoomId(nameId1, nameId2) {
        const sortedNameIds = [nameId1, nameId2].sort();
        return `${sortedNameIds[0]}_${sortedNameIds[1]}`;
    }

    server.listen(3001, () => {
        console.log('Server listening on port 3001');
    });
