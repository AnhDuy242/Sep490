import React, { useState, useEffect, useRef } from 'react';
import { Fab, Badge, Dialog, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import io from 'socket.io-client';
import { login } from '../../services/Authentication';
import LoginForm from '../LoginForm';
import notificationSound from '../../assets/sound/notification_sound.mp3'; // Import the notification sound

const tokenTimeout = 3600000; // 1 hour in milliseconds

const ChatPopup_ForPatient = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [availableReceptionists, setAvailableReceptionists] = useState([]);
    const [currentConversation, setCurrentConversation] = useState({ id: '', messages: [] });
    const [inputMessage, setInputMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState('');
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [fullscreenImage, setFullscreenImage] = useState(null);
    const nameId = localStorage.getItem('nameId');
    const socketRef = useRef(null);
    const audioRef = useRef(new Audio(notificationSound)); // Create a reference to the audio object

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

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on('message', (message) => {
                console.log('Received message:', message); // Debug log to check the received message
                setCurrentConversation((prevConversation) => {
                    const conversationId = prevConversation.id;
                    if (message.roomId === conversationId) {
                        const messageExists = prevConversation.messages.some(
                            (msg) => msg.id === message.id
                        );
                        if (!messageExists) {
                            setUnreadMessages((prevCount) => prevCount + 1);
                            audioRef.current.play(); // Play the notification sound
                            return {
                                ...prevConversation,
                                messages: [...prevConversation.messages, message]
                            };
                        }
                    }
                    return prevConversation;
                });
            });

            return () => {
                socketRef.current.off('message'); // Cleanup listener on unmount
            };
        }
    }, [currentConversation.id]);

    const connectSocket = (token) => {
        socketRef.current = io('http://localhost:3001');
        if (!nameId) {
            console.error('nameId not found in localStorage');
            return;
        }
        socketRef.current.emit('login', { token, nameId });

        socketRef.current.on('availableReceptionists', (receptionists) => {
            setAvailableReceptionists(receptionists);
        });

        socketRef.current.on('connect', () => {
            socketRef.current.emit('getAvailableReceptionists');
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
                id: Date.now(), // Unique identifier for the message
                text: inputMessage.trim(),
                image: selectedImage,
                roomId: currentConversation.id
            };

            socketRef.current.emit('message', {
                receiverId: currentConversation.userId,
                message
            });

            // Update local messages immediately after sending
            setCurrentConversation((prevConversation) => ({
                ...prevConversation,
                messages: [...prevConversation.messages, { from: 'Me', ...message }]
            }));

            // Reset input and selected image
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
        setUnreadMessages(0); // Reset unread messages count on starting a new conversation
        setShowChat(true);
    };

    const handleCloseFullscreenImage = () => setFullscreenImage(null);

    return (
        <div>
            {!isLoggedIn ? (
                <LoginForm onLogin={handleLogin} />
            ) : (
                <>
                    <Fab color="primary" onClick={handleToggleDialog} style={fabStyle}>
                        <Badge color="secondary" variant="dot" invisible={!unreadMessages}>
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
                                            <Box
                                                key={index}
                                                mb={1}
                                                display="flex"
                                                justifyContent={msg.from === 'Me' ? 'flex-end' : 'flex-start'}
                                            >
                                                <Box
                                                    p={1}
                                                    style={{
                                                        backgroundColor: msg.from === 'Me' ? '#d1e7dd' : '#e9ecef',
                                                        borderRadius: '8px',
                                                        maxWidth: '70%',
                                                        wordBreak: 'break-word'
                                                    }}
                                                >
                                                    <Typography variant="body2">
                                                        {msg.from}: {msg.text}
                                                    </Typography>
                                                    {msg.image && (
                                                        <img
                                                            src={msg.image}
                                                            alt="attachment"
                                                            width="100"
                                                            style={{ cursor: 'pointer', borderRadius: '4px', marginTop: '4px' }}
                                                            onClick={() => setFullscreenImage(msg.image)}
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                    <Box display="flex" alignItems="center" style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}>
                                        <TextField
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            variant="outlined"
                                            fullWidth
                                            placeholder="Type your message..."
                                            multiline
                                            rows={2}
                                            InputProps={{
                                                endAdornment: (
                                                    <input
                                                        accept="image/*"
                                                        id="raised-button-file"
                                                        type="file"
                                                        style={{ display: 'none' }}
                                                        onChange={handleSelectImage}
                                                    />
                                                ),
                                            }}
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
                                                onClick={() => selectReceptionistAndJoinRoom(receptionist)}
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

                    <Dialog
                        open={!!fullscreenImage}
                        onClose={handleCloseFullscreenImage}
                        maxWidth="md"
                        fullWidth
                        PaperProps={{
                            style: {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }
                        }}
                    >
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            p={2}
                            style={{ position: 'relative' }}
                        >
                            <IconButton
                                style={{
                                    position: 'absolute',
                                    top: 16,
                                    right: 16
                                }}
                                onClick={handleCloseFullscreenImage}
                            >
                                <CloseIcon />
                            </IconButton>
                            <img
                                src={fullscreenImage}
                                alt="fullscreen"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '80vh',
                                    objectFit: 'contain'
                                }}
                            />
                        </Box>
                    </Dialog>
                </>
            )}
        </div>
    );
};

export default ChatPopup_ForPatient;
