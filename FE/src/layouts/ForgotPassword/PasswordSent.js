import React, { useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header';
import Navbar from '../Navbar';
import Footer from '../Footer';

const PasswordSent = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const phoneNumber = location.state?.phoneNumber || 'Unknown phone number';

    useEffect(() => {
        // Redirect to homepage after 5 seconds
        const timer = setTimeout(() => {
            navigate('/');
        }, 5000); // 5 seconds delay

        return () => clearTimeout(timer); // Cleanup timer on component unmount
    }, [navigate]);

    return (
        <>
            <Header/>
            <Navbar/>
            <Grid container spacing={0} sx={{ height: '100vh' }}>
                <Grid item xs={12} sx={{ height: '100%' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            textAlign: 'center',
                            padding: '20px',
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                        Một mật khẩu mới đã được gửi đến số điện thoại: {phoneNumber}.
                        </Typography>
                        <Typography>
                            Bạn sẽ được chuyển hướng về trang chủ sau vài giây.
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Footer/>
        </>
    );
};

export default PasswordSent;
