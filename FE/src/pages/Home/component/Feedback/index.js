// src/components/Feedback.js
import React, { useEffect, useRef } from 'react';
import { Container, Typography, Card, CardContent, Avatar, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, useAnimation } from 'framer-motion';
import avatar from '../../../../assets/images/ava.jpg';

const testimonials = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    feedback: 'Nhân viên nhiệt tình, chuyên nghiệp. Tôi sẽ giới thiệu cho bạn bè và gia đình.',
    avatar: avatar,
  },
  {
    id: 2,
    name: 'Trần Thị B',
    feedback: 'Nhân viên nhiệt tình, chuyên nghiệp. Tôi sẽ giới thiệu cho bạn bè và gia đình.',
    avatar: avatar,
  },
  {
    id: 3,
    name: 'Lê Văn C',
    feedback: 'Nhân viên nhiệt tình, chuyên nghiệp. Tôi sẽ giới thiệu cho bạn bè và gia đình.',
    avatar: avatar,
  },
];

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: theme.shadows[6],
  },
}));

const Feedback = () => {
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
    <Container className="container" >
      <Typography variant="h4" component="h1" gutterBottom className="heading">
        Khách hàng nói gì về chúng tôi
      </Typography>
      <Grid container spacing={4}>
        {testimonials.map((testimonial) => (
          <Grid item key={testimonial.id} xs={12} sm={6} md={4}>
            <motion.div
              initial="hidden"
              animate={controls}
              variants={cardVariants}
              transition={{ duration: 0.5 }}
              style={{ width: '100%' }}
            >
              <StyledCard>
                <Avatar
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  sx={{ width: 100, height: 100, marginBottom: 2 }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div" align="center">
                    {testimonial.name}
                  </Typography>
                  <Typography variant="body1" align="center">
                    {testimonial.feedback}
                  </Typography>
                </CardContent>
              </StyledCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Feedback;
