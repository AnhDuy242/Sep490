import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Import useNavigate
import { loadDoctors } from '../../../../services/doctor_service'; // Import loadDoctors
import img from '../../../../assets/images/images (1).jpg'; // Import image

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    loadDoctors(setDoctors, setLoading, setError);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleButtonClick = () => {
    navigate('/listDoctorView'); // Adjust the path as needed
  };

  return (
    <Container className="container">
      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          ĐỘI NGŨ BÁC SĨ TẠI <b style={{ color: '#1d93e3' }}>68A</b>
        </Typography>
        <Button
          onClick={handleButtonClick}
          sx={{
            fontSize: '14px',
            textTransform: 'none',
            color: '#1d93e3',
            textDecoration: 'underline',
            marginLeft: 1, // Space between title and button
            '&:hover': {
              textDecoration: 'underline',
              color: '#1d93e3',
            },
          }}
        >
          Xem thêm &gt;
        </Button>
      </Box>
      <Grid container spacing={4}>
        {doctors.slice(0, 3).map((doctor, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <RouterLink
              to={`/viewDoctorDetail/${doctor.accId}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              <Card className="card">
                <CardMedia
                  component="img"
                  height="300"
                  image={img}
                  alt={doctor.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div" className="cardTitle">
                    Chuyên khoa:  {doctor.departmentName}
                  </Typography>
                  <Typography gutterBottom variant="h5" component="div" className="cardTitle">
                    Bác sĩ : {doctor.name}
                  </Typography>
                </CardContent>
              </Card>
            </RouterLink>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default DoctorList;
