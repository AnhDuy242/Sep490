import React, { useState, useEffect } from 'react';
import { Fab, Badge, Popover, Box, Typography, TextField, Button } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import io from 'socket.io-client';
import LoginForm from '../LoginForm'; // Import LoginForm
import { login } from '../../services/Authentication';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:3001'); // Connect to Socket.io server

const tokenTimeout = 3600000; // 1 hour in milliseconds

const ChatPopup = () => {
    const [showLogin, setShowLogin] = useState(false); // State to manage login form visibility
    const [anchorEl, setAnchorEl] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate(); // Use useNavigate hook

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

            socket.on('message', (message) => {
                console.log(`Message received: ${message}`);
                setMessages((prevMessages) => [...prevMessages, message]);
            });
        }

        return () => {
            socket.off('message');
            console.log('Toi quit');
        };
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSendMessage = () => {
        const message = inputMessage.trim();
        if (message) {
            socket.emit('message', { to: 'consultant', message });
            console.log(`Message sent: ${message}`);
            setMessages((prevMessages) => [...prevMessages, { from: 'Tôi', message }]);
            setInputMessage('');
        }
    };

    const handleCloseLogin = () => setShowLogin(false);
    const handleShowLogin = () => setShowLogin(true);

    const updateToken = (token) => {
        setIsLoggedIn(true);
        localStorage.setItem('token', token);
        localStorage.setItem('tokenTimestamp', new Date().getTime().toString());
        window.location.href = '/'; // Reload the page
    };

    const handleLogin = async ({ username, password }) => {
        try {
            // Assuming login function returns a token
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
        padding: '16px',
        maxHeight: '300px',
        overflowY: 'auto',
    };

    const closeIconStyle = {
        cursor: 'pointer',
        float: 'right',
        marginTop: '-8px',
        marginRight: '-8px',
    };

    return (
        <>
            <Fab color="primary" style={fabStyle} aria-describedby={id} onClick={handleClick}>
                <Badge badgeContent={messages.length} color="error">
                    <ChatIcon />
                </Badge>
            </Fab>
            {!isLoggedIn && (
                <Popover
                    anchorEl={anchorEl}
                    open={open} // Make sure 'open' prop is passed here
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <Box style={popoverStyle}>
                        <Typography variant="h6">Bạn cần đăng nhập để chat</Typography>
                        <Button onClick={handleShowLogin} variant="contained" color="primary" fullWidth>
                            Đăng nhập
                        </Button>
                    </Box>
                </Popover>
            )}
            {isLoggedIn && (
                <Popover
                    id={id}
                    open={open} // Make sure 'open' prop is passed here
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <Box style={popoverStyle}>
                        <Typography variant="h6">Chat Messages</Typography>
                        <CloseIcon style={closeIconStyle} onClick={handleClose} />
                        <Box mb={2}>
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
                </Popover>
            )}
            <LoginForm 
                show={showLogin} 
                handleLogin={handleLogin} 
                handleClose={handleCloseLogin} 
            />
        </>
    );
};

export default ChatPopup;
