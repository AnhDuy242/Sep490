import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Breadcrumbs, Link } from '@mui/material';
import axios from 'axios';
import { useParams, Link as RouterLink } from 'react-router-dom';
import Navbar from '../../../../layouts/Navbar';
import Footer from '../../../../layouts/Footer';
import Header from '../../../../layouts/Header';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const { depId } = useParams();

  useEffect(() => {
    if (depId) {
      const fetchServices = async () => {
        try {
          const response = await axios.get(`https://localhost:7240/api/Department/GetServicesAndDetailsByDepartmentId/GetServicesByDepartment/${depId}`);
          setServices(response.data.$values);
        } catch (error) {
          console.error('Error fetching services:', error);
        }
      };

      fetchServices();
    }
  }, [depId]);

  return (
    <>
      <Header />
      <Navbar />
      <Container sx={{ minHeight: '80vh',mt:10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 3 }}>
            <Link component={RouterLink} to="/" color="inherit">
              Trang chủ
            </Link>
            <Typography color="text.primary">
              Dịch vụ
            </Typography>
          </Breadcrumbs>
          
          <Typography variant="h4" component="h1" gutterBottom>
            Các Dịch Vụ 
          </Typography>
          <Grid container spacing={3}>
            {services.map((service) => (
              <Grid item xs={12} sm={6} md={6} key={service.serviceId}>
                <Card
                  sx={{
                    transition: '0.3s',
                    '&:hover': {
                      backgroundColor: '#e0f7fa',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <Typography variant="h5" component="div" sx={{ color: '#1E93E3', textAlign: 'center' }}>
                        {service.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                        {service.serviceDetails?.$values?.[0]?.description || 'No description available'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                      Giá dịch vụ:   {service.price}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </Container>
      <Footer />

    </>
  );
};

export default ServiceList;
