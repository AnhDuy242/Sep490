import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, FormControl, InputLabel, Select, MenuItem, Box, Snackbar, Button } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format, addDays, isAfter } from 'date-fns';
import { bookAppointment, getListDepartment, fetchServices, fetchDoctorByService, fetchDateByDoctor, fetchSlotsByDoctorAndDate, fetchDoctorByDepartments } from '../../services/AppointmentPatient';
import Header from '../../layouts/Header';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import MuiAlert from '@mui/material/Alert';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
    } else {
      fetchDoctorByDepartments(depId)
        .then(data => setDoctorOptions(data || []))
        .catch(error => console.error('Failed to fetch doctors:', error));
    }
  }, [depId]);

  // useEffect(() => {
  //   // Fetch dates by doctor
  //   if (doctorId) {
  //     fetchDateByDoctor(doctorId)
  //       .then(data => setDateOptions(data || []))
  //       .catch(error => console.error('Failed to fetch dates:', error));
  //   }
  // }, [doctorId]);

  useEffect(() => {
    // Fetch dates by doctor
    if (doctorId) {
      fetchDateByDoctor(doctorId)
        .then(data => {
          const filteredDates = getNextFourDays(data);
          setDateOptions(filteredDates || []);
        })
        .catch(error => console.error('Failed to fetch dates:', error));
    }
  }, [doctorId]);


  useEffect(() => {
    // Fetch departments on component mount
    getListDepartment()
      .then(data => setDepartmentOptions(data.$values || []))
      .catch(error => console.error('Error fetching departments:', error));
  }, []);


  useEffect(() => {
    // Fetch slots when date or doctor changes
    if (doctorId && date) {
      fetchSlotsByDoctorAndDate(doctorId, date)
        .then(data => {
          console.log('Fetched slots:', data); // Log data for debugging
          if (data == null || data.length === 0) {
            setSnackbarMessage('Không tìm lịch làm việc.');
            setOpenSnackbar(true);
            setSlotOptions([]); // No slots available
          } else {
            setSlotOptions(data); // Update slot options
          }
        })
        .catch(error => {
          console.error('Failed to fetch slots:', error);
          setOpenSnackbar(true);
        });
    } else {
      setSlotOptions([]); // Clear slots if doctor or date is not selected
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
    setDate(''); // Reset the date when doctor changes
    setSlotOptions([]); // Clear slots when doctor changes
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

        setTimeout(() => {
          navigate('/getAppointment');
        }, 3000);

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

  //Lấy 4 ngày làm việc tiếp theo của bác sĩ đó
  const getNextFourDays = (dates) => {
    const today = new Date();
    const nextFourDays = [];
    let count = 0;

    for (const dateItem of dates) {
      const [day, month, year] = dateItem.date.split('-');
      const date = new Date(`${year}-${month}-${day}`);

      if (isAfter(date, today) || date.toDateString() === today.toDateString()) {
        nextFourDays.push(dateItem);
        count++;
      }

      if (count === 4) break;
    }

    return nextFourDays;
  };

  const handleRandomDoctor = async () => {
    try {
      setServId(null);
  
      // Lặp qua danh sách chuyên khoa cho đến khi tìm được một chuyên khoa có bác sĩ và ngày/slot
      let foundValidDepartment = false;
      while (!foundValidDepartment) {
        // Random chọn một chuyên khoa
        const randomDep = departmentOptions[Math.floor(Math.random() * departmentOptions.length)];
        setDepId(randomDep.depId);
  
        // Lấy danh sách bác sĩ của chuyên khoa đó
        const doctors = await fetchDoctorByDepartments(randomDep.depId);
  
        // Lặp qua danh sách bác sĩ cho đến khi tìm được một bác sĩ có ngày và slot
        let foundValidDoctor = false;
        for (const doctor of doctors) {
          setDoctorId(doctor.docId);
          handleDoctorChange({ target: { value: doctor.docId } });
  
          // Lấy danh sách ngày của bác sĩ đó
          const dates = await fetchDateByDoctor(doctor.docId);
          const filteredDates = getNextFourDays(dates);
          setDateOptions(filteredDates);
  
          if (filteredDates.length > 0) {
            // Chọn ngày đầu tiên nếu có
            const selectedDate = filteredDates[0].date;
            setDate(selectedDate);
  
            // Lấy danh sách slot của ngày đó
            const slots = await fetchSlotsByDoctorAndDate(doctor.docId, selectedDate);
            if (slots && slots.length > 0) {
              // Chọn một slot ngẫu nhiên từ danh sách slot
              const randomSlot = slots[Math.floor(Math.random() * slots.length)];
              setSlotOptions(slots);
              setTime(randomSlot.slotId);
              foundValidDoctor = true;
              foundValidDepartment = true;
              break;
            }
          }
        }
  
        // Nếu không tìm được bác sĩ có ngày và slot, thử chuyên khoa khác
        if (!foundValidDoctor) {
          setDate('');
          setSlotOptions([]);
        }
      }
  
      setOpenSnackbar(true);
      setSnackbarMessage('Đã chọn ngẫu nhiên một lịch khám. Vui lòng kiểm tra lại thông tin!');
    } catch (error) {
      console.error('Error in random selection:', error);
      setOpenSnackbar(true);
      setSnackbarMessage('Có lỗi xảy ra khi chọn ngẫu nhiên. Vui lòng thử lại!');
    }
  };

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
                  <FormControl fullWidth variant="outlined" sx={{ marginTop: 2 }}>
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
                  <FormControl fullWidth variant="outlined" sx={{ marginTop: 2 }}>
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
                        <MenuItem disabled>Không có dịch vụ hiện có</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" sx={{ marginTop: 2 }}>
                    <InputLabel id="doctor-label">Bác sĩ</InputLabel>
                    <Select
                      labelId="doctor-label"
                      id="doctor"
                      value={doctorId || ''}
                      onChange={handleDoctorChange}
                      label="Bác sĩ"
                    // disabled={!serviceId}
                    >
                      {doctorOptions.length > 0 ? (
                        doctorOptions.map(doc => (
                          <MenuItem key={doc.docId} value={doc.docId}>
                            {doc.name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>Không có bác sĩ sẵn có</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" sx={{ marginTop: 2 }}>
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
                        <MenuItem disabled>Không có ngày sẵn có</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" sx={{ marginTop: 2 }}>
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
                  <Typography
                    variant="body1"
                    color="primary"
                    onClick={handleRandomDoctor}
                    sx={{  cursor: 'pointer' }}
                  >
                    Nếu bạn chưa chọn được dịch vụ mong muốn hãy bấm vào đây
                  </Typography>

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
