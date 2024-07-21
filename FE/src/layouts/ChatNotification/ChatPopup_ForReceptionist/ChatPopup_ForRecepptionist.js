import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import io from 'socket.io-client';
import LoginForm from '../../LoginForm';
import { login } from '../../../services/Authentication';

const tokenTimeout = 3600000; // 1 hour in milliseconds

const Chatpopup_Forceptionist = () => {
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [inputMessage, setInputMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState('');
    const nameId = localStorage.getItem('nameId');
    const socketRef = useRef(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedTokenTimestamp = localStorage.getItem('tokenTimestamp');
        if (storedToken && storedTokenTimestamp) {
            const currentTime = new Date().getTime();
            const tokenAge = currentTime - parseInt(storedTokenTimestamp);
            if (tokenAge < tokenTimeout) {
                setIsLoggedIn(true);
                setToken(storedToken);
                connectSocket(storedToken);
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('tokenTimestamp');
            }
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const connectSocket = (token) => {
        socketRef.current = io('http://localhost:3001');
        socketRef.current.emit('loginReceptionist', { token, nameId });

        socketRef.current.on('newConversation', ({ roomId, nameId }) => {
            console.log('New conversation:', { roomId, nameId }); // Log new conversation
            setConversations((prevConversations) => [
                ...prevConversations,
                { id: roomId, userId: nameId, messages: [] }
            ]);
        });

        socketRef.current.on('message', (message) => {
            console.log('Message received:', message); // Log tin nhắn nhận được
            setConversations((prevConversations) => {
                const updatedConversations = [...prevConversations];
                const conversationIndex = updatedConversations.findIndex(c => c.id === message.roomId);
                if (conversationIndex >= 0) {
                    updatedConversations[conversationIndex].messages.push(message);
                } else {
                    updatedConversations.push({ id: message.roomId, messages: [message] });
                }
                console.log('Updated conversations:', updatedConversations); // Log danh sách cuộc trò chuyện sau khi cập nhật
                return updatedConversations;
            });

            if (message.roomId === currentConversation?.id) {
                setCurrentConversation((prevConversation) => ({
                    ...prevConversation,
                    messages: [...prevConversation.messages, message]
                }));
                console.log('Current conversation after update:', currentConversation); // Log cuộc trò chuyện hiện tại sau khi cập nhật
            }
        });


        socketRef.current.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    };

    const handleSendMessage = () => {
        if ((inputMessage.trim() || selectedImage) && socketRef.current && currentConversation) {
            const message = {
                text: inputMessage.trim(),
                image: selectedImage,
                roomId: currentConversation.id
            };

            console.log('Sending message:', { receiverId: currentConversation.userId, message }); // Log message before sending

            socketRef.current.emit('message', {
                receiverId: currentConversation.userId, // Assuming userId is the receiverId
                message
            });

            setCurrentConversation((prevConversation) => ({
                ...prevConversation,
                messages: [...prevConversation.messages, { from: 'Me', ...message }]
            }));
            setInputMessage('');
            setSelectedImage(null);
        }
    };

    const handleSelectImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const updateToken = (token) => {
        setIsLoggedIn(true);
        localStorage.setItem('token', token);
        localStorage.setItem('tokenTimestamp', new Date().getTime().toString());
        setToken(token);
        connectSocket(token);
    };

    const handleLogin = async ({ username, password }) => {
        try {
            const { token } = await login(username, password);
            updateToken(token);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleConversationClick = (conversationId) => {
        const conversation = conversations.find(c => c.id === conversationId);
        if (conversation) {
            setCurrentConversation(conversation);
        }
    };

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            {isLoggedIn ? (
                <>
                    <Box display="flex" justifyContent="space-between" alignItems="center" p={2} bgcolor="grey.300">
                        <Typography variant="h6">Receptionist Chat</Typography>
                        <IconButton>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box display="flex" flexGrow={1}>
                        <Box flex="0 0 200px" bgcolor="grey.200" p={2}>
                            <Typography variant="h6">Conversations</Typography>
                            <Box>
                                {conversations.map(conversation => (
                                    <Box
                                        key={conversation.id}
                                        p={1}
                                        bgcolor={currentConversation?.id === conversation.id ? 'grey.400' : 'grey.300'}
                                        onClick={() => handleConversationClick(conversation.id)}
                                    >
                                        <Typography variant="body2">User: {conversation.userId}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                        <Box flexGrow={1} p={2} display="flex" flexDirection="column">
                            {currentConversation ? (
                                <>
                                    <Box flexGrow={1} overflow="auto">
                                        {currentConversation.messages.map((message, index) => (
                                            <Box key={index} mb={1}>
                                                <Typography variant="body2"><strong>{message.from}:</strong> {message.text}</Typography>
                                                {message.image && <img src={message.image} alt="sent" width="100%" />}
                                            </Box>
                                        ))}
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            placeholder="Type a message..."
                                        />
                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="icon-button-file"
                                            type="file"
                                            onChange={handleSelectImage}
                                        />
                                        <label htmlFor="icon-button-file">
                                            <IconButton color="primary" aria-label="upload picture" component="span">
                                                <ImageIcon />
                                            </IconButton>
                                        </label>
                                        <Button color="primary" variant="contained" onClick={handleSendMessage}>
                                            Send
                                        </Button>
                                    </Box>
                                </>
                            ) : (
                                <Typography variant="body2">Select a conversation to start chatting</Typography>
                            )}
                        </Box>
                    </Box>
                </>
            ) : (
                <LoginForm onLogin={handleLogin} />
            )}
        </Box>
    );
};

export default Chatpopup_Forceptionist;
