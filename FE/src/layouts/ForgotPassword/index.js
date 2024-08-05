import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid, Snackbar, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import clinic_image from '../../assets/images/forgot_password_image.png';
import Header from '../Header';
import Navbar from '../Navbar';
import Footer from '../Footer';

const ForgotPasswordForm = () => {
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!identifier) {
            setError('Vui lòng nhập số điện thoại.');
            return;
        }

        // Validate phone number format (10 digits)
        if (!/^\d{10}$/.test(identifier)) {
            setError('Vui lòng nhập số điện thoại hợp lệ.');
            return;
        }

        setLoading(true);
        setError(null);
        setSnackbarMessage('');
        try {
            const response = await fetch('https://localhost:7240/api/Authentication/ForgotPassword/ForgotPassword?phoneNumber=' + identifier, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setSnackbarMessage(data.status);
                setSnackbarSeverity('success');
                setTimeout(() => {
                    navigate('/password-sent', { state: { phoneNumber: identifier } }); // Pass phone number to confirmation page
                }, 2000); // Delay 5 seconds before redirect
            } else {
                setSnackbarMessage(data.Status || 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
                setSnackbarSeverity('error');
            }

            setIdentifier('');
        } catch (error) {
            setSnackbarMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
            setSnackbarSeverity('error');
        } finally {
            setLoading(false);
            setSnackbarOpen(true);
        }
    };

    return (
        <>
            <Header/>
            <Navbar/>
            <Grid container spacing={0} sx={{ height: '100vh' }}>
                <Grid item xs={8} sx={{ height: '100%' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            overflow: 'hidden'
                        }}
                    >
                        <img src={clinic_image} alt="Logo" style={{width:'100%',height:'100%'}} />
                    </Box>
                </Grid>
                <Grid item xs={4} sx={{ height: '100%' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            maxWidth: '400px',
                            margin: '0px 10px',
                            padding: '0px 20px',
                            ml:20,
                            borderRadius: '5px',
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Quên mật khẩu
                        </Typography>
                        {error && (
                            <Typography sx={{ color: 'red', mb: 2 }}>{error}</Typography>
                        )}
                        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                            <TextField
                                label="Số điện thoại"
                                fullWidth
                                margin="normal"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={loading}
                                style={{ marginTop: '10px' }}
                            >
                                {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                            </Button>
                        </form>
                        <Typography variant="body2" style={{ marginTop: '10px' }}>
                            <Link to="/" style={{ textDecoration: 'none' }}>Quay lại trang chủ</Link>
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Footer/>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ForgotPasswordForm;
