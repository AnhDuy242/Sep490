import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Box, TextField, Pagination, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // Import RouterLink for breadcrumbs
import Header from '../../layouts/Header';
import NavBar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import { fetchDoctors } from '../../services/doctorListHomePage';
import { Helmet } from 'react-helmet';
import defaultImg from '../../assets/images/images (1).jpg'; // Import default image

const ListDoctorView = () => {
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8; // Number of items per page

    useEffect(() => {
        const getDoctors = async () => {
            const data = await fetchDoctors();
            setDoctors(data);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
        };
        getDoctors();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(1); // Reset to first page on search
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    // Filter and paginate doctors
    const filteredDoctors = doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startIndex = (page - 1) * itemsPerPage;
    const paginatedDoctors = filteredDoctors.slice(startIndex, startIndex + itemsPerPage);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '150vh' }}>
            <Helmet>
                <title>Đội ngũ bác sĩ</title>
            </Helmet>
            <Header />
            <NavBar />
            <Box sx={{ flex: 1 }}>
                <Container sx={{ mt: 10, maxWidth: 'lg' }}>
                    {/* Breadcrumbs */}
                    <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 3 }}>
                        <Link component={RouterLink} to="/" color="inherit">
                            Trang chủ
                        </Link>
                        <Typography color="text.primary">Danh sách bác sĩ</Typography>
                    </Breadcrumbs>

                    {/* Search Bar */}
                    <TextField
                        label="Tìm kiếm bác sĩ"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />

                    <Grid container spacing={2}>
                        {paginatedDoctors.map((doctor) => (
                            <Grid item key={doctor.$id} xs={12} sm={6} md={3} lg={3}>
                                <Card sx={{ width: '100%', maxWidth: 300, minWidth: 300, boxShadow: 'none' }}>
                                    <CardMedia
                                        component="img"
                                        height="150"
                                        image={doctor.img || defaultImg}
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
                                            <Link
                                                component={RouterLink}
                                                to={`/viewDoctorDetail/${doctor.docId}`}
                                                sx={{
                                                    textDecoration: 'none',
                                                    color: 'inherit',
                                                    '&:hover': {
                                                        textDecoration: 'underline',
                                                    }
                                                }}
                                            >
                                                Bác sĩ : {doctor.name}
                                            </Link>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Chuyên khoa: {doctor.allDepartmentName}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination Controls */}
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
                    />
                </Container>
            </Box>
            <Footer />
        </Box>
    );
}

export default ListDoctorView;
