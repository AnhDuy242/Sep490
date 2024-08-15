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
import TablePagination from '@mui/material/TablePagination';
import { fetchAppointments, approveAppointment, cancelAppointment, getListDoctor } from '../../services/receptionist_management';

const AppointmentApproval = () => {
  const [appointments, setAppointments] = useState([]); // Initialize as an empty array
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getListDoctor();
        setAppointments(data.$values || []);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 10000); // 10000ms = 10 giây

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    filterAppointments(appointments);
  }, [appointments]);

  const filterAppointments = (allAppointments) => {
    const pendingAppointments = allAppointments.filter(app => app.status === 'Đang chờ phê duyệt');
    const otherAppointments = allAppointments.filter(app => app.status !== 'Đang chờ phê duyệt');
    setFilteredAppointments([...pendingAppointments, ...otherAppointments]);
  };

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
          setSnackbarMessage('Cuộc hẹn đã bị hủy thành công.');
        } else if (newStatus === 'Phê Duyệt') {
          await approveAppointment(selectedAppointment.id);
          setSnackbarMessage('Cuộc hẹn đã được phê duyệt thành công.');
        }

        const updatedAppointments = appointments.map(app =>
          app.id === selectedAppointment.id ? { ...app, status: newStatus } : app
        );
        setAppointments(updatedAppointments);
        setSnackbarSeverity('success');
      } catch (error) {
        console.error('Failed to update appointment status:', error);
        setSnackbarMessage('Có lỗi xảy ra, vui lòng thử lại.');
        setSnackbarSeverity('error');
      }
      setOpen(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAppointment(null);
    setNewStatus('');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container>
      <h1>Phê Duyệt Lịch Khám</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã cuộc hẹn</TableCell>
              <TableCell>Bệnh nhân</TableCell>
              <TableCell>Bác sĩ</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Ngày</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAppointments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.id}</TableCell>
                  <TableCell>{appointment.patientName}</TableCell>
                  <TableCell>{appointment.doctorName}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.status}</TableCell>
                  <TableCell>
                    {appointment.status === 'Đang chờ phê duyệt' && (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleStatusChangeClick(appointment, 'Phê Duyệt')}
                        >
                          Phê Duyệt
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleStatusChangeClick(appointment, 'Hủy')}
                        >
                          Hủy
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredAppointments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

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
