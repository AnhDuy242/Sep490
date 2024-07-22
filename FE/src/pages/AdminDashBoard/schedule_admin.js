import React, { useState, useEffect } from 'react';
import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButton,
  Snackbar,
  Alert,
  Button,
  Tabs,
  Tab,
  IconButton,
  Dialog,DialogActions,DialogContentText,DialogTitle,DialogContent
} from '@mui/material';
import { format,endOfWeek, startOfWeek, addDays, subWeeks, addWeeks,isSameWeek,isBefore ,isWithinInterval,getYear, eachWeekOfInterval, endOfYear} from 'date-fns';
import { loadDoctors } from '../../services/doctor_service';
import DeleteIcon from '@material-ui/icons/Delete'; // Import DeleteIcon từ @material-ui/icons
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import {  subDays,parseISO } from 'date-fns';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
};
function AddSchedule({ doctors, setSnackbar }) {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [morningValues, setMorningValues] = useState(Array(7).fill(false));
  const [afternoonValues, setAfternoonValues] = useState(Array(7).fill(false));

  const handleDoctorChange = event => {
    setSelectedDoctor(event.target.value);
  };

  const handleStartDateChange = event => {
    const date = new Date(event.target.value);
    setStartDate(date);
  };

  const handleEndDateChange = event => {
    const date = new Date(event.target.value);
    setEndDate(date);
  };

  const handleSubmit = async () => {
    if (!selectedDoctor || !startDate || !endDate) {
      setSnackbar({
        open: true,
        message: 'Vui lòng chọn bác sĩ và ngày bắt đầu và kết thúc trước khi lưu lịch làm việc!',
        severity: 'error',
      });
      return;
    }
  
    try {
      const requestBody = {
        doctorId: selectedDoctor,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        appointments: 0,
        morning: morningValues,
        afternoon: afternoonValues,
      };
  
      const response = await fetch('https://localhost:7240/api/ManageSchedule/CreateSchedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      const responseText = await response.text();
  
      if (response.status === 201) {
        let message;
        try {
          const data = JSON.parse(responseText);
          if (Array.isArray(data.$values) && data.$values.every(item => item.appointments !== undefined)) {
            // If response has the expected structure
            message = 'Lịch làm việc đã được thêm mới thành công!';
          } else {
            message = 'Dữ liệu không đúng định dạng';
          }
        } catch {
          message = responseText;
        }
        setSnackbar({
          open: true,
          message: message,
          severity: 'success',
        });
      } else if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Lịch làm việc đã được thêm mới thành công!',
          severity: 'success',
        });
      } else {
        let errorMessage;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || 'Đã có lỗi xảy ra khi thêm lịch làm việc';
        } catch {
          errorMessage = 'Đã có lỗi xảy ra khi thêm lịch làm việc';
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    }
  };
  
  

  const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <>
      <FormControl fullWidth margin="normal">
        <InputLabel id="doctor-label">Chọn bác sĩ</InputLabel>
        <Select
          labelId="doctor-label"
          value={selectedDoctor}
          onChange={handleDoctorChange}
        >
          {doctors.map(doctor => (
            <MenuItem key={doctor.accId} value={doctor.accId}>
              {doctor.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box display="flex" justifyContent="space-between" mt={2}>
         <Typography>Chọn ngày bắt đầu</Typography>
         <Typography>Chọn ngày kết thúc</Typography>

          </Box>
      <Box display="flex" justifyContent="space-between" mt={2}>
        <TextField
          type="date"
          value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
          onChange={handleStartDateChange}
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            inputProps: {
              min: format(new Date(), 'yyyy-MM-dd'),
            },
          }}
          placeholder="Chọn ngày bắt đầu"
        />
        <TextField
          type="date"
          value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
          onChange={handleEndDateChange}
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            inputProps: {
              min: startDate ? format(startDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
            },
          }}
          placeholder="Chọn ngày kết thúc"
        />
      </Box>
      <Box mt={2}>
        <Typography variant="h6">Lịch làm việc trong tuần</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {daysOfWeek.map((day, index) => (
                  <TableCell key={index}>{day}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {morningValues.map((value, index) => (
                  <TableCell key={index}>
                    <ToggleButton
                      value="check"
                      selected={value}
                      onChange={() =>
                        setMorningValues(prev => prev.map((m, i) => (i === index ? !m : m)))
                      }
                      disabled={!startDate || !endDate}
                    >
                      {value ? 'Có' : 'Không'}
                    </ToggleButton>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {afternoonValues.map((value, index) => (
                  <TableCell key={index}>
                    <ToggleButton
                      value="check"
                      selected={value}
                      onChange={() =>
                        setAfternoonValues(prev => prev.map((a, i) => (i === index ? !a : a)))
                      }
                      disabled={!startDate || !endDate}
                    >
                      {value ? 'Có' : 'Không'}
                    </ToggleButton>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Lưu lịch làm việc
        </Button>
      </Box>
    </>
  );
}
const EditSchedule = ({ doctors, setSnackbar }) => {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  useEffect(() => {
    if (!selectedDoctor) return;

    const fetchSchedules = async () => {
      try {
        const startOfWeekDate = startOfWeek(currentWeek, { weekStartsOn: 1 });

        const response = await fetch(
          `https://localhost:7240/api/ManageSchedule/GetAllSchedulesByDoctorId?doctorId=${selectedDoctor}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Filter schedules to only include current week
        const filteredSchedules = data.$values.filter((schedule) =>
          isSameWeek(new Date(schedule.date), currentWeek, { weekStartsOn: 1 })
        );

        setSchedules(filteredSchedules);
      } catch (error) {
        setSnackbar({ open: true, message: error.message, severity: 'error' });
      }
    };

    fetchSchedules();
  }, [selectedDoctor, currentWeek, setSnackbar]);

  const handleDoctorChange = (event) => {
    const doctorId = event.target.value;
    setSelectedDoctor(doctorId);
  };

  const handleToggleMorning = (dayIndex) => {
    setSchedules((prevSchedules) =>
      prevSchedules.map((schedule, index) =>
        index === dayIndex
          ? { ...schedule, morning: !schedule.morning }
          : schedule
      )
    );
  };

  const handleToggleAfternoon = (dayIndex) => {
    setSchedules((prevSchedules) =>
      prevSchedules.map((schedule, index) =>
        index === dayIndex
          ? { ...schedule, afternoon: !schedule.afternoon }
          : schedule
      )
    );
  };

  const handleSubmit = async () => {
    if (!selectedDoctor) {
      setSnackbar({ open: true, message: 'Vui lòng chọn bác sĩ trước khi lưu lịch làm việc!', severity: 'error' });
      return;
    }
  
    try {
      const selectedSchedules = schedules
        .filter(schedule => schedule.morning || schedule.afternoon)
        .map(schedule => ({
          ...schedule,
          doctorId: selectedDoctor, // Ensure doctorId is correctly set
        }));
  
      const response = await Promise.all(selectedSchedules.map(schedule =>
        fetch(`https://localhost:7240/api/ManageSchedule/UpdateSchedule/${schedule.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(schedule)
        })
      ));
  
      const success = response.every(res => res.ok);
  
      if (success) {
        setSnackbar({ open: true, message: 'Lịch làm việc đã được cập nhật thành công!', severity: 'success' });
      } else {
        // If any of the responses is not ok, handle the error accordingly
        const errorMessages = await Promise.all(response.map(res => res.text()));
        const detailedMessage = errorMessages.filter(msg => msg).join(', ');
  
        throw new Error(`Đã có lỗi xảy ra khi cập nhật lịch làm việc: ${detailedMessage}`);
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    }
  };

  const getDaysOfWeek = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => format(addDays(start, i), 'EEE dd/MM'));
  };

  const daysOfWeek = getDaysOfWeek(currentWeek);

  const handleBackWeek = () => {
    setCurrentWeek((prev) => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek((prev) => addWeeks(prev, 1));
  };

  return (
    <>
      <FormControl fullWidth margin="normal">
        <InputLabel id="doctor-label">Chọn bác sĩ</InputLabel>
        <Select
          labelId="doctor-label"
          value={selectedDoctor}
          onChange={handleDoctorChange}
        >
          {doctors.map((doctor) => (
            <MenuItem key={doctor.accId} value={doctor.accId}>
              {doctor.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box display="flex" justifyContent="space-between" mt={2}>
        <IconButton onClick={handleBackWeek}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6">
          Tuần bắt đầu từ {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'dd/MM/yyyy')}
        </Typography>
        <IconButton onClick={handleNextWeek}>
          <ArrowForward />
        </IconButton>
      </Box>
      {selectedDoctor && (
        <Box mt={4}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  {daysOfWeek.map((day, index) => (
                    <TableCell key={index} align="center">
                      {day}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Morning</TableCell>
                  {daysOfWeek.map((day, index) => (
                    <TableCell key={index} align="center">
                      {schedules.some(schedule => format(new Date(schedule.date), 'EEE dd/MM') === day) ? (
                        <ToggleButton
                          selected={schedules.find(schedule => format(new Date(schedule.date), 'EEE dd/MM') === day)?.morning}
                          onChange={() => handleToggleMorning(schedules.findIndex(schedule => format(new Date(schedule.date), 'EEE dd/MM') === day))}
                        >
                          {schedules.find(schedule => format(new Date(schedule.date), 'EEE dd/MM') === day)?.morning ? 'Có lịch' : 'Nghỉ'}
                        </ToggleButton>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>Afternoon</TableCell>
                  {daysOfWeek.map((day, index) => (
                    <TableCell key={index} align="center">
                      {schedules.some(schedule => format(new Date(schedule.date), 'EEE dd/MM') === day) ? (
                        <ToggleButton
                          selected={schedules.find(schedule => format(new Date(schedule.date), 'EEE dd/MM') === day)?.afternoon}
                          onChange={() => handleToggleAfternoon(schedules.findIndex(schedule => format(new Date(schedule.date), 'EEE dd/MM') === day))}
                        >
                          {schedules.find(schedule => format(new Date(schedule.date), 'EEE dd/MM') === day)?.afternoon ? 'Có lịch' : 'Nghỉ'}
                        </ToggleButton>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Chỉnh sửa 
        </Button>
      </Box>
    </>
  );
};


const DeleteSchedule = ({ doctors, setSnackbar }) => {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  useEffect(() => {
    if (!selectedDoctor) return;

    const fetchSchedules = async () => {
      try {
        const startOfWeekDate = startOfWeek(currentWeek, { weekStartsOn: 1 });

        const response = await fetch(
          `https://localhost:7240/api/ManageSchedule/GetAllSchedulesByDoctorId?doctorId=${selectedDoctor}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Filter schedules to only include current week
        const filteredSchedules = data.$values.filter((schedule) =>
          isSameWeek(new Date(schedule.date), currentWeek, { weekStartsOn: 1 })
        );

        setSchedules(filteredSchedules);
      } catch (error) {
        setSnackbar({ open: true, message: error.message, severity: 'error' });
      }
    };

    fetchSchedules();
  }, [selectedDoctor, currentWeek, setSnackbar]);

  const handleDoctorChange = (event) => {
    const doctorId = event.target.value;
    setSelectedDoctor(doctorId);
  };

  const handleToggleDelete = (schedule) => {
    setSelectedSchedule(schedule);
    setConfirmDeleteOpen(true); // Mở dialog xác nhận xóa
  };

  const handleDeleteConfirmed = async () => {
    try {
      if (!selectedSchedule) {
        throw new Error('Không có lịch làm việc nào được chọn để xóa');
      }

      const response = await fetch(
        `https://localhost:7240/api/ManageSchedule/Delete/${selectedSchedule.id}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Đã xóa lịch làm việc thành công!',
          severity: 'success',
        });

        // Xóa lịch làm việc khỏi danh sách hiển thị
        setSchedules((prevSchedules) =>
          prevSchedules.filter((schedule) => schedule.id !== selectedSchedule.id)
        );
      } else {
        throw new Error('Đã có lỗi xảy ra khi xóa lịch làm việc');
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    }

    setConfirmDeleteOpen(false); // Đóng dialog xác nhận xóa
  };

  const getDaysOfWeek = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => format(addDays(start, i), 'EEE dd/MM'));
  };

  const daysOfWeek = getDaysOfWeek(currentWeek);

  const handleBackWeek = () => {
    setCurrentWeek((prev) => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek((prev) => addWeeks(prev, 1));
  };

  return (
    <>
      <FormControl fullWidth margin="normal">
        <Typography variant="h6">Chọn bác sĩ để xóa lịch làm việc:</Typography>
        <Select
          labelId="doctor-label-delete"
          value={selectedDoctor}
          onChange={handleDoctorChange}
        >
          {doctors.map((doctor) => (
            <MenuItem key={doctor.accId} value={doctor.accId}>
              {doctor.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedDoctor && (
        <>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <IconButton onClick={handleBackWeek}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h6">
              Tuần bắt đầu từ{' '}
              {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'dd/MM/yyyy')}
            </Typography>
            <IconButton onClick={handleNextWeek}>
              <ArrowForward />
            </IconButton>
          </Box>
          <Box mt={4}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Thời gian</TableCell>
                    <TableCell align="center">Xóa</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell align="center">
                        {format(new Date(schedule.date), 'EEE dd/MM/yyyy')}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => handleToggleDelete(schedule)}
                          color="secondary"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        aria-labelledby="delete-schedule-dialog-title"
        aria-describedby="delete-schedule-dialog-description"
      >
        <DialogTitle id="delete-schedule-dialog-title">
          Xác nhận xóa lịch làm việc
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa lịch làm việc này không?
          </Typography>
          <Typography>
            {selectedSchedule && (
              <strong>{format(new Date(selectedSchedule.date), 'yyyy-MM-dd')}</strong>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteConfirmed} color="secondary" autoFocus>
            Xác nhận xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};



const ViewSchedule = ({ doctors, setSnackbar }) => {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState('');

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleSubmit = async () => {
    if (!Boolean(selectedDoctor) || !startDate || !endDate) {
      setError('Vui lòng chọn bác sĩ và nhập đầy đủ ngày bắt đầu và ngày kết thúc.');
      return;
    }
  
    try {
      const response = await fetch(`https://localhost:7240/api/ManageSchedule/GetAllSchedulesByDoctorId?doctorId=${selectedDoctor}`);
      if (!response.ok) {
        throw new Error(`Không thể lấy dữ liệu lịch trình (${response.status})`);
      }
      const data = await response.json();
      if (data.$values.length === 0) {
        throw new Error('Không có kết quả nào được tìm thấy.');
      }
  
      setSchedules(data.$values);
      setError('');
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
      setSchedules([]);
    }
  };

  useEffect(() => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError('Ngày bắt đầu không thể sau ngày kết thúc');
    } else {
      setError('');
    }
  }, [startDate, endDate]);

  return (
    <>
      <FormControl fullWidth margin="normal">
        <InputLabel id="doctor-label">Chọn bác sĩ</InputLabel>
        <Select
          labelId="doctor-label"
          value={selectedDoctor}
          onChange={handleDoctorChange}
        >
          {doctors.map((doctor) => (
            <MenuItem key={doctor.accId} value={doctor.accId}>
              {doctor.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Ngày bắt đầu"
        type="date"
        value={startDate}
        onChange={handleStartDateChange}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Ngày kết thúc"
        type="date"
        value={endDate}
        onChange={handleEndDateChange}
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        style={{ marginTop: '1rem' }}
      >
        Gửi
      </Button>
      {error && (
        <Snackbar open={Boolean(error)} autoHideDuration={6000}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
      {schedules.length > 0 && (
        <Box mt={4}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Ngày</TableCell>
                  <TableCell align="center">Buổi Sáng</TableCell>
                  <TableCell align="center">Buổi Chiều</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedules.map((schedule) => {
                  const scheduleDate = parseISO(schedule.date);
                  if (isWithinInterval(scheduleDate, { start: parseISO(startDate), end: parseISO(endDate) })) {
                    return (
                      <TableRow key={schedule.id}>
                        <TableCell align="center">{format(scheduleDate, 'dd/MM/yyyy')}</TableCell>
                        <TableCell align="center">{schedule.morning ? 'Có lịch' : 'Nghỉ'}</TableCell>
                        <TableCell align="center">{schedule.afternoon? 'Có lịch' : 'Nghỉ'}</TableCell>
                      </TableRow>
                    );
                  }
                  return null;
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
};


const DoctorScheduleForm = () => {
  const [doctors, setDoctors] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        console.log("Starting to fetch doctors");
        const response = await loadDoctors(setDoctors, setLoading, setError);
        console.log("Response received:", response);

        if (!response || !response.$values) {
          throw new Error('Failed to fetch doctors');
        }

        const data = response.$values;
        console.log("Fetched data:", data);
        setDoctors(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setSnackbar({ open: true, message: 'Đã có lỗi xảy ra khi tải danh sách bác sĩ', severity: 'error' });
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Quản lý lịch làm việc của bác sĩ
      </Typography>
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Thêm mới lịch làm việc" />
        <Tab label="Chỉnh sửa lịch làm việc" />
        <Tab label="Xóa lịch làm việc" />
        <Tab label="Xem lịch làm việc" />

      </Tabs>
      <TabPanel value={tabValue} index={0}>
        <AddSchedule doctors={doctors} setSnackbar={setSnackbar} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <EditSchedule doctors={doctors} setSnackbar={setSnackbar} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <DeleteSchedule doctors={doctors} setSnackbar={setSnackbar} />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <ViewSchedule doctors={doctors} setSnackbar={setSnackbar} />
      </TabPanel>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DoctorScheduleForm;
