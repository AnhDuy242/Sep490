import React from 'react';
import {
  Container, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from '@mui/material';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = [
  '8:00 - 9:00 AM',
  '9:00 - 10:00 AM',
  '10:00 - 11:00 AM',
  '11:00 - 12:00 PM',
  '12:00 - 1:00 PM',
  '1:00 - 2:00 PM',
  '2:00 - 3:00 PM',
  '3:00 - 4:00 PM',
  '4:00 - 5:00 PM'
];

const Timetable = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Weekly Timetable
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {daysOfWeek.map((day) => (
                <TableCell key={day} align="center">{day}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {timeSlots.map((slot) => (
              <TableRow key={slot}>
                <TableCell component="th" scope="row">
                  {slot}
                </TableCell>
                {daysOfWeek.map((day) => (
                  <TableCell key={day} align="center">
                    {/* Add your class or activity here */}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Timetable;
