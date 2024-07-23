// src/FeedbackForm.js
import React, { useState, useContext } from 'react';
import { Box, Button, TextField, Typography, Snackbar, Alert } from '@mui/material';
import Rating from '@mui/material/Rating';
import { AuthContext } from '../../utils/AuthContext';
import Header from '../../layouts/Header';

const FeedbackForm = () => {
    const { isLoggedIn, token } = useContext(AuthContext);
    const [rating, setRating] = useState(4);
    const [feedback, setFeedback] = useState('');
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const getpatientId=localStorage.getItem('accountId');
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isLoggedIn) {
            setSnackbarSeverity('error');
            setSnackbarMessage('Please log in to submit feedback.');
            setSnackbarOpen(true);
            return;
        }
        if(getpatientId==null){
            setSnackbarSeverity('error');
            setSnackbarMessage('Please log in to submit feedback.');
            setSnackbarOpen(true);
            return;
        }

        try {
            const response = await fetch('https://localhost:7240/api/PatientFeedback/CreateFeedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    patientId: getpatientId, // Replace with actual patient ID
                    content: feedback,
                    star: rating,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit feedback');
            }

            // Clear the form on successful submission
            setRating(4);
            setFeedback('');
            setSnackbarSeverity('success');
            setSnackbarMessage('Feedback submitted successfully!');
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarSeverity('error');
            setSnackbarMessage(error.message);
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
        <Header/>
        <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: 'background.paper',
        width: '100%',
        maxWidth: 400,
        bgcolor: '#e0f7fa', // Màu xanh nhạt
      }}
    >
      <Typography variant="h5" gutterBottom>
            Cảm ơn bạn đã sử dụng dịch vụ
              </Typography>
      <Typography variant="body1" gutterBottom>
        Vui lòng đánh giá chất lượng dịch vụ,sự phản hồi của bạn sẽ giúp tôi cải thiện chất lượng tốt hơn!
          </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Rating
        name="rating"
        value={rating}
        onChange={(event, newValue) => {
          setRating(newValue);
        }}
        size="large"
        sx={{ mb: 2 }}
      />
      <TextField
        label="Tell us about your experience!"
        multiline
        rows={4}
        variant="outlined"
        value={feedback}
        onChange={(event) => setFeedback(event.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" color="primary">
        Send
      </Button>

   
    </Box>   <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};



export default FeedbackForm;
