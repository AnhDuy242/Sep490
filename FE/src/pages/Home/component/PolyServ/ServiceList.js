import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Breadcrumbs, Link, TextField } from '@mui/material';
import { useParams, useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import Navbar from '../../../../layouts/Navbar';
import Footer from '../../../../layouts/Footer';
import Header from '../../../../layouts/Header';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'; // Biểu tượng bệnh viện
import axios from 'axios';

const ServiceListPage = () => {
  const [department, setDepartment] = useState(null);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const { depId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract search query from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';

  useEffect(() => {
    const fetchDepartmentAndServices = async () => {
      try {
        // Fetch department and services based on depId
        const response = await axios.get(`https://localhost:7240/api/Department/GetDepartmentWithServices/Details/${depId}`);
        setDepartment(response.data.department);
        setServices(response.data.services.$values);
        // Initialize filtered services based on search query
        filterServices(response.data.services.$values, searchQuery);
      } catch (error) {
        console.error('Error fetching department and services:', error);
      }
    };

    fetchDepartmentAndServices();
  }, [depId, searchQuery]);

  const filterServices = (services, query) => {
    const filtered = services.filter(service =>
      service.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredServices(filtered);
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/servicesDetail/${serviceId}`);
  };

  const handleSearchChange = (event) => {
    const newSearchQuery = event.target.value;
    // Update the URL with the new search query
    navigate(`/servicesList/${depId}?search=${encodeURIComponent(newSearchQuery)}`);
  };

  return (
    <>
      <Header />
      <Navbar />
      <Container sx={{ minHeight: '80vh', mt: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 3 }}>
            <Link component={RouterLink} to="/" color="inherit">
              Trang chủ
            </Link>
            <Link component={RouterLink} to="/servicesList" color="inherit">
              Danh sách dịch vụ
            </Link>
            <Typography color="text.primary">
              {department ? department.name : 'Khoa'}
            </Typography>
          </Breadcrumbs>

          <Typography variant="h4" component="h1" gutterBottom>
            Các Dịch Vụ tại {department ? department.name : 'Loading...'}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <TextField
              label="Tìm kiếm dịch vụ"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Box>

          {filteredServices.length === 0 ? (
            <Typography variant="h6" color="textSecondary">
              Không có kết quả
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {filteredServices.map((service) => (
                <Grid item xs={12} sm={6} md={4} key={service.serviceId}>
                  <Card
                    sx={{
                      transition: '0.3s',
                      '&:hover': {
                        backgroundColor: '#e0f7fa',
                        boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
                        transform: 'scale(1.02)',
                      },
                      cursor: 'pointer',
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid #ddd',
                    }}
                    onClick={() => handleServiceClick(service.serviceId)}
                  >
                    <CardContent>
                      <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                        <Box
                          sx={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: '#e0f2f1',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                          }}
                        >
                          <LocalHospitalIcon sx={{ fontSize: 40, color: '#00796b' }} />
                        </Box>
                        <Typography variant="h5" component="div" sx={{ color: '#1E93E3', mb: 2 }}>
                          {service.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {service.serviceDetails?.$values?.[0]?.description || 'No description available'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Giá dịch vụ: {service.price}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

        </div>
      </Container>
      <Footer />
    </>
  );
};

export default ServiceListPage;
