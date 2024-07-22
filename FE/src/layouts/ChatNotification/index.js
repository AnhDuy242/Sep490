// ChatPopup.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Fab, Badge, Popover, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import io from 'socket.io-client';
import { login } from '../../services/Authentication';
import LoginForm from '../LoginForm';

const tokenTimeout = 3600000; // 1 hour in milliseconds

const ChatPopup = () => {
    const [showLogin, setShowLogin] = useState(false); // State to manage login form visibility
    const [anchorEl, setAnchorEl] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null); // State for selected image
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isConnected, setIsConnected] = useState(false); // State to manage socket connection
    const [currentRoomId, setCurrentRoomId] = useState(null); // State to track current room ID
    const [token, setToken] = useState('');

    const socketRef = useRef(null); // Ref to store the socket instance

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedTokenTimestamp = localStorage.getItem('tokenTimestamp');
        if (storedToken && storedTokenTimestamp) {
            const currentTime = new Date().getTime();
            const tokenAge = currentTime - parseInt(storedTokenTimestamp);
            if (tokenAge < tokenTimeout) {
                setIsLoggedIn(true);
                setToken(storedToken); // Set token state
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
        
        // Send token to server for login and authentication
        socketRef.current.emit('login', { token });

        socketRef.current.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socketRef.current.on('disconnect', () => {
            console.log('Socket disconnected');
        });
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleStartChat = () => {
        if (!isConnected && token) {
            connectSocket(token); // Kết nối socket với token sau khi đăng nhập thành công
            setIsConnected(true);
    
            socketRef.current.on('connect', () => {
                console.log('Socket connected');
                // Sau khi kết nối, gửi yêu cầu tham gia room chat với receptionist
                socketRef.current.emit('joinRoom', { receiverId:2 }); // Thay thế bằng id thực của receptionist
            });
    
            socketRef.current.on('message', (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });
    
            socketRef.current.on('disconnect', () => {
                setIsConnected(false);
                console.log('Socket disconnected');
            });
        }
    };
    

    const handleSendMessage = () => {
        if (inputMessage.trim() || selectedImage) {
            const message = {
                text: inputMessage.trim(),
                image: selectedImage,
                receiverId: 2, // Thay thế bằng id thực của receptionist
            };
    
            socketRef.current.emit('message', message);
            setMessages((prevMessages) => [...prevMessages, { ...message, fromSelf: true }]);
            setInputMessage('');
            setSelectedImage(null); // Clear selected image after sending
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
        setToken(token); // Update token state
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

    const open = Boolean(anchorEl);
    const id = open ? 'chat-popover' : undefined;

    const fabStyle = {
        position: 'fixed',
        bottom: '16px',
        right: '16px',
    };

    const popoverStyle = {
        padding: '20px',
        width: '300px',
    };

    return (
        <>
            <Fab color="primary" style={fabStyle} onClick={handleClick}>
                <Badge badgeContent={messages.length} color="error">
                    <ChatIcon />
                </Badge>
            </Fab>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <Box sx={popoverStyle}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Chat</Typography>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Button onClick={handleStartChat} variant="contained" color="primary" fullWidth>
                        Start Chat
                    </Button>
                    <Box mt={2}>
                        {messages.map((msg, index) => (
                            <Box key={index} mb={1} display="flex" flexDirection="column" alignItems={msg.fromSelf ? 'flex-end' : 'flex-start'}>
                                {msg.text && (
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            background: msg.fromSelf ? '#cfe9ff' : '#e5e5e5',
                                            padding: '10px',
                                            borderRadius: '10px',
                                        }}
                                    >
                                        {msg.text}
                                    </Typography>
                                )}
                                {msg.image && (
                                    <img src={msg.image} alt="sent" style={{ maxWidth: '100%', marginTop: '10px', borderRadius: '10px' }} />
                                )}
                            </Box>
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
                        InputProps={{
                            endAdornment: (
                                <IconButton color="primary" component="label">
                                    <ImageIcon />
                                    <input type="file" hidden onChange={handleSelectImage} />
                                </IconButton>
                            ),
                        }}
                    />
                    <Button onClick={handleSendMessage} variant="contained" color="primary" fullWidth>
                        Send
                    </Button>
                </Box>
            </Popover>
            <LoginForm 
                show={showLogin} 
                handleLogin={handleLogin} 
                handleClose={handleCloseLogin} 
            />
        </>
    );
};

export default ChatPopup;
