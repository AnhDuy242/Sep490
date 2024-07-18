import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box, Snackbar } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format } from 'date-fns';
import { bookAppointment, getListDepartment, fetchDoctors, fetchSlots } from '../../services/AppointmentPatient';
import Header from '../../layouts/Header';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import MuiAlert from '@mui/material/Alert';

const AppointmentScreen = () => {
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [department, setDepartment] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [slot, setSlot] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [depId, setDepId]= useState('');

  const formRef = useRef(null);

  useEffect(() => {
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
    getListDepartment()
      .then(data => {
        setDepartmentOptions(data.$values);
      })
      .catch(error => {
        console.error('Failed to fetch slots:', error);
      });
  }, []);

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
    setDoctor('');
  };

  const handleDoctorChange = (event) => {
    setDoctor(event.target.value);
    setDoctorId(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

 

  const accountId = localStorage.getItem('accountId');
  const handleSubmit = (event) => {
    event.preventDefault();
    const formattedDate = date ? format(new Date(date), 'dd-MM-yyyy') : '';
    const appointmentDto = {
      patientId: accountId,
      doctorId: doctorId,
      date: formattedDate,
      slotId: time,
      depId: depId
    };

    console.log('Submitting appointment data:', appointmentDto);

    bookAppointment(appointmentDto)
      .then(responseData => {
        console.log('Appointment booked successfully:', responseData);
        setOpenSnackbar(true);
        setSnackbarMessage('Đặt lịch thành công!');
        setPatientId('');
        setDoctor('');
        setDoctorId('');
        setDate('');
        setTime('');
        setDepId('');

        // Kiểm tra nếu formRef tồn tại trước khi đặt scrollTop
        if (formRef.current) {
          formRef.current.scrollTop = 0;
        }
      })
      .catch(error => {
        console.error('Error booking appointment:', error);
        setOpenSnackbar(true);
        setSnackbarMessage('Đặt lịch thất bại. Vui lòng thử lại!');
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
      <Header />
      <Navbar />
      <Container ref={formRef} sx={{ marginTop: 20 }}>
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
                      value={department || ''}
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
                    <InputLabel id="doctor-label">Bác sĩ</InputLabel>
                    <Select
                      labelId="doctor-label"
                      id="doctor"
                      value={doctor || ''}
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
                    value={date || ''}
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
                      value={time || ''}
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
        <div>
          <SnackbarMessage severity="success">
            {snackbarMessage}
          </SnackbarMessage>
        </div>
      </Snackbar>
      <Footer />
    </>
  );
};

export default AppointmentScreen;
