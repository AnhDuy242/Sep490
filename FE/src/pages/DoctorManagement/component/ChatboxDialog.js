import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, List, ListItem, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Snackbar, Alert, Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ClearIcon from '@mui/icons-material/Clear';

const ChatBox = ({ open, onClose, conversationId, patientIdSelected }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImagePreview, setSelectedImagePreview] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success, error, warning, info
    const [previewImageUrl, setPreviewImageUrl] = useState('');
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const accountId = localStorage.getItem('accountId');

    const fetchMessages = async () => {
        try {
            const response = await fetch(`https://localhost:7240/api/Messages/GetAllMessagesByConversationId/${conversationId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const messages = data.$values || data;
            setMessages(messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchMessages();
        }
    }, [open, conversationId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() && !selectedImage) {
            setSnackbarMessage('Please enter a message or select an image before sending.');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            return;
        }
    
        let imageUrl = '';
        const nowUtc = new Date();
    
        // Chuyển đổi thời gian UTC sang giờ Việt Nam
        const offset = 7; // Múi giờ Việt Nam là UTC+7
        const nowVietnam = new Date(nowUtc.getTime() + offset * 60 * 60 * 1000);
        
        // Định dạng thời gian dưới dạng ISO 8601
        const sentAt = nowVietnam.toISOString(); 

        if (selectedImage) {
            const uploadFormData = new FormData();
            uploadFormData.append('file', selectedImage);

            try {
                const uploadResponse = await fetch('https://localhost:7240/api/Upload/upload', {
                    method: 'POST',
                    body: uploadFormData,
                });

                if (!uploadResponse.ok) {
                    const errorText = await uploadResponse.text();
                    setSnackbarMessage(`Error uploading image: ${errorText}`);
                    setSnackbarSeverity('error');
                    setSnackbarOpen(true);
                    return;
                }

                const uploadResult = await uploadResponse.json();
                imageUrl = uploadResult.url;
            } catch (error) {
                setSnackbarMessage(`Error uploading image: ${error.message}`);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }
        }

        const message = {
            conversationId,
            senderId: parseInt(accountId),
            receiverId: patientIdSelected,
            messageText: newMessage,
            imageUrl: imageUrl || null,
            sentAt
        };

        try {
            const messageResponse = await fetch('https://localhost:7240/api/Messages/Create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message),
            });

            if (!messageResponse.ok) {
                const errorText = await messageResponse.text();
                setSnackbarMessage(`Error creating message: ${errorText}`);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }

            setNewMessage('');
            setSelectedImage(null);
            setSelectedImagePreview('');
            fetchMessages();
            setSnackbarMessage('Message sent successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage(`Error creating message: ${error.message}`);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedImagePreview('');
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setSelectedImagePreview('');
    };

    const handleCloseChat = () => {
        setMessages([]);
        setNewMessage('');
        setSelectedImage(null);
        setSelectedImagePreview('');
        onClose();
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleImageClick = (url) => {
        setPreviewImageUrl(url);
        setPreviewDialogOpen(true);
    };

    const handleClosePreviewDialog = () => {
        setPreviewImageUrl('');
        setPreviewDialogOpen(false);
    };

    return (
        <>
            <Dialog open={open} onClose={handleCloseChat} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Chat
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleCloseChat}
                        aria-label="close"
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" height="400px" overflow="auto" id="chatBox">
                        <List sx={{ padding: 0 }}>
                            {messages.map((msg) => {
                                const messageTime = new Date(msg.sentAt);
                                const formattedTime = messageTime.toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                });
                                const fullDateTime = messageTime.toLocaleString('vi-VN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    second: 'numeric',
                                });
                                
                                return (
                                    <ListItem
                                        key={msg.id}
                                        sx={{
                                            justifyContent: msg.senderId === parseInt(accountId) ? 'flex-end' : 'flex-start',
                                            padding: 0,
                                        }}
                                    >
                                        <Tooltip
                                            title={fullDateTime}
                                            arrow
                                        >
                                            <Box
                                                sx={{
                                                    maxWidth: '80%',
                                                    p: 1,
                                                    borderRadius: '8px',
                                                    bgcolor: msg.senderId === parseInt(accountId) ? 'primary.main' : 'grey.300',
                                                    color: msg.senderId === parseInt(accountId) ? 'white' : 'black',
                                                    textAlign: 'left',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'flex-start',
                                                    ml: msg.senderId === parseInt(accountId) ? 'auto' : 'none',
                                                    mb: 1,
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                                    transition: 'background-color 0.2s ease',
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                                    {msg.messageText}
                                                </Typography>
                                                {msg.imageUrl && (
                                                    <img
                                                        src={msg.imageUrl}
                                                        alt="message attachment"
                                                        style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '8px', cursor: 'pointer' }}
                                                        onClick={() => handleImageClick(msg.imageUrl)}
                                                    />
                                                )}
                                                <Typography variant="caption" sx={{ mt: 0.5 }}>
                                                    {formattedTime}
                                                </Typography>
                                            </Box>
                                        </Tooltip>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="imageUpload"
                        />
                        <label htmlFor="imageUpload">
                            <IconButton color="primary" component="span">
                                <AttachFileIcon />
                            </IconButton>
                        </label>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="message"
                            label="Type your message"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSendMessage();
                                    e.preventDefault();
                                }
                            }}
                            InputProps={{
                                endAdornment: selectedImagePreview && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                                        <img
                                            src={selectedImagePreview}
                                            alt="Selected preview"
                                            style={{ maxWidth: '150px', borderRadius: '8px', marginRight: '8px' }}
                                        />
                                        <IconButton onClick={handleRemoveImage} color="secondary">
                                            <ClearIcon />
                                        </IconButton>
                                    </Box>
                                ),
                            }}
                        />
                        <IconButton onClick={handleSendMessage} color="primary">
                            <SendIcon />
                        </IconButton>
                    </Box>
                </DialogActions>
            </Dialog>
            <Dialog
                open={previewDialogOpen}
                onClose={handleClosePreviewDialog}
                fullScreen
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        backgroundColor: 'black',
                    }}
                >
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleClosePreviewDialog}
                        aria-label="close"
                        sx={{ position: 'absolute', right: 16, top: 16, color: 'white' }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <img
                        src={previewImageUrl}
                        alt="Full-screen preview"
                        style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain' }}
                    />
                </Box>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={handleCloseSnackbar}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ChatBox;
