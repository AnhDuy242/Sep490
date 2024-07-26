import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, IconButton, Dialog, List, ListItem, ListItemText } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import io from 'socket.io-client';
import { login } from '../../../services/Authentication';
import LoginForm from '../../LoginForm';

const tokenTimeout = 3600000; // 1 hour in milliseconds

const ChatPopup_ForDoctor = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [showChat, setShowChat] = useState(true);
    const [availableReceptionists, setAvailableReceptionists] = useState([]);
    const [currentConversation, setCurrentConversation] = useState({ id: '', messages: [] });
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
        socketRef.current.emit('login', { token, nameId });

        socketRef.current.on('availableReceptionists', (receptionists) => {
            setAvailableReceptionists(receptionists);
        });

        socketRef.current.on('message', (message) => {
            setCurrentConversation((prevConversation) => {
                if (prevConversation.id === message.roomId) {
                    return { ...prevConversation, messages: [...prevConversation.messages, message] };
                }
                return prevConversation;
            });
        });

        socketRef.current.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    };

    const handleSendMessage = () => {
        if ((inputMessage.trim() || selectedImage) && socketRef.current) {
            const message = {
                id: Date.now(),
                text: inputMessage.trim(),
                image: selectedImage,
                roomId: currentConversation.id // Đây phải là ID phòng chat đúng
            };
    
            if (currentConversation.nameId) {
                socketRef.current.emit('message', {
                    receiverId: currentConversation.nameId, // ID của receptionist
                    message
                });
            } else {
                console.error('currentConversation.nameId is undefined');
            }
    
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

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleStartChat = (nameId) => {
        socketRef.current.emit('newConversation', { receiverId:nameId });
        handleDialogClose();
    };

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            {isLoggedIn ? (
                <>
                    {showChat ? (
                        <>
                            <Box display="flex" justifyContent="space-between" alignItems="center" p={2} bgcolor="grey.300">
                                <Typography variant="h6">Doctor Chat</Typography>
                                <IconButton onClick={handleDialogOpen}>
                                    <ChatIcon />
                                </IconButton>
                                <IconButton>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                            <Box display="flex" flexGrow={1}>
                                <Box flexGrow={1} p={2} display="flex" flexDirection="column">
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
                                </Box>
                            </Box>
                        </>
                    ) : (
                        <Box>
                            {/* Chat list or other components */}
                        </Box>
                    )}
                    <Dialog open={dialogOpen} onClose={handleDialogClose}>
                        <Box p={2}>
                            <Typography variant="h6">Available Receptionists</Typography>
                            <List>
                                {availableReceptionists.map((receptionistId) => (
                                    <ListItem button key={receptionistId} onClick={() => handleStartChat(receptionistId)}>
                                        <ListItemText primary={`Receptionist ${receptionistId}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Dialog>
                </>
            ) : (
                <LoginForm onLogin={handleLogin} />
            )}
        </Box>
    );
};

export default ChatPopup_ForDoctor;
