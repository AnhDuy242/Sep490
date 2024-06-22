import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import clinic_image from '../../assets/images/forgot_password_image.png';

const ForgotPasswordForm = () => {
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate null check for identifier (email or phone number)
        if (!identifier) {
            setError('Vui lòng nhập email hoặc số điện thoại.');
            return;
        }

        // Validate phone number format (10 digits)
        if (/^\d{10}$/.test(identifier)) {
            // Identifier is a valid phone number
            // Handle logic for phone number
            console.log('Identifier is a valid phone number:', identifier);
        } else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(identifier)) {
            // Identifier is a valid email
            // Handle logic for email
            console.log('Identifier is a valid email:', identifier);
        } else {
            setError('Vui lòng nhập email hoặc số điện thoại hợp lệ.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage('');
        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier }),
            });

            if (!response.ok) {
                throw new Error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
            }

            const data = await response.json();

            // Giả sử thành công
            setSuccessMessage('Yêu cầu reset mật khẩu đã được gửi.');
            setIdentifier(''); // Reset trường identifier sau khi gửi thành công
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid container spacing={0} sx={{ height: '100vh' }}>
            <Grid item xs={8} sx={{ height: '100%' }}>
                {/* Box 1: Logo */}
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
                {/* Box 2: Forgot Password Form */}
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
                        border: '1px solid #FF343B',
                        borderRadius: '5px',
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Quên mật khẩu
                    </Typography>
                    {successMessage && (
                        <Typography sx={{ color: 'green', mb: 2 }}>{successMessage}</Typography>
                    )}
                    {error && (
                        <Typography sx={{ color: 'red', mb: 2 }}>{error}</Typography>
                    )}
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <TextField
                            label="Email hoặc số điện thoại"
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
                        Quay lại trang đăng nhập?{' '}
                        <Link to="/login" style={{ textDecoration: 'none' }}>Đăng nhập</Link>
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    );
};

export default ForgotPasswordForm;
