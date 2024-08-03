import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Breadcrumbs, Link, Icon, Divider } from '@mui/material';
import axios from 'axios';
import { useParams, Link as RouterLink } from 'react-router-dom';
import Navbar from '../../../../layouts/Navbar';
import Footer from '../../../../layouts/Footer';
import Header from '../../../../layouts/Header';
import { MedicalServices } from '@mui/icons-material'; // Example icon

const ServiceDetail = () => {
  const [service, setService] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const { serviceId } = useParams();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`https://localhost:7240/api/Department/GetServicesAndDetailsByDepartmentId/GetServicesByDepartment/${serviceId}`);
        setService(response.data.$values.find(s => s.serviceId === Number(serviceId)));
      } catch (error) {
        console.error('Error fetching service details:', error);
      }
    };

    const fetchAllServices = async () => {
      try {
        const response = await axios.get('https://localhost:7240/api/Department/GetAllServicesAndDetails');
        setAllServices(response.data.$values.filter(s => s.serviceId !== Number(serviceId)));
      } catch (error) {
        console.error('Error fetching all services:', error);
      }
    };

    fetchService();
    fetchAllServices();
  }, [serviceId]);

  if (!service) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <Navbar />
      <Container sx={{ minHeight: '80vh', mt: 10 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 4 }}>
          <Link component={RouterLink} to="/" color="inherit" sx={{ fontSize: '1.2rem' }}>
            Trang chủ
          </Link>
        
          <Typography color="text.primary" sx={{ fontSize: '1.2rem' }}>
            Chi Tiết Dịch Vụ
          </Typography>
        </Breadcrumbs>
        
        <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          {service.name}
        </Typography>

        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ backgroundColor: '#f0f4f8', padding: 4, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Icon component={MedicalServices} sx={{ fontSize: 100, color: '#1E93E3' }} />
              <Typography variant="h5" component="div" sx={{ mt: 2, textAlign: 'center' }}>
                {service.name}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Card sx={{ padding: 3 }}>
              <CardContent>
                <Typography variant="h5" component="div" sx={{ mb: 2 }}>
                  Giá dịch vụ: {service.price}
                </Typography>
                <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                  {service.serviceDetails.$values[0]?.description || 'No description available'}
                </Typography>
                <Typography variant="body1" component="div" sx={{ mb: 2 }}>
                  Thời gian: {service.serviceDetails.$values[0]?.duration} phút
                </Typography>
                <Typography variant="body1" component="div">
                  Thông tin thêm: {service.serviceDetails.$values[0]?.additionalInfo || 'No additional info'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ padding: 4, borderRadius: 2, backgroundColor: '#f0f4f8' }}>
              <Typography variant="h5" component="div" sx={{ mb: 4 }}>
                Các dịch vụ khác của chúng tôi
              </Typography>
              <Grid container spacing={3}>
                {allServices.map(otherService => (
                  <Grid item xs={12} sm={4} key={otherService.serviceId}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {otherService.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Giá: {otherService.price}
                        </Typography>
                        <Link component={RouterLink} to={`/servicesDetail/${otherService.serviceId}`} color="primary">
                          Xem chi tiết
                        </Link>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default ServiceDetail;
