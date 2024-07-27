// // src/pages/DoctorList/index.js
// import React, { useEffect, useState } from 'react';
// import Grid from '@mui/material/Grid';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia'; // Import CardMedia
// import Typography from '@mui/material/Typography';
// import Container from '@mui/material/Container';
// import { Button } from '@mui/material';
// import { loadDoctors } from '../../../../services/doctor_service';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import img from '../../../../assets/images/images (1).jpg'; // Import image

// function DoctorList() {
//   const [doctors, setDoctors] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate(); // Initialize useNavigate

//   useEffect(() => {
//     loadDoctors(setDoctors, setLoading, setError);
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   const handleButtonClick = () => {
//     navigate('/listDoctorView'); // Redirect to /listDoctorView
//   };

//   return (
//     <Container className="container">
//       <Typography variant="h4" component="h1" gutterBottom>
//         ĐỘI NGŨ BÁC SĨ TẠI <b style={{ color: '#1d93e3' }}>68A</b>
//       </Typography>
//       <Grid container spacing={4}>
//         {doctors.slice(0, 3).map((doctor, index) => ( // Display only the first 3 doctors
//           <Grid item key={index} xs={12} sm={6} md={4}>
//             <Card className="card">
//               <CardMedia
//                 component="img"
//                 height="300"
//                 image={img} // Use imported image
//                 alt={doctor.name} // Alt text for accessibility
//               />
//               <CardContent>
//                 <Typography gutterBottom variant="h6" component="div" className="cardTitle">
//                   Chuyên khoa:  {doctor.departmentName}
//                 </Typography>
//                 <Typography gutterBottom variant="h5" component="div" className="cardTitle">
//                   Bác sĩ : {doctor.name}
//                 </Typography>

//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//         <Grid item xs={12} className="button-container">
//           <Button className="button" onClick={handleButtonClick}>Xem thêm</Button> {/* Add click handler */}
//         </Grid>
//       </Grid>
//     </Container>
//   );
// }

// export default DoctorList;
import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia'; // Import CardMedia
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Button, Box } from '@mui/material'; // Import Box for layout
import { loadDoctors } from '../../../../services/doctor_service';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
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
    navigate('/listDoctorView'); // Redirect to /listDoctorView
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
        {doctors.slice(0, 3).map((doctor, index) => ( // Display only the first 3 doctors
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card className="card">
              <CardMedia
                component="img"
                height="300"
                image={img} // Use imported image
                alt={doctor.name} // Alt text for accessibility
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
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default DoctorList;
