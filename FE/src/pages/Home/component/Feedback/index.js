// // src/CustomerFeedback.js
// import React from 'react';
// import { Container, Typography, Card, CardContent, Avatar, Grid } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { motion } from 'framer-motion';
// import avatar from '../../../../assets/images/ava.jpg'
// import {fetchFeedbacks} from './../../../../services/index'
// const testimonials = [
//   {
//     name: 'Nguyễn Văn A',
//     feedback: 'Nhân viên nhiệt tình, chuyên nghiệp. Tôi sẽ giới thiệu cho bạn bè và gia đình.',
//     avatar: avatar, // Đường dẫn tới ảnh đại diện của khách hàng
//   },
//   {
//     name: 'Trần Thị B',
//     feedback: 'Nhân viên nhiệt tình, chuyên nghiệp. Tôi sẽ giới thiệu cho bạn bè và gia đình.',
//     avatar: avatar,
//   },
//   {
//     name: 'Lê Văn C',
//     feedback: 'Nhân viên nhiệt tình, chuyên nghiệp. Tôi sẽ giới thiệu cho bạn bè và gia đình.',
//     avatar: avatar,
//   },
// ];

// const StyledCard = styled(Card)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   marginBottom: theme.spacing(2),
//   transition: 'transform 0.3s, box-shadow 0.3s',
//   '&:hover': {
//     transform: 'scale(1.05)',
//     boxShadow: theme.shadows[6],
//   },
// }));

// const CustomerFeedback = () => {
//   return (
//     <Container maxWidth="md" sx={{ mt: 5 }}>
//       <Typography variant="h4" gutterBottom align="center">
//         Khách hàng nói gì về 68A
//       </Typography>
//       <Grid container spacing={4}>
//         {testimonials.map((testimonial, index) => (
//           <Grid item xs={12} md={4} key={index}>
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.2 }}
//             >
//               <StyledCard>
//                 <Avatar
//                   src={testimonial.avatar}
//                   alt={testimonial.name}
//                   sx={{ width: 56, height: 56, marginRight: 2 }}
//                 />
//                 <CardContent>
//                   <Typography variant="h6">{testimonial.name}</Typography>
//                   <Typography variant="body1">{testimonial.feedback}</Typography>
//                 </CardContent>
//               </StyledCard>
//             </motion.div>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// };

// export default CustomerFeedback;

import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Avatar, Grid, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import avatar from '../../../../assets/images/ava.jpg';
import { fetchFeedbacks } from './../../../../services/index';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[6],
  },
}));

const DateBox = styled(Box)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(1),
  alignSelf: 'flex-end',
}));

const CustomerFeedback = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const data = await fetchFeedbacks();
        setTestimonials(data.$values.slice(0, 3)); // Lấy 3 phản hồi đầu tiên
      } catch (error) {
        setError(error.message);
      }
    };

    loadFeedbacks();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        KHÁCH HÀNG NÓI GÌ VỀ <b style={{ color: '#1d93e3' }}>68A</b>
      </Typography>
      <Grid container spacing={4}>
        {testimonials.map((testimonial, index) => (
          <Grid item xs={12} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <StyledCard>
                <Avatar
                  src={avatar} // Ảnh mặc định
                  alt={testimonial.patientName}
                  sx={{ width: 56, height: 56 }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{testimonial.patientName}</Typography>
                  <Typography variant="body1">{testimonial.content}</Typography>
                  <DateBox>{new Date(testimonial.date).toLocaleDateString('vi-VN')}</DateBox>
                </CardContent>
              </StyledCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CustomerFeedback;
