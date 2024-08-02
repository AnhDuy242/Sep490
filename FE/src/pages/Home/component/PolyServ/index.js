import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, IconButton, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const getRandomIcon = () => {
  const icons = [<LocalHospitalIcon />, <HealthAndSafetyIcon />, <MedicalServicesIcon />];
  return icons[Math.floor(Math.random() * icons.length)];
};

const DepartmentSlider = () => {
  const [departments, setDepartments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3; // Number of items per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('https://localhost:7240/api/Department/GetDepartments');
        setDepartments(response.data.$values);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerPage >= departments.length ? 0 : prevIndex + itemsPerPage
    );
  };

  const handleBack = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - itemsPerPage < 0
        ? Math.max(0, departments.length - itemsPerPage)
        : prevIndex - itemsPerPage
    );
  };

  const handleDepartmentClick = (depId) => {
    navigate(`/servicesByDepartment/${depId}`);
  };

  const currentDepartments = departments.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{textAlign:'center'}}>
        Các Khoa Y Tế
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconButton
          color="primary"
          onClick={handleBack}
          sx={{
            borderRadius: '50%',
            backgroundColor: '#f5f5f5',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
            marginRight: 2,
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Grid container spacing={3} sx={{ flexGrow: 1 }}>
          {currentDepartments.map((department) => (
            <Grid item xs={12} sm={6} md={4} key={department.depId}>
              <Card>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <Box display="flex" alignItems="center" justifyContent="center" sx={{ marginBottom: 2 }}>
                    {getRandomIcon()}
                  </Box>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ color: '#1E93E3', cursor: 'pointer' }}
                    onClick={() => handleDepartmentClick(department.depId)}
                  >    
                    {department.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <IconButton
          color="primary"
          onClick={handleNext}
          sx={{
            borderRadius: '50%',
            backgroundColor: '#f5f5f5',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
            marginLeft: 2,
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>
    </Container>
  );
};

export default DepartmentSlider;
