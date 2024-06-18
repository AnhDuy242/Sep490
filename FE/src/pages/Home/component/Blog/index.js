import React, { useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import image1 from '../../../../assets/images/bacsi1.png';
import '../../../../assets/new.css';
import { Button } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';

function Blog() {
  const articles = [
    {
      title: 'Bài viết 1',
      description: 'Một vài thông tin hữu ích về sức khỏe.',
      image: image1,
    },
    {
      title: 'Bài viết 2',
      description: 'Thông tin về dinh dưỡng cho trẻ em.',
      image: image1,
    },
    {
      title: 'Bài viết 3',
      description: 'Các mẹo chăm sóc sức khỏe hàng ngày.',
      image: image1,
    },
  ];

  const doctor = [
    {
      title: 'Trần Thị Huế',
      role: 'Thạc sĩ, bác sĩ',
      description: '7 năm lĩnh vực mổ lợn',
      image: image1,
    },
    {
      title: 'Trần Thị Huế',
      role: 'Thạc sĩ, bác sĩ',
      description: '7 năm lĩnh vực mổ lợn',
      image: image1,
    },
    {
      title: 'Trần Thị Huế',
      role: 'Thạc sĩ, bác sĩ',
      description: '7 năm lĩnh vực mổ lợn',
      image: image1,
    },
  ];

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
    <Container className="container">
      <Typography variant="h4" component="h1" gutterBottom className="heading">
        Tin tức
      </Typography>
      <Grid container spacing={4} className="gridContainer" ref={ref}>
        {doctor.map((doctor, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <motion.div
              initial="hidden"
              animate={controls}
              variants={cardVariants}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="card">
                <CardMedia
                  component="img"
                  className="cardMedia"
                  role={doctor.role}
                  image={doctor.image}
                  alt={doctor.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div" className="cardTitle">
                    {doctor.role}
                  </Typography>
                  <Typography gutterBottom variant="h4" component="div" className="cardTitle">
                    {doctor.title}
                  </Typography>
                  <Typography variant="body1" className="cardDescription">
                    {doctor.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
        <Grid item xs={12} className="button-container">
          <Button className="button">Xem thêm</Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Blog;
