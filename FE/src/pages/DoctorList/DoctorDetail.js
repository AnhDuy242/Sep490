import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CardMedia, Grid, Breadcrumbs, Link } from '@mui/material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import defaultImg from '../../assets/images/images (1).jpg'; // Import default image
import { Helmet } from 'react-helmet';
import Footer from '../../layouts/Footer';
import Navbar from '../../layouts/Navbar';
import Header from '../../layouts/Header';

const DoctorDetail = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const navigate = useNavigate(); // Hook to navigate

    useEffect(() => {
        const fetchDoctorDetail = async () => {
            try {
                const response = await axios.get(`https://localhost:7240/api/Header/GetDoctorDetailById?id=${id}`);
                setDoctor(response.data.$values[0]);
            } catch (error) {
                console.error('Error fetching doctor details:', error);
            }
        };

        fetchDoctorDetail();
    }, [id]);

    if (!doctor) {
        return <p>Loading...</p>;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Helmet>
                <title>Doctor Detail</title>
            </Helmet>
            <Header />
            <Navbar />
            <Container sx={{ mt: 10, maxWidth: 'lg', mb: 100, px: { xs: 2, sm: 4, md: 8 }, width: '90%' }}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 3 }}>
                    <Link component={RouterLink} to="/" color="inherit">
                        Trang chủ
                    </Link>
                    <Link component={RouterLink} to="/listDoctorView" color="inherit">
                        Đội ngũ bác sĩ
                    </Link>
                    <Typography color="text.primary">
                        Bác sĩ: {doctor.name}
                    </Typography>
                </Breadcrumbs>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <CardMedia
                            component="img"
                            image={doctor.img || defaultImg}
                            alt={doctor.name}
                            sx={{
                                borderRadius: '10px',
                                height: '500px',
                                width: '100%',
                                maxWidth: '500px',
                                objectFit: 'fill',
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <Box sx={{ padding: 2 }}>
                            <Typography variant="h4" component="div" sx={{ color: '#0E568A', padding: 1 }}>
                                Bác sĩ: {doctor.name}
                            </Typography>
                            <Typography variant="h6" component="div" sx={{ marginTop: 2 }}>
                                {doctor.description}
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 1 }}>
                                Chuyên ngành: {doctor.allDepartmentName}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
            <Box sx={{ marginTop: 'auto' }}> {/* Push Footer to the bottom */}
                <Footer />
            </Box>
        </Box>
    );
};

export default DoctorDetail;
