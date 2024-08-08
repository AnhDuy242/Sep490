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
    Alert,
    Tooltip
} from '@mui/material';
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
            pollingInterval.current = setInterval(fetchMessages, 3000); // Poll every 3 seconds
        } else {
            clearInterval(pollingInterval.current); // Clear the interval if chat is closed
        }

        return () => {
            clearInterval(pollingInterval.current); // Clear interval on component unmount
        };
    }, [open, conversationId]);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() && !selectedImage) {
            setSnackbarMessage('Không được để trống .');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
            return;
        }
    
        setIsSending(true);
    
        let imageUrl = '';
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
                    setSnackbarMessage(`Lỗi tải ảnh: ${errorText}`);
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
                setSnackbarMessage(`Lỗi tải ảnh: ${error.message}`);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                setIsSending(false);
                setIsUploading(false);
                return;
            }
        }
    
        const nowUtc = new Date();
        const offset = 7; // Múi giờ Việt Nam
        const nowVietnam = new Date(nowUtc.getTime() + offset * 60 * 60 * 1000);
        const sentAt = nowVietnam.toISOString();
    
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
                setSnackbarMessage(`Lỗi tải message: ${errorText}`);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                setIsSending(false);
                return;
            }
    
            setNewMessage('');
            setSelectedImage(null);
            setSelectedImagePreview('');
            setSnackbarMessage('Gửi tin nhắn thành công!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setIsSending(false);
        } catch (error) {
            setSnackbarMessage(`Gửi tin nhắn thất bại: ${error.message}`);
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
            <Dialog open={open} onClose={handleCloseChat} maxWidth="lg" fullWidth>
                <DialogTitle>Chat với bệnh nhân</DialogTitle>
                <DialogContent dividers sx={{ height: 10000 }}>
                    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
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
                                        <Tooltip
                                            title={new Date(msg.sentAt).toLocaleString('vi-VN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                            })}
                                            arrow
                                            placement={msg.senderId === parseInt(accountId) ? 'left' : 'right'}
                                        >
                                            <Box
                                                sx={{
                                                    maxWidth: '80%',
                                                    p: 3, // Tăng padding để tin nhắn trông to hơn
                                                    borderRadius: '12px', // Tăng borderRadius
                                                    bgcolor: msg.senderId === parseInt(accountId) ? 'primary.main' : 'grey.300',
                                                    color: msg.senderId === parseInt(accountId) ? 'white' : 'black',
                                                    textAlign: 'left',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'flex-start',
                                                    ml: msg.senderId === parseInt(accountId) ? 'auto' : 'none',
                                                    mb: 1,
                                                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)', // Tăng shadow
                                                    transition: 'background-color 0.2s ease',
                                                    position: 'relative',
                                                }}
                                            >
                                                <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
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
                                        </Tooltip>
                                    </ListItem>
                                ))}
                                <div ref={messagesEndRef} /> {/* Thêm ref vào cuối danh sách */}
                            </List>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%' }}>
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
                            label={isSending ? "Đang gửi tin nhắn..." : "Type your message"}
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            sx={{ flex: 1 }}
                            disabled={isUploading || isSending}  // Disable the input field when isSending is true
                        />
                        <IconButton color="primary" onClick={handleSendMessage}  disabled={isUploading || isSending}>
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
                </DialogActions>
            </Dialog>
            <Dialog open={previewDialogOpen} onClose={handleClosePreviewDialog} maxWidth="md" fullWidth>
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
