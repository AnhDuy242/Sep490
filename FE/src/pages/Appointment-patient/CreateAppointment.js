// import React, { useState, useEffect, useRef } from 'react';
// import { Container, Typography, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box, Snackbar } from '@mui/material';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import { format } from 'date-fns';
// import { bookAppointment, getListDepartment, fetchDoctors, fetchSlots, fetchServices, fetchDoctorByService, fetchDateByDoctor } from '../../services/AppointmentPatient';
// import Header from '../../layouts/Header';
// import Navbar from '../../layouts/Navbar';
// import Footer from '../../layouts/Footer';
// import MuiAlert from '@mui/material/Alert';

// const AppointmentScreen = () => {
//   const [departmentOptions, setDepartmentOptions] = useState([]);
//   const [doctorOptions, setDoctorOptions] = useState([]);
//   const [serviceOptions, setServiceOptions] = useState([]);
//   const [doctor, setDoctor] = useState('');
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');
//   const [slot, setSlot] = useState([]);
//   const [doctorId, setDoctorId] = useState('');
//   const [patientId, setPatientId] = useState('');
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [serviceId, setServId] = useState('');
//   const [depId, setDepId] = useState('');
//   const [service, setService] = useState('');

//   const formRef = useRef(null);

//   useEffect(() => {
//     // Fetch departments on component mount
//     getListDepartment()
//       .then(data => {
//         console.log('Fetched departments:', data);
//         setDepartmentOptions(data.$values || []);
//       })
//       .catch(error => {
//         console.error('Error fetching departments:', error);
//       });
//     fetchSlots()
//       .then(data => {
//         console.log('Fetched slots:', data);
//         setSlot(data.$values || []);
//       })
//       .catch(error => {
//         console.error('Failed to fetch slots:', error);
//       });
//   }, []);

//   useEffect(() => {
//     // Fetch services when department changes
//     if (depId) {
//       fetchServices(depId)
//         .then(data => {
//           console.log('Fetched services:', data);
//           setServiceOptions(data || []);
//           console.log('After setServiceOptions:', data || []);
//         })
//         .catch(error => {
//           console.error('Failed to fetch services:', error);
//         });
//     }
//   }, [depId]);

//   useEffect(() => {
//     // Fetch services when department changes
//     if (serviceId) {
//       fetchDoctorByService(serviceId)
//         .then(data => {
//           console.log('Fetched services:', data);
//           setDoctorOptions(data || []);
//           console.log('After set doc:', data || []);
//         })
//         .catch(error => {
//           console.error('Failed to fetch services:', error);
//         });
//     }
//   }, [serviceId]);
//   useEffect(() => {
//     // Fetch date by doctor
//     if (doctorId) {
//       fetchDateByDoctor(doctorId)
//         .then(data => {
//           console.log('Fetched date:', data);
//           setDate(data.$values || []);
//           console.log('After set date:', data || []);
//         })
//         .catch(error => {
//           console.error('Failed to fetch date:', error);
//         });
//     }
//   }, [doctorId]);



//   const handleDepartmentChange = (event) => {
//     const depId = event.target.value;
//     setDepId(depId);
//     setDoctor(''); // Reset doctor selection when department changes
//     setServId(''); // Reset service selection when department changes
//     console.log('Selected department:', depId); // Log selected department ID
//   };

//   const handleDoctorChange = (event) => {
//     const doctorId = event.target.value;
//     setDoctorId(doctorId);
//     setDoctor(doctorId); // Assuming doctor name is also needed somewhere
//   };

//   const handleDateChange = (event) => {
//     const selectedDate = event.target.value;
//     setDate(selectedDate);
//   };

//   const handleTimeChange = (event) => {
//     const time = event.target.value;
//     setTime(time);
//   };

//   const handleServiceChange = (event) => {
//     const serviceId = event.target.value;
//     setServId(serviceId);
//     setService(serviceId);
//     console.log('id của cái này là:', serviceId)
//   };

//   const accountId = localStorage.getItem('accountId');
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const formattedDate = date ? format(new Date(date), 'dd-MM-yyyy') : '';
//     const appointmentDto = {
//       patientId: accountId,
//       doctorId: doctorId,
//       date: formattedDate,
//       slotId: time,
//       depId: depId,
//       serviceId: serviceId
//     };

//     console.log('Submitting appointment data:', appointmentDto);

//     bookAppointment(appointmentDto)
//       .then(responseData => {
//         console.log('Appointment booked successfully:', responseData);
//         setOpenSnackbar(true);
//         setSnackbarMessage('Đặt lịch thành công!');
//         setPatientId('');
//         setDoctor('');
//         setDoctorId('');
//         setDate('');
//         setTime('');
//         setDepId('');
//         setServId('');

//         // Scroll to top of the form if formRef exists
//         if (formRef.current) {
//           formRef.current.scrollTop = 0;
//         }
//       })
//       .catch(error => {
//         console.error('Error booking appointment:', error);
//         setOpenSnackbar(true);
//         setSnackbarMessage('Đặt lịch thất bại. Vui lòng thử lại!');
//       });
//   };

//   const handleCloseSnackbar = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setOpenSnackbar(false);
//   };

//   const SnackbarMessage = (props) => (
//     <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} {...props} sx={{ backgroundColor: '#4caf50', color: '#fff' }} />
//   );

//   return (
//     <>
//       <Header />
//       <Navbar />
//       <Container ref={formRef} sx={{ marginTop: 20 }}>
//         <Typography
//           variant="h4"
//           gutterBottom
//           sx={{
//             color: 'primary.main',
//             fontWeight: 'bold',
//             textAlign: 'center',
//             marginTop: 2,
//           }}
//         >
//           Đặt lịch khám
//         </Typography>
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={6}>
//             <form onSubmit={handleSubmit}>
//               <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                   <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
//                     <InputLabel id="department-label">Chuyên khoa</InputLabel>
//                     <Select
//                       labelId="department-label"
//                       id="department"
//                       value={depId || ''}
//                       onChange={handleDepartmentChange}
//                       label="Chuyên khoa"
//                     >
//                       {departmentOptions.map(depart => (
//                         <MenuItem key={depart.depId} value={depart.depId}>
//                           {depart.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
//                     <InputLabel id="service-label">Dịch vụ</InputLabel>
//                     <Select
//                       labelId="service-label"
//                       id="service"
//                       value={serviceId || ''}
//                       onChange={handleServiceChange}
//                       label="Dịch vụ"
//                       disabled={!depId}
//                     >
//                       {serviceOptions.length > 0 ? (
//                         serviceOptions.map(service => (
//                           <MenuItem key={service.serviceId} value={service.serviceId}>
//                             {service.name}
//                           </MenuItem>
//                         ))
//                       ) : (
//                         <MenuItem disabled>No services available</MenuItem>
//                       )}
//                     </Select>


//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
//                     <InputLabel id="doctor-label">Bác sĩ</InputLabel>
//                     <Select
//                       labelId="doctor-label"
//                       id="doctor"
//                       value={doctor || ''}
//                       onChange={handleDoctorChange}
//                       label="Bác sĩ"
//                       disabled={!serviceId}
//                     >
//                       {doctorOptions.length > 0 ? (
//                         doctorOptions.map(doc => (
//                           <MenuItem key={doc.docId} value={doc.docId}>
//                             {doc.name}
//                           </MenuItem>
//                         ))
//                       ) : (
//                         <MenuItem disabled>Không có bác sĩ</MenuItem>
//                       )}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
//                     <InputLabel id="date-label">Chọn ngày</InputLabel>
//                     <Select
//                       labelId="date-label"
//                       id="date"
//                       value={date || ''}
//                       onChange={handleDateChange}
//                       label="Chọn ngày"
//                     >
//                       {date.length > 0 ? (
//                         date.map(slotItem => (
//                           <MenuItem key={slotItem.$id} value={slotItem.date}>
//                             {slotItem.date}
//                           </MenuItem>
//                         ))
//                       ) : (
//                         <MenuItem disabled>Không có ngày</MenuItem>
//                       )}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
//                     <InputLabel id="time-label">Thời gian</InputLabel>
//                     <Select
//                       labelId="time-label"
//                       id="time"
//                       value={time || ''}
//                       onChange={handleTimeChange}
//                       label="Thời gian"
//                       startAdornment={<AccessTimeIcon sx={{ marginRight: 1 }} />}
//                     >
//                       {slot.map(slotItem => (
//                         <MenuItem key={slotItem.slotId} value={slotItem.slotId}>
//                           {slotItem.time}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Button type="submit" variant="contained" color="primary" fullWidth>
//                     Đặt lịch
//                   </Button>
//                 </Grid>
//               </Grid>
//             </form>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Box
//               component="img"
//               sx={{
//                 width: '100%',
//                 height: '80%',
//                 objectFit: 'fill',
//               }}
//               alt="Appointment illustration"
//               src="https://medlatec.vn/med/images/bookings3.png"
//             />
//           </Grid>
//         </Grid>
//       </Container>
//       <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
//         <div>
//           <SnackbarMessage severity="success">
//             {snackbarMessage}
//           </SnackbarMessage>
//         </div>
//       </Snackbar>
//       <Footer />
//     </>
//   );
// };

// export default AppointmentScreen;

// import React, { useState, useEffect, useRef } from 'react';
// import { Container, Typography, Grid, FormControl, InputLabel, Select, MenuItem, Box, Snackbar, Button } from '@mui/material';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import { format } from 'date-fns';
// import { bookAppointment, getListDepartment, fetchServices, fetchDoctorByService, fetchDateByDoctor, fetchSlotsByDoctorAndDate } from '../../services/AppointmentPatient';
// import Header from '../../layouts/Header';
// import Navbar from '../../layouts/Navbar';
// import Footer from '../../layouts/Footer';
// import MuiAlert from '@mui/material/Alert';

// const AppointmentScreen = () => {
//   const [departmentOptions, setDepartmentOptions] = useState([]);
//   const [doctorOptions, setDoctorOptions] = useState([]);
//   const [serviceOptions, setServiceOptions] = useState([]);
//   const [dateOptions, setDateOptions] = useState([]);
//   const [slotOptions, setSlotOptions] = useState([]);
//   const [doctorId, setDoctorId] = useState('');
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');
//   const [depId, setDepId] = useState('');
//   const [serviceId, setServId] = useState('');
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [doctor, setDoctor] = useState('');
//   const formRef = useRef(null);

//   useEffect(() => {
//     // Fetch departments on component mount
//     getListDepartment()
//       .then(data => setDepartmentOptions(data.$values || []))
//       .catch(error => console.error('Error fetching departments:', error));
//   }, []);

//   useEffect(() => {
//     // Fetch services when department changes
//     if (depId) {
//       fetchServices(depId)
//         .then(data => setServiceOptions(data || []))
//         .catch(error => console.error('Failed to fetch services:', error));
//     }
//   }, [depId]);

//   useEffect(() => {
//     // Fetch doctors when service changes
//     if (serviceId) {
//       fetchDoctorByService(serviceId)
//         .then(data => setDoctorOptions(data || []))
//         .catch(error => console.error('Failed to fetch doctors:', error));
//     }
//   }, [serviceId]);

//   useEffect(() => {
//     // Fetch dates by doctor
//     if (doctorId) {
//       fetchDateByDoctor(doctorId)
//         .then(data => setDateOptions(data || []))
//         .catch(error => console.error('Failed to fetch dates:', error));
//     }
//   }, [doctorId]);

//   useEffect(() => {
//     // Fetch slots when date or doctor changes
//     if (doctorId && date) {
//       fetchSlotsByDoctorAndDate(doctorId, date)
//         .then(data => setSlotOptions(data || []))
//         .catch(error => console.error('Failed to fetch slots:', error));
//     }
//   }, [doctorId, date]);

//   const handleDepartmentChange = (event) => {
//     const depId = event.target.value;
//     setDepId(depId);
//     setServId('');
//     setDoctor('');
//     setDoctorId('');
//     setDate('');
//     setSlotOptions([]);
//   };

//   const handleServiceChange = (event) => {
//     const serviceId = event.target.value;
//     setServId(serviceId);
//     setDoctor('');
//     setDoctorId('');
//     setDate('');
//     setSlotOptions([]);
//   };

//   const handleDoctorChange = (event) => {
//     const doctorId = event.target.value;
//     setDoctorId(doctorId);
//     setDate('');
//     setSlotOptions([]);
//   };

//   const handleDateChange = (event) => {
//     const selectedDate = event.target.value;
//     console.log('Selected Date:', selectedDate);
//     setDate(selectedDate);
//   };


//   // const handleTimeChange = (event) => {
//   //   const time = event.target.value;
//   //   setTime(time);
//   // };
//   const handleTimeChange = (event) => {
//     const slotId = event.target.value;
//     console.log('Selected slot:', slotId);
//     setTime(slotId); // Lưu giá trị slotId thay vì time
//   };


//   const accountId = localStorage.getItem('accountId');
//   const convertToDate = (dateStr) => {
//     const [day, month, year] = dateStr.split('-');
//     return new Date(`${year}-${month}-${day}`);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     const testDate = convertToDate(date);
//     console.log('Test Date:', testDate);

//     if (isNaN(testDate.getTime())) {
//       console.error('Invalid date:', date);
//       setOpenSnackbar(true);
//       setSnackbarMessage('Ngày không hợp lệ. Vui lòng kiểm tra lại!');
//       return;
//     }

//     const formattedDate = format(testDate, 'dd-MM-yyyy');

//     console.log('Formatted Date:', formattedDate);

//     const appointmentDto = {
//       patientId: accountId,
//       doctorId: doctorId,
//       date: formattedDate,
//       slotId: time,
//       depId: depId,
//       serviceId: serviceId
//     };

//     bookAppointment(appointmentDto)
//       .then(responseData => {
//         setOpenSnackbar(true);
//         setSnackbarMessage('Đặt lịch thành công!');
//         setDepId('');
//         setServId('');
//         setDoctor('');
//         setDoctorId('');
//         setDate('');
//         setTime('');
//         setSlotOptions([]);
//       })
//       .catch(error => {
//         setOpenSnackbar(true);
//         setSnackbarMessage('Đặt lịch thất bại. Vui lòng thử lại!');
//         console.error('Error booking appointment:', error);
//       });
//   };





//   const handleCloseSnackbar = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setOpenSnackbar(false);
//   };

//   const SnackbarMessage = (props) => (
//     <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} {...props} sx={{ backgroundColor: '#4caf50', color: '#fff' }} />
//   );

//   return (
//     <>
//       <Header />
//       <Navbar />
//       <Container ref={formRef} sx={{ marginTop: 20 }}>
//         <Typography
//           variant="h4"
//           gutterBottom
//           sx={{
//             color: 'primary.main',
//             fontWeight: 'bold',
//             textAlign: 'center',
//             marginTop: 2,
//           }}
//         >
//           Đặt lịch khám
//         </Typography>
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={6}>
//             <form onSubmit={handleSubmit}>
//               <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                   <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
//                     <InputLabel id="department-label">Chuyên khoa</InputLabel>
//                     <Select
//                       labelId="department-label"
//                       id="department"
//                       value={depId || ''}
//                       onChange={handleDepartmentChange}
//                       label="Chuyên khoa"
//                     >
//                       {departmentOptions.map(depart => (
//                         <MenuItem key={depart.depId} value={depart.depId}>
//                           {depart.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
//                     <InputLabel id="service-label">Dịch vụ</InputLabel>
//                     <Select
//                       labelId="service-label"
//                       id="service"
//                       value={serviceId || ''}
//                       onChange={handleServiceChange}
//                       label="Dịch vụ"
//                       disabled={!depId}
//                     >
//                       {serviceOptions.length > 0 ? (
//                         serviceOptions.map(service => (
//                           <MenuItem key={service.serviceId} value={service.serviceId}>
//                             {service.name}
//                           </MenuItem>
//                         ))
//                       ) : (
//                         <MenuItem disabled>No services available</MenuItem>
//                       )}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
//                     <InputLabel id="doctor-label">Bác sĩ</InputLabel>
//                     <Select
//                       labelId="doctor-label"
//                       id="doctor"
//                       value={doctorId || ''}
//                       onChange={handleDoctorChange}
//                       label="Bác sĩ"
//                       disabled={!serviceId}
//                     >
//                       {doctorOptions.length > 0 ? (
//                         doctorOptions.map(doc => (
//                           <MenuItem key={doc.docId} value={doc.docId}>
//                             {doc.name}
//                           </MenuItem>
//                         ))
//                       ) : (
//                         <MenuItem disabled>Không có bác sĩ</MenuItem>
//                       )}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
//                     <InputLabel id="date-label">Chọn ngày</InputLabel>
//                     <Select
//                       labelId="date-label"
//                       id="date"
//                       value={date || ''}
//                       onChange={handleDateChange}
//                       label="Chọn ngày"
//                       disabled={!doctorId}
//                     >
//                       {dateOptions.length > 0 ? (
//                         dateOptions.map(slotItem => (
//                           <MenuItem key={slotItem.$id} value={slotItem.date}>
//                             {slotItem.date}
//                           </MenuItem>
//                         ))
//                       ) : (
//                         <MenuItem disabled>Không có ngày</MenuItem>
//                       )}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
//                     <InputLabel id="time-label">Thời gian</InputLabel>
//                     <Select
//                       labelId="time-label"
//                       id="time"
//                       value={time || ''}
//                       onChange={handleTimeChange}
//                       label="Thời gian"
//                       startAdornment={<AccessTimeIcon sx={{ marginRight: 1 }} />}
//                       disabled={!date}
//                     >
//                       {slotOptions.length > 0 ? (
//                         slotOptions.map(slotItem => (
//                           <MenuItem key={slotItem.slotId} value={slotItem.slotId}>
//                             {slotItem.time}
//                           </MenuItem>
//                         ))
//                       ) : (
//                         <MenuItem disabled>Không có thời gian</MenuItem>
//                       )}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Button type="submit" variant="contained" color="primary" fullWidth>
//                     Đặt lịch
//                   </Button>
//                 </Grid>
//               </Grid>
//             </form>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Box
//               component="img"
//               sx={{
//                 width: '100%',
//                 height: '80%',
//                 objectFit: 'fill',
//               }}
//               alt="Appointment illustration"
//               src="https://medlatec.vn/med/images/bookings3.png"
//             />
//           </Grid>
//         </Grid>
//       </Container>
//       <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
//         <SnackbarMessage severity="success">
//           {snackbarMessage}
//         </SnackbarMessage>
//       </Snackbar>
//       <Footer />
//     </>
//   );
// };

// export default AppointmentScreen;




import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, FormControl, InputLabel, Select, MenuItem, Box, Snackbar, Button } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format } from 'date-fns';
import { bookAppointment, getListDepartment, fetchServices, fetchDoctorByService, fetchDateByDoctor, fetchSlotsByDoctorAndDate } from '../../services/AppointmentPatient';
import Header from '../../layouts/Header';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import MuiAlert from '@mui/material/Alert';
import { Helmet } from 'react-helmet';

const AppointmentScreen = () => {
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [dateOptions, setDateOptions] = useState([]);
  const [slotOptions, setSlotOptions] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [depId, setDepId] = useState('');
  const [serviceId, setServId] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [doctor, setDoctor] = useState('');

  useEffect(() => {
    // Fetch departments on component mount
    getListDepartment()
      .then(data => setDepartmentOptions(data.$values || []))
      .catch(error => console.error('Error fetching departments:', error));
  }, []);

  useEffect(() => {
    // Fetch services when department changes
    if (depId) {
      fetchServices(depId)
        .then(data => setServiceOptions(data || []))
        .catch(error => console.error('Failed to fetch services:', error));
    }
  }, [depId]);

  useEffect(() => {
    // Fetch doctors when service changes
    if (serviceId) {
      fetchDoctorByService(serviceId)
        .then(data => setDoctorOptions(data || []))
        .catch(error => console.error('Failed to fetch doctors:', error));
    }
  }, [serviceId]);

  useEffect(() => {
    // Fetch dates by doctor
    if (doctorId) {
      fetchDateByDoctor(doctorId)
        .then(data => setDateOptions(data || []))
        .catch(error => console.error('Failed to fetch dates:', error));
    }
  }, [doctorId]);

  useEffect(() => {
    // Fetch slots when date or doctor changes
    if (doctorId && date) {
      fetchSlotsByDoctorAndDate(doctorId, date)
        .then(data => setSlotOptions(data || []))
        .catch(error => console.error('Failed to fetch slots:', error));
    }
  }, [doctorId, date]);

  const handleDepartmentChange = (event) => {
    const depId = event.target.value;
    setDepId(depId);
    setServId('');
    setDoctor('');
    setDoctorId('');
    setDate('');
    setSlotOptions([]);
  };

  const handleServiceChange = (event) => {
    const serviceId = event.target.value;
    setServId(serviceId);
    setDoctor('');
    setDoctorId('');
    setDate('');
    setSlotOptions([]);
  };

  const handleDoctorChange = (event) => {
    const doctorId = event.target.value;
    setDoctorId(doctorId);
    setDate('');
    setSlotOptions([]);
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    console.log('Selected Date:', selectedDate);
    setDate(selectedDate);
  };

  const handleTimeChange = (event) => {
    const slotId = event.target.value;
    console.log('Selected slot:', slotId);
    setTime(slotId); // Lưu giá trị slotId thay vì time
  };

  const accountId = localStorage.getItem('accountId');
  const convertToDate = (dateStr) => {
    const [day, month, year] = dateStr.split('-');
    return new Date(`${year}-${month}-${day}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const testDate = convertToDate(date);
    console.log('Test Date:', testDate);

    if (isNaN(testDate.getTime())) {
      console.error('Invalid date:', date);
      setOpenSnackbar(true);
      setSnackbarMessage('Ngày không hợp lệ. Vui lòng kiểm tra lại!');
      return;
    }

    const formattedDate = format(testDate, 'dd-MM-yyyy');

    console.log('Formatted Date:', formattedDate);

    const appointmentDto = {
      patientId: accountId,
      doctorId: doctorId,
      date: formattedDate,
      slotId: time,
      depId: depId,
      serviceId: serviceId
    };

    bookAppointment(appointmentDto)
      .then(responseData => {
        setOpenSnackbar(true);
        setSnackbarMessage('Đặt lịch thành công!');
        setDepId('');
        setServId('');
        setDoctor('');
        setDoctorId('');
        setDate('');
        setTime('');
        setSlotOptions([]);
      })
      .catch(error => {
        setOpenSnackbar(true);
        setSnackbarMessage('Đặt lịch thất bại. Vui lòng thử lại!');
        console.error('Error booking appointment:', error);
      });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const SnackbarMessage = (props) => (
    <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} {...props} sx={{ backgroundColor: '#4caf50', color: '#fff' }} />
  );

  return (
    <>
     <Helmet>
            <title>
                Đặt lịch khám
            </title>
        </Helmet>
      <Header />
      <Navbar />
      <Container sx={{ marginTop: 20 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: 'primary.main',
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 2,
          }}
        >
          Đặt lịch khám
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
                    <InputLabel id="department-label">Chuyên khoa</InputLabel>
                    <Select
                      labelId="department-label"
                      id="department"
                      value={depId || ''}
                      onChange={handleDepartmentChange}
                      label="Chuyên khoa"
                    >
                      {departmentOptions.map(depart => (
                        <MenuItem key={depart.depId} value={depart.depId}>
                          {depart.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
                    <InputLabel id="service-label">Dịch vụ</InputLabel>
                    <Select
                      labelId="service-label"
                      id="service"
                      value={serviceId || ''}
                      onChange={handleServiceChange}
                      label="Dịch vụ"
                      disabled={!depId}
                    >
                      {serviceOptions.length > 0 ? (
                        serviceOptions.map(service => (
                          <MenuItem key={service.serviceId} value={service.serviceId}>
                            {service.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No services available</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
                    <InputLabel id="doctor-label">Bác sĩ</InputLabel>
                    <Select
                      labelId="doctor-label"
                      id="doctor"
                      value={doctorId || ''}
                      onChange={handleDoctorChange}
                      label="Bác sĩ"
                      disabled={!serviceId}
                    >
                      {doctorOptions.length > 0 ? (
                        doctorOptions.map(doc => (
                          <MenuItem key={doc.docId} value={doc.docId}>
                            {doc.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>Không có bác sĩ</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
                    <InputLabel id="date-label">Chọn ngày</InputLabel>
                    <Select
                      labelId="date-label"
                      id="date"
                      value={date || ''}
                      onChange={handleDateChange}
                      label="Chọn ngày"
                      disabled={!doctorId}
                    >
                      {dateOptions.length > 0 ? (
                        dateOptions.map(slotItem => (
                          <MenuItem key={slotItem.$id} value={slotItem.date}>
                            {slotItem.date}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>Không có ngày</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
                    <InputLabel id="time-label">Thời gian</InputLabel>
                    <Select
                      labelId="time-label"
                      id="time"
                      value={time || ''}
                      onChange={handleTimeChange}
                      label="Thời gian"
                      startAdornment={<AccessTimeIcon sx={{ marginRight: 1 }} />}
                      disabled={!date}
                    >
                      {slotOptions.length > 0 ? (
                        slotOptions.map(slotItem => (
                          <MenuItem key={slotItem.slotId} value={slotItem.slotId}>
                            {slotItem.time}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>Không có thời gian</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Đặt lịch
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              sx={{
                width: '100%',
                height: '80%',
                objectFit: 'fill',
              }}
              alt="Appointment illustration"
              src="https://medlatec.vn/med/images/bookings3.png"
            />
          </Grid>
        </Grid>
      </Container>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      <Footer />
    </>
  );
};

export default AppointmentScreen;
