import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { useLocation } from 'react-router-dom';

const OtpVerification = () => {
  const location = useLocation();
  const { username } = location.state || { username: '' };
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    // Simulate OTP verification success
    setTimeout(() => {
      setLoading(false);
      console.log('OTP verification successful');
      // Handle successful OTP verification
    }, 1000);

    // Commented out fetch request
    // try {
    //   const response = await fetch('http://example.com/verify-otp', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       username: username,
    //       otp: otp,
    //     }),
    //   });

    //   const data = await response.json();

    //   if (!response.ok) {
    //     throw new Error(data.message || 'Something went wrong');
    //   }

    //   console.log('OTP verification successful:', data);
    // } catch (error) {
    //   setError(error.message || 'Đã xảy ra lỗi khi xác nhận OTP');
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: 300,
          padding: 3,
          border: '1px solid #ccc',
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Xác nhận OTP
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Nhập mã OTP"
          fullWidth
          margin="normal"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? 'Đang xử lý...' : 'Xác nhận'}
        </Button>
      </Box>
    </Box>
  );
};

export default OtpVerification;
