import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent, Typography, Button, Select, MenuItem, Snackbar, Alert, Grid, Divider, IconButton, List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Pagination } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import { styled } from '@mui/material/styles';
import axios from 'axios';

// Custom styled StarIcon for gold color (filled stars)
const GoldStarIcon = styled(StarIcon)(({ theme }) => ({
    color: 'gold',
}));

// Custom styled StarIcon for disabled color (empty stars)
const DisabledStarIcon = styled(StarIcon)(({ theme }) => ({
    color: 'lightgray', // Adjust the color as needed
}));

// Function to render star icons based on rating
const StarRating = ({ rating }) => {
    return (
        <div>
            {[...Array(5)].map((_, index) => (
                index < rating ? (
                    <GoldStarIcon key={index} />
                ) : (
                    <DisabledStarIcon key={index} />
                )
            ))}
        </div>
    );
};

// FeedbackResponseDropdown component to handle dropdown and display responses
const FeedbackResponseDropdown = ({ feedbackId }) => {
    const [responses, setResponses] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            // Fetch feedback responses when dropdown is open
            axios.get(`https://localhost:7240/api/ReceptionistFeedback/GetFeedbackResponses_2/${feedbackId}`)
                .then(response => setResponses(response.data.$values))
                .catch(error => console.error('Error fetching responses:', error));
        }
    }, [open, feedbackId]);

    return (
        <div>
            <IconButton
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-controls={`responses-${feedbackId}`}
            >
                <ExpandMoreIcon />
            </IconButton>
            {open && (
                <List id={`responses-${feedbackId}`} style={{ marginTop: 10 }}>
                    {responses.map(response => (
                        <ListItem key={response.resId}>
                            <ListItemText
                                primary={response.content}
                                secondary={`Ngày: ${new Date(response.date).toLocaleDateString()}`}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </div>
    );
};

const FeedbackPage = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
    const [filter, setFilter] = useState('all');
    const [starFilter, setStarFilter] = useState('all');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);
    const [responseContent, setResponseContent] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 10; // Number of items per page

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    useEffect(() => {
        filterFeedbacks();
    }, [filter, starFilter, feedbacks]);

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get('https://localhost:7240/api/ReceptionistFeedback/GetFeedbacks'); // API to get feedbacks
            setFeedbacks(response.data.$values);
            setLoading(false);
        } catch (error) {
            setSnackbarMessage('Không thể tải phản hồi.');
            setSnackbarOpen(true);
            setLoading(false);
        }
    };

    const filterFeedbacks = () => {
        let filtered = feedbacks;

        if (filter === 'replied') {
            filtered = filtered.filter(fb => fb.isReply);
        } else if (filter === 'unreplied') {
            filtered = filtered.filter(fb => !fb.isReply);
        }

        if (starFilter !== 'all') {
            filtered = filtered.filter(fb => fb.star === parseInt(starFilter));
        }

        // Apply pagination
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setFilteredFeedbacks(filtered.slice(startIndex, endIndex));
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleStarFilterChange = (event) => {
        setStarFilter(event.target.value);
    };

    const handlePaginationChange = (event, value) => {
        setPage(value);
    };

    const handleRespondClick = (feedbackId) => {
        setSelectedFeedbackId(feedbackId);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setResponseContent('');
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleResponseSubmit = async () => {
        const reId = localStorage.getItem('accountId'); // Fetch reId from local storage
    
        try {
            // Submit the response feedback
            await axios.post('https://localhost:7240/api/ReceptionistFeedback/ResponseFeedback', null, {
                params: {
                    fId: selectedFeedbackId,
                    reId: reId,
                    content: responseContent
                }
            });
    
            // Mark feedback as replied
            await axios.put(`https://localhost:7240/api/ReceptionistFeedback/MarkFeedbackAsReplied/${selectedFeedbackId}`);
    
            setSnackbarMessage('Phản hồi đã được gửi thành công.');
            setSnackbarOpen(true);
            setDialogOpen(false);
            setResponseContent('');
            fetchFeedbacks(); // Refresh feedbacks
            setSelectedFeedbackId('');

        } catch (error) {
            setSnackbarMessage('Lỗi khi gửi phản hồi.');
            setSnackbarOpen(true);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Phản hồi
            </Typography>

            <Select
                value={filter}
                onChange={handleFilterChange}
                variant="outlined"
                fullWidth
                style={{ marginBottom: 20 }}
            >
                <MenuItem value="all">Tất cả</MenuItem>
                <MenuItem value="replied">Đã phản hồi</MenuItem>
                <MenuItem value="unreplied">Chưa phản hồi</MenuItem>
            </Select>

            <Select
                value={starFilter}
                onChange={handleStarFilterChange}
                variant="outlined"
                fullWidth
                style={{ marginBottom: 20 }}
            >
                <MenuItem value="all">Tất cả sao</MenuItem>
                <MenuItem value="1">1 sao</MenuItem>
                <MenuItem value="2">2 sao</MenuItem>
                <MenuItem value="3">3 sao</MenuItem>
                <MenuItem value="4">4 sao</MenuItem>
                <MenuItem value="5">5 sao</MenuItem>
            </Select>

            {loading ? (
                <Typography variant="body1">Đang tải...</Typography>
            ) : (
                <Grid container spacing={2}>
                    {filteredFeedbacks.map(feedback => (
                        <Grid item xs={12} sm={6} md={4} key={feedback.feedId}>
                            <Card
                                variant="outlined"
                                style={{
                                    marginBottom: 10,
                                    backgroundColor: feedback.isReply ? '#d1e7dd' : '#f8d7da', // Green for replied, red for unreplied
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6">{feedback.content}</Typography>
                                    <Typography variant="body2">Ngày: {new Date(feedback.date).toLocaleDateString()}</Typography>
                                    <Typography variant="body2">
                                       <StarRating rating={feedback.star} />
                                    </Typography>
                                    <Typography variant="body2">Tên bệnh nhân: {feedback.patientName}</Typography> {/* Display patient name */}
                                    <Divider style={{ margin: '10px 0' }} />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleRespondClick(feedback.feedId)}
                                    >
                                        Phản hồi
                                    </Button>
                                    <FeedbackResponseDropdown feedbackId={feedback.feedId} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Pagination
                count={Math.ceil(feedbacks.length / itemsPerPage)}
                page={page}
                onChange={handlePaginationChange}
                style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes('Lỗi') ? 'error' : 'success'}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Dialog for responding to feedback */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Phản hồi Phản hồi</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="content"
                        label="Nội dung phản hồi"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={responseContent}
                        onChange={(e) => setResponseContent(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleResponseSubmit} color="primary">
                        Gửi
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default FeedbackPage;
