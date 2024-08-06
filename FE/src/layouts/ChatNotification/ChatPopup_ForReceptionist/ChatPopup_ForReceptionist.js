import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Badge } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import ChatIcon from '@mui/icons-material/Chat';
import io from 'socket.io-client';
import LoginForm from '../../LoginForm';
import { login } from '../../../services/Authentication';
import notificationSound from '../../../assets/sound/notification_sound.mp3'; // Import the notification sound
import { Helmet } from 'react-helmet';

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
    const audioRef = useRef(new Audio(notificationSound)); // Create a reference for the audio object
    const [userName, setUserName] = useState('');
    const name = localStorage.getItem('name');
    const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);


    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedTokenTimestamp = localStorage.getItem('tokenTimestamp');
        if (storedToken && storedTokenTimestamp) {
            const currentTime = new Date().getTime();
            const tokenAge = currentTime - parseInt(storedTokenTimestamp);
            const storedUserName = localStorage.getItem('name');
            if (storedUserName) {
                setUserName(storedUserName);
            }
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
        socketRef.current.emit('loginReceptionist', { token, nameId, name });

        socketRef.current.on('newConversation', ({ roomId, nameId, name }) => {
            setConversations((prevConversations) => {
                const existingConversation = prevConversations.find(c => c.id === roomId);
                if (existingConversation) return prevConversations;
                return [...prevConversations, { id: roomId, nameId, name, messages: [] }];
            });
        });

        socketRef.current.on('message', (message) => {
            setConversations((prevConversations) => {
                const updatedConversations = prevConversations.map(conversation => {
                    if (conversation.id === message.roomId) {
                        const messageExists = conversation.messages.some(msg => msg.id === message.id);
                        if (!messageExists) {
                            return {
                                ...conversation, messages: [...conversation.messages, message],
                                unreadCount: conversation.unreadCount ? conversation.unreadCount + 1 : 1
                            };
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
                const totalUnread = updatedConversations.reduce((acc, conversation) => acc + (conversation.unreadCount || 0), 0);
                setTotalUnreadMessages(totalUnread);
                // Play notification sound only if the message is from someone other than the current user
                if (message.from !== currentUserId) {
                    audioRef.current.play();
                }

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
            setTotalUnreadMessages(prevTotal => prevTotal - (conversation.unreadCount || 0));

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
            <Helmet>
            <title>{totalUnreadMessages > 0 ? `(${totalUnreadMessages}) tin nhắn mới` : 'Phòng khám 68A'}</title>
        </Helmet>
            <IconButton
                color="primary"
                style={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    zIndex: 1000,
                    backgroundColor: '#f5f5f5',
                    borderRadius: '50%',
                    padding: 8,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' // Add shadow effect
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
                        bgcolor: '',
                        borderRadius: 2,
                        boxShadow: 24,
                    }
                }}
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Chat</Typography>
                        <IconButton onClick={() => setDialogOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {isLoggedIn ? (
                        <Box display="flex" flexDirection="column" height="60vh">
                            <Box display="flex" flexGrow={1} borderRadius={1} border="1px solid #ddd">
                                <Box flex="0 0 200px" bgcolor="grey.100" p={2} borderRight="1px solid #ddd">
                                    <Typography variant="h6">Danh sách cuộc hội thoại</Typography>
                                    <Box>
                                        {conversations.map(conversation => (
                                            <Box
                                                key={conversation.id}
                                                p={1}
                                                mb={1}
                                                bgcolor={currentConversation?.id === conversation.id ? 'primary.light' : 'grey.100'}
                                                borderRadius={1}
                                                onClick={() => handleConversationClick(conversation.id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <Typography variant="body2" noWrap>Patient: {conversation.name}</Typography>
                                            </Box>
                                        ))}

                                    </Box>
                                </Box>
                                <Box flexGrow={1} p={2} display="flex" flexDirection="column">
                                    {currentConversation ? (
                                        <>
                                            <Box flexGrow={1} overflow="auto" mb={2} border="1px solid #ddd" borderRadius={1} p={2}>
                                                {currentConversation.messages.map((message, index) => (
                                                    <Box
                                                        key={index}
                                                        display="flex"
                                                        justifyContent={message.from === currentUserId ? 'flex-end' : 'flex-start'}
                                                        mb={1}
                                                    >
                                                        <Box
                                                            p={1}
                                                            bgcolor={message.from === currentUserId ? 'primary.main' : 'grey.500'}
                                                            borderRadius={1}
                                                            maxWidth="70%"
                                                            color="white"
                                                        >
                                                            <Typography variant="body3">
                                                                {message.from === currentUserId ? userName : currentConversation.name}: {message.text}
                                                            </Typography>
                                                            {message.image && (
                                                                <img
                                                                    src={message.image}
                                                                    alt="Attached"
                                                                    style={{ maxWidth: '100%', cursor: 'pointer', borderRadius: 4, marginTop: 4 }}
                                                                    onClick={() => window.open(message.image, '_blank')}
                                                                />
                                                            )}
                                                        </Box>
                                                    </Box>
                                                ))}
                                                <div ref={messagesEndRef} />
                                            </Box>
                                            <Box display="flex" alignItems="center" p={1} borderTop="1px solid #ddd" bgcolor="background.paper">
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    fullWidth
                                                    value={inputMessage}
                                                    onChange={(e) => setInputMessage(e.target.value)}
                                                    placeholder="Type a message"
                                                    multiline
                                                    minRows={2}
                                                />
                                                <input
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    id="image-upload"
                                                    type="file"
                                                    onChange={handleSelectImage}
                                                />
                                                <label htmlFor="image-upload">
                                                    <IconButton component="span">
                                                        <ImageIcon />
                                                    </IconButton>
                                                </label>
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
                                        <Typography>Chọn cuộc hội thoại</Typography>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    ) : (
                        <LoginForm onSubmit={handleLogin} />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="primary">Đóng</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Chatpopup_ForReceptionist;
