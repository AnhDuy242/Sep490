import React, { useState, useEffect } from 'react';
import { Dialog, Box, Typography, TextField, Button, Fab, Badge, List, ListItem, ListItemText, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import io from 'socket.io-client';
import LoginForm from '../../LoginForm';
import { login } from '../../../services/Authentication';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:3001');

const tokenTimeout = 3600000; // 1 hour in milliseconds

const ChatPopup_ForReceptionist = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [conversations, setConversations] = useState([]); // All conversations
    const [currentConversation, setCurrentConversation] = useState(null); // Selected conversation
    const [inputMessage, setInputMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedTokenTimestamp = localStorage.getItem('tokenTimestamp');
        if (storedToken && storedTokenTimestamp) {
            const currentTime = new Date().getTime();
            const tokenAge = currentTime - parseInt(storedTokenTimestamp);
            if (tokenAge < tokenTimeout) {
                setIsLoggedIn(true);
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('tokenTimestamp');
            }
        }

        socket.on('message', (message) => {
            setConversations((prevConversations) => {
                const conversationIndex = prevConversations.findIndex(c => c.id === message.conversationId);
                if (conversationIndex >= 0) {
                    const updatedConversations = [...prevConversations];
                    updatedConversations[conversationIndex].messages.push(message);
                    return updatedConversations;
                } else {
                    return [...prevConversations, { id: message.conversationId, messages: [message] }];
                }
            });
        });

        return () => {
            socket.off('message');
        };
    }, [dialogOpen]);

    const handleToggleDialog = () => {
        setDialogOpen(!dialogOpen);
    };

    const handleSendMessage = () => {
        const message = inputMessage.trim();
        if (message && currentConversation) {
            const newMessage = { to: 'consultant', message, conversationId: currentConversation.id };
            socket.emit('message', newMessage);
            setConversations((prevConversations) => {
                const updatedConversations = [...prevConversations];
                const conversationIndex = updatedConversations.findIndex(c => c.id === currentConversation.id);
                updatedConversations[conversationIndex].messages.push({ from: 'Me', message });
                return updatedConversations;
            });
            setInputMessage('');
        }
    };

    const handleCloseLogin = () => setShowLogin(false);
    const handleShowLogin = () => setShowLogin(true);

    const updateToken = (token) => {
        setIsLoggedIn(true);
        localStorage.setItem('token', token);
        localStorage.setItem('tokenTimestamp', new Date().getTime().toString());
        window.location.href = '/';
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

    const handleSelectConversation = (conversation) => {
        setCurrentConversation(conversation);
    };

    const fabStyle = {
        position: 'fixed',
        bottom: '16px',
        right: '16px',
    };

    const dialogStyle = {
        display: 'flex',
        flexDirection: 'row',
        height: '80vh',
        width: '80vw',
    };

    const sidebarStyle = {
        width: '300px',
        flexShrink: 0,
        overflowY: 'auto',
        borderRight: '1px solid #ccc',
    };

    const containerStyle = {
        flexGrow: 1,
        padding: '16px',
        overflowY: 'auto',
    };

    return (
        <>
            <Fab color="primary" style={fabStyle} onClick={handleToggleDialog}>
                <Badge badgeContent={conversations.reduce((count, conv) => count + conv.messages.length, 0)} color="error">
                    <ChatIcon />
                </Badge>
            </Fab>
            <Dialog
                open={dialogOpen}
                onClose={handleToggleDialog}
                maxWidth="lg"
                fullWidth
            >
                <Box sx={dialogStyle}>
                    <Box sx={sidebarStyle}>
                        <Typography variant="h6" sx={{ padding: '16px' }}>Conversations</Typography>
                        <List>
                            {conversations.map((conv, index) => (
                                <ListItem button key={index} onClick={() => handleSelectConversation(conv)}>
                                    <ListItemText primary={`Conversation ${index + 1}`} secondary={`${conv.messages.length} messages`} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    <Box sx={containerStyle}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">Chat</Typography>
                            <IconButton onClick={handleToggleDialog}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        {currentConversation ? (
                            <Box>
                                {currentConversation.messages.map((msg, index) => (
                                    <Typography key={index} variant="body1">
                                        <strong>{msg.from}:</strong> {msg.message}
                                    </Typography>
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="body2">Select a conversation to view the chat</Typography>
                        )}
                        <Box mt={2}>
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
                    </Box>
                </Box>
            </Dialog>
            <LoginForm 
                show={showLogin} 
                handleLogin={handleLogin} 
                handleClose={handleCloseLogin} 
            />
        </>
    );
};

export default ChatPopup_ForReceptionist;
