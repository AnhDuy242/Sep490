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
import { format, startOfWeek, addDays, subWeeks, addWeeks,isSameWeek,isBefore ,isWithinInterval,getYear, eachWeekOfInterval, endOfYear} from 'date-fns';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { loadDoctors } from '../../services/doctor_service';
import DeleteIcon from '@material-ui/icons/Delete'; // Import DeleteIcon từ @material-ui/icons

import { parseISO } from 'date-fns';

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
const AddSchedule = ({ doctors, setSnackbar }) => {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));
  const [selectedWeek, setSelectedWeek] = useState('');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [existingSchedules, setExistingSchedules] = useState([]);
  const [morningSchedule, setMorningSchedule] = useState([]);
  const [afternoonSchedule, setAfternoonSchedule] = useState([]);
  const [disabledDays, setDisabledDays] = useState([]);
  const [weekOptions, setWeekOptions] = useState([]);

  // Define state for managing tabs
  const [value, setValue] = useState(0); // Initial tab index

  useEffect(() => {
    setExistingSchedules([]);
    setMorningSchedule([]);
    setAfternoonSchedule([]);
    setSelectedWeek('');
    setDisabledDays([]);
    generateWeekOptions(selectedYear);
  }, [selectedDoctor, selectedYear]);

  const generateWeekOptions = (year) => {
    const start = new Date(year, 0, 1);
    const end = endOfYear(start);
    const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });
    const formattedWeeks = weeks.map(startOfWeekDate => ({
      label: `${format(startOfWeekDate, 'dd/MM')} - ${format(addDays(startOfWeekDate, 6), 'dd/MM')}`,
      value: startOfWeekDate
    }));
    setWeekOptions(formattedWeeks);
  };

  const handleDoctorChange = async (event) => {
    const doctorId = event.target.value;
    setSelectedDoctor(doctorId);
  };

  const handleYearChange = async (event) => {
    const year = event.target.value;
    setSelectedYear(year);
    setSelectedWeek('');
    generateWeekOptions(year);
  };

  const handleWeekChange = async (event) => {
    const week = event.target.value;
    setSelectedWeek(week);
    setCurrentWeek(week);

    if (selectedDoctor) {
      try {
        const response = await fetch(`https://localhost:7240/api/DoctorSchedule/GetAllSchedulesByDoctorId?doctorId=${selectedDoctor}`);
        if (!response.ok) {
          throw new Error(`HTTP error.status: ${response.status}`);
        }
        const data = await response.json();
        const existingSchedulesInWeek = data.$values.filter(schedule =>
          new Date(schedule.date) >= week &&
          new Date(schedule.date) < addWeeks(week, 1)
        );
        setExistingSchedules(existingSchedulesInWeek);

        const disabledDaysArray = existingSchedulesInWeek.map(schedule => format(new Date(schedule.date), 'EEE dd/MM'));
        setDisabledDays(disabledDaysArray);
      } catch (error) {
        setSnackbar({ open: true, message: error.message, severity: 'error' });
      }
    }
  };

  const handleToggleMorning = (day) => {
    if (disabledDays.includes(day)) {
      setSnackbar({ open: true, message: 'Ngày này đã có lịch làm việc!', severity: 'warning' });
      return;
    }

    setMorningSchedule((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleToggleAfternoon = (day) => {
    if (disabledDays.includes(day)) {
      setSnackbar({ open: true, message: 'Ngày này đã có lịch làm việc!', severity: 'warning' });
      return;
    }

    setAfternoonSchedule((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const getDaysOfWeek = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => format(addDays(start, i), 'EEE dd/MM'));
  };

  const daysOfWeek = getDaysOfWeek(currentWeek);

  const handleBackWeek = () => {
    const newCurrentWeek = subWeeks(currentWeek, 1);
    setCurrentWeek(newCurrentWeek);
    setSelectedWeek(newCurrentWeek);
  };

  const handleNextWeek = () => {
    const newCurrentWeek = addWeeks(currentWeek, 1);
    setCurrentWeek(newCurrentWeek);
    setSelectedWeek(newCurrentWeek);
  };

  const handleSubmit = async () => {
    if (!selectedDoctor || !selectedWeek) {
      setSnackbar({ open: true, message: 'Vui lòng chọn bác sĩ và tuần trước khi lưu lịch làm việc!', severity: 'error' });
      return;
    }

    try {
      const startOfWeekDate = startOfWeek(new Date(selectedWeek), { weekStartsOn: 1 });

      const schedules = daysOfWeek.map((day, index) => {
        const [weekdays, date] = day.split(' ');
        const adjustedDate = format(addDays(startOfWeekDate, index), 'yyyy-MM-dd');
        const formattedDateTime = `${adjustedDate}T00:00:00Z`;

        return {
          doctorId: selectedDoctor,
          morning: morningSchedule.includes(day),
          afternoon: afternoonSchedule.includes(day),
          weekdays,
          date: formattedDateTime,
          weekId: 0,
          appointments: 0
        };
      });

      const response = await Promise.all(schedules.map(schedule =>
        fetch('https://localhost:7240/api/DoctorSchedule/CreateSchedule', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(schedule)
        })
      ));

      const success = response.every(res => res.ok);
      if (success) {
        setSnackbar({ open: true, message: 'Lịch làm việc đã được thêm mới thành công!', severity: 'success' });

        // Update tab value to switch to Edit Schedule tab
        setValue(1);
      } else {
        throw new Error('Đã có lỗi xảy ra khi thêm lịch làm việc');
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    }
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
      <FormControl fullWidth margin="normal">
        <InputLabel id="year-label">Chọn năm</InputLabel>
        <Select
          labelId="year-label"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {Array.from({ length: 5 }, (_, i) => getYear(new Date()) - 2 + i).map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="week-label">Chọn tuần</InputLabel>
        <Select
          labelId="week-label"
          value={selectedWeek}
          onChange={handleWeekChange}
        >
          {weekOptions.map((week, index) => (
            <MenuItem key={index} value={week.value}>
              {week.label}
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
      {selectedWeek && (
        <Box mt={4}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  {daysOfWeek.map((day, index) => (
                    !existingSchedules.some(schedule => format(new Date(schedule.date), 'EEE dd/MM') === day) && (
                      <TableCell key={index} align="center">
                        {day}
                      </TableCell>
                    )
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Morning</TableCell>
                  {daysOfWeek.map((day, index) => (
                    !existingSchedules.some(schedule => format(new Date(schedule.date), 'EEE dd/MM') === day) && (
                      <TableCell key={index} align="center">
                        <ToggleButton
                          selected={morningSchedule.includes(day)}
                          onChange={() => handleToggleMorning(day)}
                          value={day}
                          disabled={disabledDays.includes(day)}
                        >
                          {morningSchedule.includes(day) ? 'Yes' : 'No'}
                        </ToggleButton>
                      </TableCell>
                    )
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>Afternoon</TableCell>
                  {daysOfWeek.map((day, index) => (
                    !existingSchedules.some(schedule => format(new Date(schedule.date), 'EEE dd/MM') === day) && (
                      <TableCell key={index} align="center">
                        <ToggleButton
                          selected={afternoonSchedule.includes(day)}
                          onChange={() => handleToggleAfternoon(day)}
                          value={day}
                          disabled={disabledDays.includes(day)}
                        >
                          {afternoonSchedule.includes(day) ? 'Yes' : 'No'}
                        </ToggleButton>
                      </TableCell>
                    )
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Lưu lịch làm việc
        </Button>
      </Box>
    </>
  );
};

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
          `https://localhost:7240/api/DoctorSchedule/GetAllSchedulesByDoctorId?doctorId=${selectedDoctor}`
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
      const selectedSchedules = schedules.filter(schedule => schedule.morning || schedule.afternoon);

      const response = await Promise.all(selectedSchedules.map(schedule =>
        fetch(`https://localhost:7240/api/DoctorSchedule/UpdateSchedule/${schedule.id}`, {
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
        throw new Error('Đã có lỗi xảy ra khi cập nhật lịch làm việc');
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
          Lưu lịch làm việc
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
          `https://localhost:7240/api/DoctorSchedule/GetAllSchedulesByDoctorId?doctorId=${selectedDoctor}`
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
        `https://localhost:7240/api/DoctorSchedule/DeleteSchedule/${selectedSchedule.id}`,
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
      const response = await fetch(`https://localhost:7240/api/DoctorSchedule/GetAllSchedulesByDoctorId?doctorId=${selectedDoctor}`);
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
