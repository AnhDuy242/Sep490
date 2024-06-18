import React, { useEffect, useRef } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, CardActions, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { motion, useAnimation } from 'framer-motion';
import Images1 from '../../../../assets/images/KhoaNhi_1.jpg';
import Images2 from '../../../../assets/images/Da_khoa.jpg';
import Images3 from '../../../../assets/images/dinh_duong.jpg';
import '../../../../assets/new.css';

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
  const controls = useAnimation();
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start('visible');
        } else {
          controls.start('hidden');
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [controls]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom className="heading" >
        Dịch vụ của chúng tôi
      </Typography>
      <Grid container spacing={3} ref={ref}>
        {initialServices.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <motion.div
              initial="hidden"
              animate={controls}
              variants={cardVariants}
              transition={{ duration: 0.5, delay: service.id * 0.2 }}
            >
              <Card className={classes.card}>
                <CardMedia
                  className={classes.media}
                  image={service.imageUrl}
                  alt={service.name}
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    {service.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    {service.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Đặt lịch
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      <div className={classes.loadMore}>
        {/* onClick={handleLoadMore} */}
        <Button variant="contained" color="primary">
          Xem thêm
        </Button>
      </div>
    </Container>
  );
}

export default Services;
