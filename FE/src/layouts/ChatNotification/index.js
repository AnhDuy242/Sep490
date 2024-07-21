import React, { useState, useEffect, useRef } from 'react';
import { Fab, Badge, Dialog, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import io from 'socket.io-client';
import { login } from '../../services/Authentication';
import LoginForm from '../LoginForm';

const tokenTimeout = 3600000; // 1 hour in milliseconds

const ChatPopup = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState({ id: 'default', messages: [] });
    const [inputMessage, setInputMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState('');
    const [availableReceptionists, setAvailableReceptionists] = useState([]);
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
        const nameId = localStorage.getItem('nameId');
        if (!nameId) {
            console.error('nameId not found in localStorage');
            return;
        }
        socketRef.current.emit('login', { token, nameId });
        socketRef.current.on('availableReceptionists', (receptionists) => {
            setAvailableReceptionists((prevReceptionists) => {
                const receptionistSet = new Set([...prevReceptionists, ...receptionists]);
                return Array.from(receptionistSet);
            });
        });


        socketRef.current.on('connect', () => {
            socketRef.current.emit('getAvailableReceptionists');
        });

        socketRef.current.on('message', (message) => {
            setConversations((prevConversations) => {
                const updatedConversations = [...prevConversations];
                const conversationIndex = updatedConversations.findIndex(c => c.id === message.roomId);
                if (conversationIndex >= 0) {
                    updatedConversations[conversationIndex].messages.push(message);
                } else {
                    updatedConversations.push({ id: message.roomId, messages: [message] });
                }
                return updatedConversations;
            });

            if (message.roomId === currentConversation.id) {
                setCurrentConversation((prevConversation) => ({
                    ...prevConversation,
                    messages: [...prevConversation.messages, message]
                }));
            }
        });

        socketRef.current.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    };

    const handleToggleDialog = () => {
        setDialogOpen(!dialogOpen);
    };
    const handleSendMessage = () => {
        if ((inputMessage.trim() || selectedImage) && socketRef.current && currentConversation) {
            const message = {
                text: inputMessage.trim(),
                image: selectedImage,
                roomId: currentConversation.id
            };
    
            // Include receiverId here
            socketRef.current.emit('message', {
                receiverId: currentConversation.userId, // Ensure this is set correctly
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

    const handleCloseLogin = () => setShowLogin(false);
    const handleShowLogin = () => setShowLogin(true);

    const updateToken = (token) => {
        setIsLoggedIn(true);
        localStorage.setItem('token', token);
        localStorage.setItem('tokenTimestamp', new Date().getTime().toString());
        setToken(token);
        connectSocket(token);
        handleToggleDialog();
    };

    const handleLogin = async ({ username, password }) => {
        try {
            const { token } = await login(username, password);
            updateToken(token);
            handleCloseLogin();
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const fabStyle = {
        position: 'fixed',
        bottom: 16,
        right: 16,
    };

    const selectReceptionistAndJoinRoom = (receptionistId) => {
        const roomId = `${[nameId, receptionistId].sort().join('_')}`;
        socketRef.current.emit('joinRoom', { receiverId: receptionistId });
        setCurrentConversation({ id: roomId, userId: receptionistId, messages: [] });
    };

    return (
        <div>
            {!isLoggedIn ? (
                <LoginForm onLogin={handleLogin} />
            ) : (
                <>
                    <Fab color="primary" onClick={handleToggleDialog} style={fabStyle}>
                        <Badge color="secondary" variant="dot" invisible={!showChat}>
                            <ChatIcon />
                        </Badge>
                    </Fab>

                    <Dialog open={dialogOpen} onClose={handleToggleDialog} fullWidth maxWidth="md">
                        <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                            <Typography variant="h6">Chat</Typography>
                            <IconButton edge="end" color="inherit" onClick={handleToggleDialog} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Box p={2}>
                            {showChat ? (
                                <>
                                    <Box mb={2}>
                                        <Typography variant="body1">
                                            Current Conversation: {currentConversation.id}
                                        </Typography>
                                    </Box>
                                    <Box mb={2} height="400px" overflow="auto">
                                        {currentConversation.messages.map((msg, index) => (
                                            <Box key={index} mb={1}>
                                                <Typography variant="body2">{msg.from}: {msg.text}</Typography>
                                                {msg.image && <img src={msg.image} alt="attachment" width="100" />}
                                            </Box>
                                        ))}
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <TextField
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            variant="outlined"
                                            fullWidth
                                            placeholder="Type your message..."
                                        />
                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="raised-button-file"
                                            type="file"
                                            onChange={handleSelectImage}
                                        />
                                        <label htmlFor="raised-button-file">
                                            <IconButton component="span">
                                                <ImageIcon />
                                            </IconButton>
                                        </label>
                                        <Button onClick={handleSendMessage} color="primary" variant="contained">
                                            Send
                                        </Button>
                                    </Box>
                                </>
                            ) : (
                                <Box>
                                    <Typography variant="h6">Select a Receptionist</Typography>
                                    <Box mt={2}>
                                        {availableReceptionists.map((receptionist) => (
                                            <Button
                                                key={receptionist}
                                                onClick={() => {
                                                    selectReceptionistAndJoinRoom(receptionist);
                                                    setShowChat(true);
                                                }}
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                style={{ marginBottom: '8px' }}
                                            >
                                                {receptionist}
                                            </Button>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Dialog>
                </>
            )}
        </div>
    );
};

export default ChatPopup;
