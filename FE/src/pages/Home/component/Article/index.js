// import React from 'react';
// import Grid from '@mui/material/Grid';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
// import Container from '@mui/material/Container';
// import image1 from '../../../../assets/images/bacsi1.png';
// import '../../../../assets/new.css';
// import { Button } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// function Article() {
//   const articles = [
//     {
//       title: 'Bài viết 1',
//       description: 'Một vài thông tin hữu ích về sức khỏe.',
//       image: image1
//     },
//     {
//       title: 'Bài viết 2',
//       description: 'Thông tin về dinh dưỡng cho trẻ em.',
//       image: image1
//     },
//     {
//       title: 'Bài viết 3',
//       description: 'Các mẹo chăm sóc sức khỏe hàng ngày.',
//       image: image1
//     },
//   ];

//   const doctor = [
//     {
//       title: 'Trần Thị Huế',
//       role: "Thạc sĩ, bác sĩ",
//       description: '7 năm lĩnh vực mổ lợn',
//       image: image1
//     },
//     {
//       title: 'Trần Thị Huế',
//       role: "Thạc sĩ, bác sĩ",
//       description: '7 năm lĩnh vực mổ lợn',
//       image: image1
//     },
//     {
//       title: 'Trần Thị Huế',
//       role: "Thạc sĩ, bác sĩ",
//       description: '7 năm lĩnh vực mổ lợn',
//       image: image1
//     },
//   ];

//   const navigate = useNavigate();

//   const handleButtonClick = (path) => {
//     navigate(path);
//   };

//   return (
//     <Container className="container">
//       <Typography variant="h4" component="h1" gutterBottom className="heading">
//         Giới thiệu
//       </Typography>
//       <Grid container spacing={4}>
//         {doctor.map((doctor, index) => (
//           <Grid item key={index} xs={12} sm={6} md={4}>
//             <Card className="card">
//               <CardMedia
//                 component="img" // Sử dụng <img> đúng cách
//                 className="cardMedia"
//                 role={doctor.role}
//                 image={doctor.image}
//                 alt={doctor.title}
//               />
//               <CardContent>
//                 <Typography gutterBottom variant="h6" component="div" className="cardTitle">
//                   {doctor.role}
//                 </Typography>
//                 <Typography gutterBottom variant="h4" component="div" className="cardTitle">
//                   {doctor.title}
//                 </Typography>
//                 <Typography variant="body1" className="cardDescription">
//                   {doctor.description}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//         <Grid item xs={12} className="button-container">
//           <Button className="button" onClick={() => handleButtonClick('/about-clinic')}>Sơ lược về phòng khám</Button>
//           <Button className="button" onClick={() => handleButtonClick('/about-us')}>Về chúng tôi</Button>
//           <Button className="button" onClick={() => handleButtonClick('/vision-mission')}>Tầm nhìn và sứ mệnh</Button>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// }

// export default Article;


import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import image1 from '../../../../assets/images/bacsi1.png';
import anhtien from './../../../Article/layout/image/anhmattien.png'
import anht1 from './../../../Article/layout/image/anh1.png'
import '../../../../assets/new.css';
import { useNavigate } from 'react-router-dom';
import logo from './../../../../pages/Article/layout/image/logo.png';
function Article() {
  const articles = [
    {
      title: 'Chứng chỉ',
      description: 'Các chứng chỉ cấp phép của phòng khám Đa khoa 68A Hà Đông.',
      image: anhtien,
      path: '/about-clinic'
    },
    {
      title: 'Về chúng tôi',
      description: 'Sơ lược quá trình hình thành và phát triển của phòng khám Đa khoa 68A Hà Đông',
      image: anht1,
      path: '/about'
    },
    {
      title: 'Trang thiết bị',
      description: 'Trang thiết bị hiện đại, tân tiến với công nghệ cao được trang bị tại phòng khám Đa khoa 68A Hà Đông.',
      image: logo,
      path: '/trang-thiet-bi-tai-phong-kham'
    },
  ];

  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <Container className="container">
      <Typography variant="h4" component="h1" gutterBottom>
        Giới thiệu chung về phòng khám Đa khoa <b style={{ color: '#1d93e3' }}>68A</b>
      </Typography>
      <Grid container spacing={4}>
        {articles.map((article, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card className="card" onClick={() => handleCardClick(article.path)}>
              <CardMedia
                component="img"
                className="cardMedia"
                image={article.image}
                alt={article.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div" className="cardTitle">
                  {article.title}
                </Typography>
                <Typography variant="body1" className="cardDescription">
                  {article.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Article;
