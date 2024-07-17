import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { bookAppointment, getListDepartment, getListDoctor } from '../../services/AppointmentPatient'; // Import service functions

const AppointmentScreen = () => {
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [department, setDepartment] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    // Fetch departments from API
    getListDepartment()
      .then(data => {
        console.log('Fetched departments:', data);
        setDepartmentOptions(Array.isArray(data) ? data : []); // Ensure data is an array
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
      });
  }, []); // Empty dependency array means this effect runs once after first render

  useEffect(() => {
    // Fetch doctors from API
    getListDoctor()
      .then(data => {
        console.log('Fetched doctors:', data.json());
        setDoctorOptions(Array.isArray(data.$value) ? data.$value : []); // Ensure data is an array
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
      });
  }, []); // Empty dependency array means this effect runs once after first render

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
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

    // Call the service function
    bookAppointment(appointmentData)
      .then(responseData => {
        console.log('Appointment booked successfully:', responseData);
        // Optionally, handle success (e.g., display a success message, clear the form, etc.)
      })
      .catch(error => {
        console.error('Error booking appointment:', error);
      });
  };

  const generateTimeSlots = () => {
    const slots = [];
    const startTime = 7 * 60; // 7:00 AM in minutes
    const endTime = 17 * 60; // 5:00 PM in minutes
    for (let minutes = startTime; minutes <= endTime; minutes += 30) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const time = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      slots.push(time);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

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
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {doctorOptions.map(doctor => (
                      <MenuItem key={doctor.doctorId} value={doctor.doctorId}>
                        {doctor.doctorId}
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
                    {timeSlots.map((slot) => (
                      <MenuItem key={slot} value={slot}>
                        {slot}
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
