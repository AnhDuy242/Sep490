import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, TextField, Button } from '@mui/material';
import axios from 'axios';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../../../layouts/Header';
import Navbar from '../../../../layouts/Navbar';
import Footer from '../../../../layouts/Footer';

const SearchServiceResult = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Parse query parameter from URL
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('search') || '';
    setSearchQuery(query);
    fetchServices(query);
  }, [location.search]);

  const fetchServices = async (query) => {
    try {
      if (query) {
        // Fetch services based on search query
        const response = await axios.get(`https://localhost:7240/api/ServiceDetail/SearchServices?keyword=${encodeURIComponent(query)}`);
        setFilteredServices(response.data.$values);
      } else {
        // Fetch all services if query is empty
        const response = await axios.get('https://localhost:7240/api/Department/GetAllServicesAndDetails');
        setFilteredServices(response.data.$values);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchClick = () => {
    // Trigger the search without navigation
    fetchServices(searchQuery.trim());
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/servicesDetail/${serviceId}`);
  };

  return (
    <>
      <Header />
      <Navbar />
      <Container sx={{ mt: 10, mb: 10 }}>
    
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Tìm kiếm dịch vụ"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Button variant="contained" color="primary" onClick={handleSearchClick} sx={{ mt: 2 }}>
            Tìm kiếm
          </Button>
        </Box>

        {filteredServices.length === 0 ? (
          <Typography variant="h6" color="text.secondary" align="center">
            Không có kết quả nào.
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
                        onClick={() => handleServiceClick(service.serviceId)}
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
      </Container>
      <Footer />
    </>
  );
};

export default SearchServiceResult;
