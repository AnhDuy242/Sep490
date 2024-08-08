import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box, Breadcrumbs, Link } from '@mui/material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import Navbar from '../../../../layouts/Navbar';
import Footer from '../../../../layouts/Footer';
import Header from '../../../../layouts/Header';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'; // Biểu tượng dịch vụ y tế
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'; // Biểu tượng bệnh viện
import axios from 'axios';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const { depId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('https://localhost:7240/api/Department/GetAllDepartmentWithServices');
        setDepartments(response.data.$values);
        if (depId) {
          const department = response.data.$values.find(dept => dept.department.depId === parseInt(depId));
          setSelectedDepartment(department);
          // Fetch services for the selected department
          const serviceResponse = await axios.get(`https://localhost:7240/api/Department/GetDepartmentWithServices/Details/${depId}`);
          setServices(serviceResponse.data.services.$values);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, [depId]);

  useEffect(() => {
    if (depId && departments.length > 0) {
      const department = departments.find(dept => dept.department.depId === parseInt(depId));
      setSelectedDepartment(department);
      // Fetch services for the selected department
      const fetchServices = async () => {
        try {
          const response = await axios.get(`https://localhost:7240/api/Department/GetDepartmentWithServices/Details/${depId}`);
          setServices(response.data.services.$values);
        } catch (error) {
          console.error('Error fetching services:', error);
        }
      };
      fetchServices();
    }
  }, [departments, depId]);

  const handleDepartmentClick = (departmentId) => {
    navigate(`/servicesList/${departmentId}`);
  };

  const handleServiceClick = (serviceId) => {
    // Navigate to the service detail page, including the depId in the URL
    navigate(`/servicesList/${depId}/servicesDetail/${serviceId}`);
  };

  return (
    <>
      <Header />
      <Navbar />
      <Container sx={{ minHeight: '80vh',mb:20, mt: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 3 }}>
            <Link component={RouterLink} to="/" color="inherit">
              Trang chủ
            </Link>
            <Typography color="text.primary">
              Chuyên khoa
            </Typography>
          </Breadcrumbs>
          
          <Typography variant="h4" component="h1" gutterBottom>
            Các Khoa
          </Typography>

          <Grid container spacing={3}>
            {departments.map((dept) => (
              <Grid item xs={12} sm={6} md={4} key={dept.department.depId}>
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
                  onClick={() => handleDepartmentClick(dept.department.depId)}
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
                        <MedicalServicesIcon sx={{ fontSize: 40, color: '#00796b' }} />
                      </Box>
                      <Typography variant="h5" component="div" sx={{ color: '#1E93E3', mb: 2 }}>
                        {dept.department.name}
                      </Typography>
                   
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {selectedDepartment && (
            <>
              <Typography variant="h5" component="h2" gutterBottom>
                Dịch Vụ tại Khoa: {selectedDepartment.department.name}
              </Typography>
              <Grid container spacing={3}>
                {services.map((service) => (
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
            </>
          )}
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default DepartmentList;
