import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Badge } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import ChatIcon from '@mui/icons-material/Chat';
import io from 'socket.io-client';
import LoginForm from '../../LoginForm';
import { login } from '../../../services/Authentication';

const tokenTimeout = 3600000; // 1 hour in milliseconds

const Chatpopup_ForReceptionist = () => {
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [inputMessage, setInputMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const nameId = localStorage.getItem('nameId');
    const currentUserId = nameId;
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

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
            setConversations((prevConversations) => {
                const existingConversation = prevConversations.find(c => c.id === roomId);
                if (existingConversation) return prevConversations;
                return [...prevConversations, { id: roomId, nameId, messages: [] }];
            });
        });

        socketRef.current.on('message', (message) => {
            setConversations((prevConversations) => {
                const updatedConversations = prevConversations.map(conversation => {
                    if (conversation.id === message.roomId) {
                        const messageExists = conversation.messages.some(msg => msg.id === message.id);
                        if (!messageExists) {
                            return { ...conversation, messages: [...conversation.messages, message] };
                        }
                    }
                    return conversation;
                });

                if (!updatedConversations.find(c => c.id === message.roomId)) {
                    updatedConversations.push({ id: message.roomId, messages: [message] });
                }

                const count = updatedConversations.reduce((acc, conversation) => {
                    return acc + conversation.messages.filter(msg => !msg.read && msg.from !== currentUserId).length;
                }, 0);
                setUnreadCount(count);

                return updatedConversations;
            });
        });

        socketRef.current.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    };

    const handleSendMessage = () => {
        if ((inputMessage.trim() || selectedImage) && socketRef.current && currentConversation) {
            const message = {
                id: Date.now(),
                text: inputMessage.trim(),
                image: selectedImage,
                roomId: currentConversation.id,
                from: currentUserId
            };

            socketRef.current.emit('message', {
                receiverId: currentConversation.nameId,
                message
            });

            setCurrentConversation((prevConversation) => ({
                ...prevConversation,
                messages: [...prevConversation.messages, message]
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

    const handleOpenDialog = () => {
        if (currentConversation) {
            socketRef.current.emit('markMessagesAsRead', { roomId: currentConversation.id });
        }

        const updatedConversations = conversations.map(conversation => {
            if (conversation.id === currentConversation?.id) {
                return {
                    ...conversation,
                    messages: conversation.messages.map(msg => ({
                        ...msg,
                        read: true
                    }))
                };
            }
            return conversation;
        });
        setConversations(updatedConversations);
        setUnreadCount(0);
        setDialogOpen(true);
    };

    useEffect(() => {
        if (currentConversation) {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [currentConversation]);

    useEffect(() => {
        if (currentConversation) {
            const updatedConversation = conversations.find(c => c.id === currentConversation.id);
            if (updatedConversation) {
                setCurrentConversation(updatedConversation);
            }
        }
    }, [conversations]);

    return (
        <>
            <IconButton
                color="primary"
                style={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    zIndex: 1000
                }}
                onClick={handleOpenDialog}
            >
                <Badge badgeContent={unreadCount} color="error">
                    <ChatIcon fontSize="large" />
                </Badge>
            </IconButton>

            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    sx: {
                        bgcolor: 'background.paper',
                    }
                }}
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Receptionist Chat</Typography>
                        <IconButton onClick={() => setDialogOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {isLoggedIn ? (
                        <Box display="flex" flexDirection="column" height="60vh">
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
                                                <Typography variant="body2">User: {conversation.nameId}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                                <Box flexGrow={1} p={2} display="flex" flexDirection="column">
                                    {currentConversation ? (
                                        <>
                                            <Box flexGrow={1} overflow="auto">
                                                {currentConversation.messages.map((message, index) => (
                                                    <Box
                                                        key={index}
                                                        display="flex"
                                                        justifyContent={message.from === currentUserId ? 'flex-end' : 'flex-start'}
                                                        mb={1}
                                                    >
                                                        <Box
                                                            p={1}
                                                            bgcolor={message.from === currentUserId ? 'primary.main' : 'grey.300'}
                                                            borderRadius={1}
                                                            maxWidth="70%"
                                                            wordBreak="break-word"
                                                        >
                                                            {message.text && <Typography variant="body1">{message.text}</Typography>}
                                                            {message.image && (
                                                                <img
                                                                    src={message.image}
                                                                    alt="Selected"
                                                                    style={{
                                                                        width: '100%',
                                                                        maxWidth: '300px',
                                                                        height: 'auto',
                                                                        borderRadius: '4px',
                                                                        marginTop: '8px'
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    </Box>
                                                ))}
                                                <div ref={messagesEndRef} />
                                            </Box>
                                            <Box mt={2} display="flex" alignItems="center" position="relative">
                                                <input
                                                    accept="image/*"
                                                    id="image-upload"
                                                    type="file"
                                                    style={{ display: 'none' }}
                                                    onChange={handleSelectImage}
                                                />
                                                <label htmlFor="image-upload">
                                                    <IconButton color="primary" component="span">
                                                        <ImageIcon />
                                                    </IconButton>
                                                </label>
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    placeholder="Type a message"
                                                    value={inputMessage}
                                                    onChange={(e) => setInputMessage(e.target.value)}
                                                    fullWidth
                                                    sx={{
                                                        marginRight: 1,
                                                        '& .MuiInputBase-root': {
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }
                                                    }}
                                                    InputProps={{
                                                        endAdornment: selectedImage && (
                                                            <Box
                                                                component="img"
                                                                src={selectedImage}
                                                                alt="Selected"
                                                                sx={{
                                                                    maxWidth: '100px',
                                                                    height: 'auto',
                                                                    borderRadius: 1,
                                                                    marginLeft: 1
                                                                }}
                                                            />
                                                        )
                                                    }}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={handleSendMessage}
                                                >
                                                    Send
                                                </Button>
                                            </Box>
                                        </>
                                    ) : (
                                        <Typography>No conversation selected</Typography>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    ) : (
                        <LoginForm onLogin={handleLogin} />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Chatpopup_ForReceptionist;
