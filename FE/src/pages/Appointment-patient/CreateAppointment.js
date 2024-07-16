import React, { Component } from 'react';
import { Container, Typography, Grid, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

class AppointmentScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      department: '',
      doctor: '',
      date: '',
      time: '',
      note: '',
    };
  }

  handleDepartmentChange = (event) => {
    this.setState({ department: event.target.value });
  };

  handleDoctorChange = (event) => {
    this.setState({ doctor: event.target.value });
  };

  handleDateChange = (event) => {
    this.setState({ date: event.target.value });
  };

  handleTimeChange = (event) => {
    this.setState({ time: event.target.value });
  };

  handleNoteChange = (event) => {
    this.setState({ note: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log(this.state);
  };

  generateTimeSlots = () => {
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

  render() {
    const timeSlots = this.generateTimeSlots();

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
            <form onSubmit={this.handleSubmit}>
              <Grid container spacing={3}>

                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
                    <InputLabel id="department-label">Chuyên khoa</InputLabel>
                    <Select
                      labelId="department-label"
                      id="department"
                      value={this.state.department}
                      onChange={this.handleDepartmentChange}
                      label="Chuyên khoa"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={10}>Khoa nội</MenuItem>
                      <MenuItem value={20}>Khoa ngoại</MenuItem>
                   
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
                    <InputLabel id="doctor-label">Bác sĩ</InputLabel>
                    <Select
                      labelId="doctor-label"
                      id="doctor"
                      value={this.state.doctor}
                      onChange={this.handleDoctorChange}
                      label="Bác sĩ"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={1}>Dr. Nguyễn Văn A</MenuItem>
                      <MenuItem value={2}>Dr. Trần Văn B</MenuItem>
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
                    value={this.state.date}
                    onChange={this.handleDateChange}
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
                      value={this.state.time}
                      onChange={this.handleTimeChange}
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
                    value={this.state.note}
                    onChange={this.handleNoteChange}
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
  }
}

export default AppointmentScreen;
