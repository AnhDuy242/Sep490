import React, { useState, useEffect, useRef } from 'react';
import { Fab, Badge, Dialog, Box, Typography, TextField, Button, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import io from 'socket.io-client';
import { login } from '../../services/Authentication';
import LoginForm from '../LoginForm';
import notificationSound from '../../assets/sound/notification_sound.mp3'; // Import the notification sound
import './ChatPopup_ForPatient.css'; // Import the CSS file for animation

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
    const imageInputRef = useRef(null); // Create a reference for the image input
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedTokenTimestamp = localStorage.getItem('tokenTimestamp');
        if (storedToken && storedTokenTimestamp) {
            const currentTime = new Date().getTime();
            const tokenAge = currentTime - parseInt(storedTokenTimestamp);
            if (storedToken && storedTokenTimestamp) {
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
            }
        }
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

    // Add this useEffect to handle beforeunload event
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (dialogOpen) {
                const message = 'Bạn có chắc chắn muốn rời khỏi trang? Cuộc hội thoại hiện tại sẽ bị mất.';
                event.returnValue = message; // Standard for most browsers
                return message; // For some older browsers
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [dialogOpen]);

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
            imageInputRef.current.value = ''; // Reset the input field
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
        zIndex: 1000, // Ensure the button is above other elements
    };

    const textStyle = {
        position: 'fixed',
        bottom: 50,
        right: 90, // Adjust as needed to position the text next to the Fab button
        zIndex: 1000, // Ensure the text is above other elements
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#FFF',
        backgroundColor: '#1E93E3',
        padding: '8px 12px',
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        animation: 'moveText 2s ease-in-out infinite',
    };

    const dialogStyle = {
        backgroundColor: '#f5f5f5',
        padding: '16px',
        borderRadius: '8px',
    };

    const messageBoxStyle = {
        borderRadius: '12px',
        padding: '10px',
        maxWidth: '70%',
        wordBreak: 'break-word',
        marginBottom: '8px',
    };

    const messageFromMeStyle = {
        backgroundColor: '#1976d2',
        alignSelf: 'flex-end',
    };

    const messageFromOthersStyle = {
        backgroundColor: '#9e9e9e',
        alignSelf: 'flex-start',
    };

    const imagePreviewStyle = {
        cursor: 'pointer',
        borderRadius: '4px',
        marginTop: '4px',
        border: '1px solid #ddd',
        maxWidth: '100px', // Set a max width for the preview
    };

    const fullscreenDialogStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0',
    };

    const fullscreenImageStyle = {
        maxWidth: '90%',
        maxHeight: '80vh',
        objectFit: 'contain',
    };

    const selectReceptionistAndJoinRoom = (receptionistId, receptionistName) => {
        const roomId = `${[nameId, receptionistId].sort().join('_')}`;
        const patientName = localStorage.getItem('name'); // Lấy tên bệnh nhân từ localStorage
        socketRef.current.emit('joinRoom', { receiverId: receptionistId, patientName: patientName });
        setCurrentConversation({ id: roomId, userId: receptionistId, name: receptionistName, messages: [] });
        setUnreadMessages(0);
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

                    <Typography style={textStyle}>Nhận tư vấn ngay</Typography> {/* Add animated text here */}

                    <Dialog open={dialogOpen} onClose={handleToggleDialog} fullWidth maxWidth="md" PaperProps={{ style: dialogStyle }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                            <Typography variant="h6">Chat</Typography>
                            <IconButton edge="end" color="inherit" onClick={handleToggleDialog} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Box p={2}>
                            {showChat ? (
                                <>
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
                                                        ...messageBoxStyle,
                                                        ...(msg.from === 'Me' ? messageFromMeStyle : messageFromOthersStyle),
                                                    }}
                                                >
                                                    <Typography variant="body2">
                                                        {msg.from === 'Me' ? userName : msg.name}: {msg.text}
                                                    </Typography>
                                                    {msg.image && (
                                                        <img
                                                            src={msg.image}
                                                            alt="attachment"
                                                            width="100"
                                                            style={imagePreviewStyle}
                                                            onClick={() => setFullscreenImage(msg.image)}
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
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
                                                        ref={imageInputRef} // Set ref for the input field
                                                    />
                                                ),
                                            }}
                                        />
                                        <label htmlFor="raised-button-file">
                                            <IconButton component="span">
                                                <ImageIcon />
                                            </IconButton>
                                        </label>
                                        {selectedImage && (
                                            <img
                                                src={selectedImage}
                                                alt="selected"
                                                style={imagePreviewStyle}
                                            />
                                        )}
                                        <Button onClick={handleSendMessage} color="primary" variant="contained">
                                            Gửi
                                        </Button>
                                    </Box>
                                </>
                            ) : (
                                <Box>
                                    <Typography variant="h6">Tư vấn viên đang hoạt động</Typography>
                                    <Box mt={2}>
                                        {availableReceptionists.map((receptionist) => (
                                            <Button
                                                key={receptionist.nameId}
                                                onClick={() => selectReceptionistAndJoinRoom(receptionist.nameId, receptionist.name)}
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                style={{ marginBottom: '8px' }}
                                            >
                                                {receptionist.name}
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
                        PaperProps={{ style: fullscreenDialogStyle }}
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
                                style={fullscreenImageStyle}
                            />
                        </Box>
                    </Dialog>
                </>
            )}
        </div>
    );
};

export default ChatPopup_ForPatient;
