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

const users = {}; // Stores user sockets
const receptionists = {}; // Stores receptionist sockets
const availableReceptionists = []; // List of available receptionists
const doctors = {}; // Stores doctor sockets
const availableDoctors = []; // List of available doctors

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('login', ({ token, nameId }) => {
        console.log("User logged in with token:", token);
        if (nameId) {
            const accountId = parseInt(nameId);
            console.log(`User ${accountId} logged in`);
            socket.accountId = accountId;
            users[accountId] = socket;
        } else {
            console.log('Invalid token, disconnecting socket.');
            socket.disconnect();
        }
    });

    socket.on('loginReceptionist', ({ token, nameId }) => {
        if (nameId) {
            const accountId = parseInt(nameId);
            if (!availableReceptionists.includes(accountId)) {
                availableReceptionists.push(accountId); // Add only if not present
            }
            receptionists[accountId] = socket;
            socket.accountId = accountId;
            io.emit('availableReceptionists', availableReceptionists); // Update all connected clients
        } else {
            socket.disconnect();
        }
    });

    socket.on('loginDoctor', ({ token, nameId }) => {
        if (nameId) {
            const accountId = parseInt(nameId);
            doctors[accountId] = socket;
            socket.accountId = accountId;
            if (!availableDoctors.includes(accountId)) {
                availableDoctors.push(accountId); // Add only if not present
            }
            io.emit('availableDoctors', availableDoctors); // Update all connected clients
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

            try {
                // Tạo cuộc trò chuyện và lưu vào cơ sở dữ liệu
                const response = await axios.post('https://localhost:7240/api/Conversations/Create', {
                    createConversationDto: {
                        DoctorId: socket.accountId, // Ensure DoctorId is included
                        PatientId: receiverId, // Ensure receiverId is parsed correctly
                        CreatedAt: new Date().toISOString(), // Convert to ISO string format for DateTime
                        conversation_Name: `Conversation between ${socket.accountId} and ${receiverId}` // Example conversation name
                    }
                }, {
                    httpsAgent: agent // Sử dụng agent tùy chỉnh
                });
                console.log('New conversation created:', response.data);
            } catch (error) {
                console.error('Error creating new conversation:', error.response ? error.response.data : error.message);
            }
            
            
    
            // Notify the other participant about the new conversation
            if (receptionists[receiverId]) {
                receptionists[receiverId].join(roomId);
                io.to(receptionists[receiverId].id).emit('newConversation', { roomId, nameId: socket.accountId.toString() });
            } else if (doctors[receiverId]) {
                doctors[receiverId].join(roomId);
                io.to(doctors[receiverId].id).emit('newConversation', { roomId, nameId: socket.accountId.toString() });
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
                io.to(roomId).emit('message', { from: socket.accountId.toString(), ...message });
            } else {
                console.error(`Failed to send message: Invalid roomId`);
            }
        } else {
            console.error(`Message event failed: socket.accountId or receiverId is undefined`);
        }
    });

    socket.on('getAvailableDoctors', () => {
        socket.emit('availableDoctors', availableDoctors.map(String));
    });

    socket.on('getAvailableReceptionists', () => {
        socket.emit('availableReceptionists', availableReceptionists.map(String));
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

        io.emit('availableDoctors', availableDoctors.map(String));
        io.emit('availableReceptionists', availableReceptionists.map(String));
    });
});

function generateRoomId(accountId1, accountId2) {
    const sortedIds = [parseInt(accountId1), parseInt(accountId2)].sort((a, b) => a - b);
    return `${sortedIds[0]}_${sortedIds[1]}`;
}

server.listen(3001, () => {
    console.log('Server listening on port 3001');
});