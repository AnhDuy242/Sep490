import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box, Snackbar } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format } from 'date-fns';
import { bookAppointment, getListDepartment, fetchDoctors, fetchSlots, fetchServices, fetchDoctorByService } from '../../services/AppointmentPatient';
import Header from '../../layouts/Header';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import MuiAlert from '@mui/material/Alert';

const AppointmentScreen = () => {
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [slot, setSlot] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [serviceId, setServId] = useState('');
  const [depId, setDepId] = useState('');
  const [service, setService] = useState('');

  const formRef = useRef(null);

  useEffect(() => {
    // Fetch departments on component mount
    getListDepartment()
      .then(data => {
        console.log('Fetched departments:', data);
        setDepartmentOptions(data.$values || []);
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
      });
    fetchSlots()
      .then(data => {
        console.log('Fetched slots:', data);
        setSlot(data.$values || []);
      })
      .catch(error => {
        console.error('Failed to fetch slots:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch services when department changes
    if (depId) {
      fetchServices(depId)
        .then(data => {
          console.log('Fetched services:', data);
          setServiceOptions(data || []);
          console.log('After setServiceOptions:', data || []);
        })
        .catch(error => {
          console.error('Failed to fetch services:', error);
        });
    }
  }, [depId]);

  useEffect(() => {
    // Fetch services when department changes
    if (serviceId) {
      fetchDoctorByService(serviceId)
        .then(data => {
          console.log('Fetched services:', data);
          setDoctorOptions(data || []);
          console.log('After set doc:', data || []);
        })
        .catch(error => {
          console.error('Failed to fetch services:', error);
        });
    }
  }, [serviceId]);



  const handleDepartmentChange = (event) => {
    const depId = event.target.value;
    setDepId(depId);
    setDoctor(''); // Reset doctor selection when department changes
    setServId(''); // Reset service selection when department changes
    console.log('Selected department:', depId); // Log selected department ID
  };

  const handleDoctorChange = (event) => {
    const doctorId = event.target.value;
    setDoctorId(doctorId);
    setDoctor(doctorId); // Assuming doctor name is also needed somewhere
  };

  const handleDateChange = (event) => {
    const date = event.target.value;
    setDate(date);
  };

  const handleTimeChange = (event) => {
    const time = event.target.value;
    setTime(time);
  };

  const handleServiceChange = (event) => {
    const serviceId = event.target.value;
    setServId(serviceId);
    setService(serviceId);
    console.log('id của cái này là:', serviceId)
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
      depId: depId,
      serviceId: serviceId
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
        setServId('');

        // Scroll to top of the form if formRef exists
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
                      value={doctor || ''}
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
                      {slot.map(slotItem => (
                        <MenuItem key={slotItem.slotId} value={slotItem.slotId}>
                          {slotItem.time}
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



