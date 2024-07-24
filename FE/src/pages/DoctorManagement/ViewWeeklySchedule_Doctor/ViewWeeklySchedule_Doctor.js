import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameWeek } from 'date-fns';
import { fetchSchedulesByDoctorId } from '../../../services/doctor_service';

const EditSchedule = ({ setSnackbar }) => {
    const [schedules, setSchedules] = useState([]);
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const doctorId = localStorage.getItem('accountId'); // Get doctorId from localStorage
  
    useEffect(() => {
      if (!doctorId) return;
  
      const fetchSchedules = async () => {
        try {
          const data = await fetchSchedulesByDoctorId(doctorId);
          const filteredSchedules = data.$values.filter((schedule) =>
            isSameWeek(new Date(schedule.date), currentWeek, { weekStartsOn: 1 })
          );
          setSchedules(filteredSchedules);
        } catch (error) {
          setSnackbar({ open: true, message: error.message, severity: 'error' });
        }
      };
  
      fetchSchedules();
    }, [doctorId, currentWeek, setSnackbar]);
  
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
        {doctorId && (
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
                          <Typography>
                            {schedules.find(schedule => format(new Date(schedule.date), 'EEE dd/MM') === day)?.appointments || 0}
                          </Typography>
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
                          <Typography>
                            {schedules.find(schedule => format(new Date(schedule.date), 'EEE dd/MM') === day)?.appointments || 0}
                          </Typography>
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
      </>
    );
  };
  
  export default EditSchedule;