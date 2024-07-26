import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, CardActions, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Images1 from '../../../../assets/images/KhoaNhi_1.jpg'
import Images2 from '../../../../assets/images/Da_khoa.jpg'
import Images3 from '../../../../assets/images/dinh_duong.jpg'
import {fetchServices} from '../../../../services/index';

const initialServices = [
  {
    id: 1,
    name: "Khám sức khỏe tổng quát",
    description: "Dịch vụ khám sức khỏe tổng quát, bao gồm kiểm tra tổng quát, xét nghiệm máu, xét nghiệm nước tiểu.",
    imageUrl: Images1,
    price: "1,000,000 VND",
  },
  {
    id: 2,
    name: "Khám chuyên khoa",
    description: "Dịch vụ khám chuyên khoa bao gồm khám các bệnh lý chuyên sâu bởi các bác sĩ chuyên khoa.",
    imageUrl: Images2,
    price: "800,000 VND",
  },
  {
    id: 3,
    name: "Khám dinh dưỡng",
    description: "Dịch vụ khám dinh dưỡng, tư vấn chế độ ăn uống hợp lý.",
    imageUrl: Images3,
    price: "600,000 VND",
  },
  // Thêm các dịch vụ khác ở đây
];

const moreServices = [
  {
    id: 4,
    name: "Khám nhi khoa",
    description: "Các dịch vụ khám bệnh cho bệnh nhân là trẻ em",
    imageUrl: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fvuanh.tqdesign.vn%2Fdich-vu-y-khoa%2Fkhoa-nhi.html&psig=AOvVaw2h2A69fzjcMv7TFjj-85uP&ust=1718416768322000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNCSt73_2YYDFQAAAAAdAAAAABAE",
    price: "Liên hệ",
  },
  {
    id: 5,
    name: "Khám sức khỏe sinh sản",
    description: "Dịch vụ khám sức khỏe sinh sản cho cả nam và nữ.",
    imageUrl: "https://via.placeholder.com/150",
    price: "1,200,000 VND",
  },
  // Thêm các dịch vụ khác ở đây
];

const useStyles = makeStyles({
  card: {
    transition: 'all 1000ms ease-in-out, box-shadow 0.4s ease',
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
    },
  },
  media: {
    height: 140,
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


  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      const fetchedServices = await fetchServices();
      setServices(fetchedServices);
      setLoading(false);
    };

    loadServices();
  }, []);

  if (loading) {
    return <Typography>Đang tải dịch vụ...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Dịch vụ của chúng tôi
      </Typography>
      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.media}
                image={service.imageUrl || 'https://via.placeholder.com/150'}
                alt={service.name}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  {service.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Đặt lịch
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Services;
