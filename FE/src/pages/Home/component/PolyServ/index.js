import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ImagePhoi from '../../../../assets/images/service/phoi.png';
import ImageBrainMRI from '../../../../assets/images/service/phoi.png'; // Giả sử bạn đã có ảnh cho Brain MRI
import { fetchServices } from '../../../../services/index';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  card: {
    transition: 'all 0.3s ease-in-out, box-shadow 0.4s ease',
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
      backgroundColor: '#6495ED', // Màu nền khi hover
      color: '#fff', // Màu chữ khi hover
    },
  },
  loadMore: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
});

const Services = () => {
  const classes = useStyles();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/CreateAppointment');
  };
  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      const fetchedServices = await fetchServices();
      setServices(fetchedServices);
      setLoading(false);
    };

    loadServices();
  }, []);

  const getServiceImage = (serviceName) => {
    switch (serviceName) {
      case 'Heart Checkup':
        return ImagePhoi;
      case 'Brain MRI':
        return ImageBrainMRI;
      case 'Tai mũi họng':
        return ImageBrainMRI;
      case 'Đường ruột':
        return ImageBrainMRI;
      case 'Cận khúc xạ':
        return ImageBrainMRI;
      case 'Điện tim đồ':
        return ImageBrainMRI;
      default:
        return '';
    }
  }

  if (loading) {
    return <Typography>Đang tải dịch vụ...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        CÁC CHUYÊN KHOA Y TẾ TẠI <b style={{ color: '#1d93e3' }}>68A</b>
      </Typography>
      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Card className={classes.card} onClick={handleClick}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <img src={getServiceImage(service.name)} alt="" style={{ width: 30, height: 30, marginRight: 8 }} />
                  <Typography variant="h5" component="div">
                    {service.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {service.description}
                </Typography>
              </CardContent>
              {/* <CardActions>
                <Button size="small" color="primary" onClick={handleClick}>
                  Đặt lịch
                </Button>
              </CardActions> */}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Services;
