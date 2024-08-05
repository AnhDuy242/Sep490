import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';
import { fetchAppointments, approveAppointment, cancelAppointment, getListDoctor } from '../../services/receptionist_management'; // Adjust the import path according to your project structure

const AppointmentApproval = () => {
  const [appointments, setAppointments] = useState([]); // Initialize as an empty array
  const [open, setOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    getListDoctor()
      .then(data => {
        setAppointments(data.$values || []);
      })
      .catch(error => {
        console.error('Failed to fetch appointments:', error);
      });
  }, []);

  const handleStatusChangeClick = (appointment, status) => {
    setSelectedAppointment(appointment);
    setNewStatus(status);
    setOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (selectedAppointment) {
      try {
        if (newStatus === 'Hủy') {
          await cancelAppointment(selectedAppointment.id);
        } else if (newStatus === 'Phê Duyệt') {
          await approveAppointment(selectedAppointment.id);
        }

        const updatedAppointments = appointments.map(app =>
          app.id === selectedAppointment.id ? { ...app, status: newStatus } : app
        );
        setAppointments(updatedAppointments);
        console.log('Appointment status updated successfully');
      } catch (error) {
        console.error('Failed to update appointment status:', error);
      }
      setOpen(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAppointment(null);
    setNewStatus('');
  };

  return (
    <Container>
      <h1>Phê Duyệt Lịch Khám</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Appointment ID</TableCell>
              <TableCell>Patient ID</TableCell>
              <TableCell>Doctor ID</TableCell>
              <TableCell>Slot ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.id}</TableCell>
                <TableCell>{appointment.patientName}</TableCell>
                <TableCell>{appointment.doctorName}</TableCell>
                <TableCell>{appointment.time}</TableCell>
                <TableCell>{appointment.date}</TableCell>

                <TableCell>{appointment.status}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color={appointment.status === 'Đã Phê Duyệt' ? 'secondary' : 'primary'}
                    onClick={() => handleStatusChangeClick(appointment, 'Phê Duyệt')}
                    disabled={appointment.status === 'Phê Duyệt'}
                  >
                    Phê Duyệt
                  </Button>
                  <Button
                    variant="contained"
                    color={appointment.status === 'Đã Hủy' ? 'secondary' : 'primary'}
                    onClick={() => handleStatusChangeClick(appointment, 'Hủy')}
                    disabled={appointment.status === 'Hủy'}
                  >
                    Hủy
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Xác nhận thay đổi</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có muốn thay đổi trạng thái của lịch khám này không? {newStatus}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmStatusChange} color="primary">
            Xác Nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AppointmentApproval;
