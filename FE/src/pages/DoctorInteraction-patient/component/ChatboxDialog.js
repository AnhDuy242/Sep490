import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    TextField,
    IconButton,
    List,
    ListItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Snackbar,
    Alert
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ClearIcon from '@mui/icons-material/Clear';

const ChatBox = ({ open, onClose, conversationId, doctorIdSelected }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImagePreview, setSelectedImagePreview] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [previewImageUrl, setPreviewImageUrl] = useState('');
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const accountId = localStorage.getItem('accountId');


    const [isSending, setIsSending] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const messagesEndRef = useRef(null);
    const pollingInterval = useRef(null);

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
            fetchMessages(); // Fetch messages immediately when chat opens

            // Set up polling interval
            pollingInterval.current = setInterval(() => {
                fetchMessages();
            }, 3000); // Poll every 3 seconds
        }

        return () => {
            if (pollingInterval.current) {
                clearInterval(pollingInterval.current); // Clear the interval when chat is closed or component unmounts
            }
        };
    }, [open, conversationId]);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() && !selectedImage) {
            setSnackbarMessage('Please enter a message or select an image before sending.');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            return;
        }
    
        setIsSending(true);

        let imageUrl = '';
        const nowUtc = new Date();
        const offset = 7; // Vietnam Time Zone
        const nowVietnam = new Date(nowUtc.getTime() + offset * 60 * 60 * 1000);
        const sentAt = nowVietnam.toISOString();

        if (selectedImage) {
            setIsUploading(true);

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
                    setIsSending(false);
                    setIsUploading(false);
                    return;
                }

                const uploadResult = await uploadResponse.json();
                imageUrl = uploadResult.url;
                setIsUploading(false);

            } catch (error) {
                setSnackbarMessage(`Error uploading image: ${error.message}`);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                setIsSending(false);
                setIsUploading(false);
                return;
            }
        }

        const message = {
            conversationId,
            senderId: parseInt(accountId),
            receiverId: doctorIdSelected,
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
                setIsSending(false);

                return;
            }

            setNewMessage('');
            setSelectedImage(null);
            setSelectedImagePreview('');
            fetchMessages();
            setSnackbarMessage('Message sent successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setIsSending(false);

        } catch (error) {
            setSnackbarMessage(`Error creating message: ${error.message}`);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setIsSending(false);

        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);

        if (file) {
            setIsUploading(true);

            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImagePreview(reader.result);
                setIsUploading(false);

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
            <Dialog open={open} onClose={handleCloseChat} maxWidth="xl" fullWidth>
                <DialogTitle> Chat với bác sĩ</DialogTitle>
                <DialogContent sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
                    <Box flex={1} overflow="auto" sx={{ padding: 2, bgcolor: '#f0f0f0' }}>
                        <List sx={{ padding: 0 }}>
                            {messages.map((msg) => (
                                <ListItem
                                    key={msg.id}
                                    sx={{
                                        justifyContent: msg.senderId === parseInt(accountId) ? 'flex-end' : 'flex-start',
                                        padding: 0,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            maxWidth: '70%',
                                            p: 2,
                                            borderRadius: '8px',
                                            bgcolor: msg.senderId === parseInt(accountId) ? 'primary.main' : 'grey.300',
                                            color: msg.senderId === parseInt(accountId) ? 'white' : 'black',
                                            textAlign: 'left',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            ml: msg.senderId === parseInt(accountId) ? 'auto' : 'none',
                                            mb: 1,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                            transition: 'background-color 0.2s ease',
                                            position: 'relative',
                                            '&:hover::after': {
                                                content: `'${new Date(msg.sentAt).toLocaleString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                })}'`,
                                                position: 'absolute',
                                                bottom: '100%',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                padding: '4px 8px',
                                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                                color: 'white',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                whiteSpace: 'nowrap',
                                                zIndex: 10,
                                            },
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
                                    </Box>
                                </ListItem>
                            ))}
                            <div ref={messagesEndRef} /> {/* Add a ref to the end of the list */}
                        </List>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            mt: 1,
                            bgcolor: 'background.paper',
                            boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.2)',
                            position: 'sticky',
                            bottom: 0,
                            zIndex: 1000,
                        }}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="imageUpload"
                            disabled={isUploading}
                        />
                        <label htmlFor="imageUpload">
                            <IconButton color="primary" component="span" disabled={isUploading}>
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
                            sx={{ flex: 1 }}
                            disabled={isUploading || isSending}
                        />
                        <IconButton color="primary" onClick={handleSendMessage} disabled={isUploading || isSending}>
                            <SendIcon />
                        </IconButton>
                        {selectedImagePreview && (
                            <Box sx={{ position: 'relative', display: 'inline-block', ml: 1 }}>
                                <img
                                    src={selectedImagePreview}
                                    alt="Selected"
                                    style={{ maxWidth: '100px', borderRadius: '8px' }}
                                />
                                <IconButton
                                    color="error"
                                    onClick={handleRemoveImage}
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                    }}
                                >
                                    <ClearIcon />
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
            </Dialog>
            <Dialog open={previewDialogOpen} onClose={handleClosePreviewDialog} maxWidth="xl" fullWidth>
                <DialogTitle>Image Preview</DialogTitle>
                <DialogContent>
                    <img
                        src={previewImageUrl}
                        alt="Preview"
                        style={{ maxWidth: '100%' }}
                    />
                </DialogContent>
                <DialogActions>
                    <IconButton color="error" onClick={handleClosePreviewDialog}>
                        <CloseIcon />
                    </IconButton>
                </DialogActions>
            </Dialog>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ChatBox;
