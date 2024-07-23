import React, { useState, useEffect } from 'react';
import Header from '../../layouts/Header';
import NavBar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import { fetchDoctors } from '../../services/doctorListHomePage';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import img from '../../assets/images/images (1).jpg'; // Import image

const ListDoctorView = () => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const getDoctors = async () => {
            const data = await fetchDoctors();
            setDoctors(data);
        };
        getDoctors();
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '150vh' }}>
            <Header />
            <NavBar />
            <Box sx={{ flex: 1 }}>
                <Container sx={{ mt:10, maxWidth: 'lg' }}> {/* Adjust maxWidth */}
                    <Grid container spacing={50}>
                        {doctors.map((doctor) => (
                            <Grid item key={doctor.$id} xs={12} sm={6} md={4} lg={3}> {/* Adjust Grid sizes */}
                                <Card sx={{ width: '100%', maxWidth: 600, minWidth: 300 }}> {/* Set Card width */}
                                    <CardMedia
                                        component="img"
                                        height="150"
                                        image={img}
                                        alt={doctor.name}
                                        sx={{
                                            borderRadius: '50%',
                                            width: '150px',
                                            height: '150px',
                                            objectFit: 'cover',
                                            margin: 'auto',
                                        }}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            Bác sĩ : {doctor.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Chuyên khoa: {doctor.allDepartmentName}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
            <Footer />
        </Box>
    );
}

export default ListDoctorView;
