
// import React, { useState, useEffect } from 'react';
// import { Container, Typography, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
// import AccessTimeIcon from '@mui/icons-material/AccessTime';
// import { bookAppointment, getListDepartment, fetchDoctors, fetchSlots } from '../../services/AppointmentPatient'; // Import service functions

// const AppointmentScreen = () => {
//   const [departmentOptions, setDepartmentOptions] = useState([]);
//   const [doctorOptions, setDoctorOptions] = useState([]);
//   const [department, setDepartment] = useState('');
//   const [doctor, setDoctor] = useState('');
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');
//   const [note, setNote] = useState('');
//   const [slot, setSlot] = useState([]);

//   useEffect(() => {
//     // Fetch departments from API
//     getListDepartment()
//       .then(data => {
//         console.log('Fetched departments:', data);
//         setDepartmentOptions(Array.isArray(data) ? data : []);
//       })
//       .catch(error => {
//         console.error('Error fetching departments:', error);
//       });
//   }, []);

//   useEffect(() => {
//     // Fetch doctors from API
//     fetchDoctors()
//       .then(data => {
//         console.log('Fetched doctors:', data);
//         setDoctorOptions(data.$values || []);
//       })
//       .catch(error => {
//         console.error('Failed to fetch doctors:', error);
//       });

//     fetchSlots()
//       .then(data => {
//         setSlot(data.$values);
//       })
//       .catch(error => {
//         console.error('Failed to fetch slots:', error);
//       });
//   }, []);

//   const handleDepartmentChange = (event) => {
//     setDepartment(event.target.value);
//     setDoctor(''); // Reset doctor when department changes
//   };

//   const handleDoctorChange = (event) => {
//     setDoctor(event.target.value);
//   };

//   const handleDateChange = (event) => {
//     setDate(event.target.value);
//   };

//   const handleTimeChange = (event) => {
//     setTime(event.target.value);
//   };

//   const handleNoteChange = (event) => {
//     setNote(event.target.value);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const appointmentData = { department, doctor, date, time, note };

//     // Call the service function
//     bookAppointment(appointmentData)
//       .then(responseData => {
//         console.log('Appointment booked successfully:', responseData);
//         // Optionally, handle success (e.g., display a success message, clear the form, etc.)
//       })
//       .catch(error => {
//         console.error('Error booking appointment:', error);
//       });
//   };




//   return (
//     <Container sx={{ marginTop: 20 }}>
//       <Typography
//         variant="h4"
//         gutterBottom
//         sx={{
//           color: 'primary.main',
//           fontWeight: 'bold',
//           textAlign: 'center',
//           marginTop: 2,
//         }}
//       >
//         Đặt lịch khám
//       </Typography>
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <form onSubmit={handleSubmit}>
//             <Grid container spacing={3}>
//               {/* <Grid item xs={12}>
//                 <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
//                   <InputLabel id="department-label">Chuyên khoa</InputLabel>
//                   <Select
//                     labelId="department-label"
//                     id="department"
//                     value={department}
//                     onChange={handleDepartmentChange}
//                     label="Chuyên khoa"
//                   >
//                     {departmentOptions.map(department => (
//                       <MenuItem key={department.depId} value={department.depId}>
//                         {department.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid> */}
//               <Grid item xs={12}>
//                 <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
//                   <InputLabel id="doctor-label">Bác sĩ</InputLabel>
//                   <Select
//                     labelId="doctor-label"
//                     id="doctor"
//                     value={doctor}
//                     onChange={handleDoctorChange}
//                     label="Bác sĩ"
//                   >
//                     {doctorOptions.map(doctor => (
//                       <MenuItem key={doctor.accId} value={doctor.accId}>
//                         {doctor.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   id="date"
//                   label="Ngày"
//                   type="date"
//                   fullWidth
//                   variant="outlined"
//                   value={date}
//                   onChange={handleDateChange}
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                   required
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 {/* <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
//                   <InputLabel id="time-label">Thời gian</InputLabel>
//                   <Select
//                     labelId="time-label"
//                     id="time"
//                     value={time}
//                     onChange={handleTimeChange}
//                     label="Thời gian"
//                     startAdornment={<AccessTimeIcon sx={{ marginRight: 1 }} />}
//                   >
//                     {timeSlots.map((slot) => (
//                       <MenuItem key={slot} value={slot}>
//                         {slot}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl> */}
//                 <Select
//                   margin="dense"
//                   name="slotId"
//                   labelId="slot-select-label"
//                   id="slot-select"
//                   label="Thời gian"
//                   fullWidth
//                   onChange={handleTimeChange}
//                 >
//                   {slot.map(slot => (
//                     <MenuItem key={slot.slotId} value={slot.slotId}>{slot.time}</MenuItem>
//                   ))}
//                 </Select>
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   id="note"
//                   name="note"
//                   label="Ghi chú"
//                   fullWidth
//                   variant="outlined"
//                   multiline
//                   rows={4}
//                   value={note}
//                   onChange={handleNoteChange}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <Button type="submit" variant="contained" color="primary" fullWidth>
//                   Đặt lịch
//                 </Button>
//               </Grid>
//             </Grid>
//           </form>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Box
//             component="img"
//             sx={{
//               width: '100%',
//               height: '80%',
//               objectFit: 'fill',
//             }}
//             alt="Appointment illustration"
//             src="https://medlatec.vn/med/images/bookings3.png"
//           />
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default AppointmentScreen;


import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { bookAppointment, getListDepartment, fetchDoctors, fetchSlots } from '../../services/AppointmentPatient'; // Import service functions

const AppointmentScreen = () => {
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [department, setDepartment] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [slot, setSlot] = useState([]);

  useEffect(() => {
    // Fetch departments from API
    getListDepartment()
      .then(data => {
        console.log('Fetched departments:', data);
        setDepartmentOptions(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch doctors and slots from API
    fetchDoctors()
      .then(data => {
        console.log('Fetched doctors:', data);
        setDoctorOptions(data.$values || []);
      })
      .catch(error => {
        console.error('Failed to fetch doctors:', error);
      });

    fetchSlots()
      .then(data => {
        setSlot(data.$values);
      })
      .catch(error => {
        console.error('Failed to fetch slots:', error);
      });
  }, []);

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
    setDoctor(''); // Reset doctor when department changes
  };

  const handleDoctorChange = (event) => {
    setDoctor(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const appointmentData = { department, doctor, date, time, note };

    // Call the service function to book appointment
    bookAppointment(appointmentData)
      .then(responseData => {
        console.log('Appointment booked successfully:', responseData);
        // Optionally, handle success (e.g., display a success message, clear the form, etc.)
        // Example: Clear form fields after successful booking
        setDepartment('');
        setDoctor('');
        setDate('');
        setTime('');
        setNote('');
      })
      .catch(error => {
        console.error('Error booking appointment:', error);
      });
  };

  return (
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
                    value={department}
                    onChange={handleDepartmentChange}
                    label="Chuyên khoa"
                  >
                    {departmentOptions.map(department => (
                      <MenuItem key={department.depId} value={department.depId}>
                        {department.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
                  <InputLabel id="doctor-label">Bác sĩ</InputLabel>
                  <Select
                    labelId="doctor-label"
                    id="doctor"
                    value={doctor}
                    onChange={handleDoctorChange}
                    label="Bác sĩ"
                  >
                    {doctorOptions.map(doctor => (
                      <MenuItem key={doctor.accId} value={doctor.accId}>
                        {doctor.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="date"
                  label="Ngày"
                  type="date"
                  fullWidth
                  variant="outlined"
                  value={date}
                  onChange={handleDateChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
                  <InputLabel id="time-label">Thời gian</InputLabel>
                  <Select
                    labelId="time-label"
                    id="time"
                    value={time}
                    onChange={handleTimeChange}
                    label="Thời gian"
                    startAdornment={<AccessTimeIcon sx={{ marginRight: 1 }} />}
                  >
                    {slot.map(slot => (
                      <MenuItem key={slot.slotId} value={slot.slotId}>
                        {slot.time}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="note"
                  name="note"
                  label="Ghi chú"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={4}
                  value={note}
                  onChange={handleNoteChange}
                />
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
  );
};

export default AppointmentScreen;

