import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Kết nối tới server Socket.io

const ConsultantChat = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    useEffect(() => {
        socket.emit('join', { role: 'consultant', name: 'Consultant' });

        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('message');
        };
    }, []);

    const handleSendMessage = () => {
        const message = inputMessage.trim();
        if (message) {
            socket.emit('message', { to: 'user', message }); // Gửi tin nhắn tới người dùng
            setMessages((prevMessages) => [...prevMessages, { from: 'Consultant', message }]);
            setInputMessage('');
        }
    };

    return (
        <Box style={{ padding: '16px' }}>
            <Typography variant="h6">Consultant Chat</Typography>
            <Box>
                {messages.map((msg, index) => (
                    <Typography key={index}><strong>{msg.from}:</strong> {msg.message}</Typography>
                ))}
            </Box>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleSendMessage();
                    }
                }}
            />
            <Button onClick={handleSendMessage} variant="contained" color="primary" fullWidth>
                Send
            </Button>
        </Box>
    );
};

export default ConsultantChat;
