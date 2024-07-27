import React, { useEffect, useState } from 'react';
import { fetchAppointments, updateAppointment, fetchDoctors, fetchSlots, cancelAppointment } from '../../services/AppointmentPatient';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, Button, Snackbar } from '@mui/material';
import './../../assets/css/GetAppointment.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from '../../layouts/Header';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import { format, parse, compareDesc } from 'date-fns';
import Alert from '@mui/material/Alert'; // Import Alert component
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const GetAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [open, setOpen] = useState(false);
    const [slot, setSlot] = useState([]);
    const [deleteAppointmentId, setDeleteAppointmentId] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Default to success (green)
    const [statusFilter, setStatusFilter] = useState('Tất cả'); // Default filter to "All"

    useEffect(() => {
        const accountId = localStorage.getItem('accountId');
        if (accountId) {
            fetchAppointments(accountId)
                .then(data => {
                    if (data && data.$values) {
                        const sortedAppointments = data.$values.sort((a, b) => {
                            const dateA = parse(a.date, 'dd-MM-yyyy', new Date());
                            const dateB = parse(b.date, 'dd-MM-yyyy', new Date());
                            return compareDesc(dateA, dateB);
                        });
                        setAppointments(sortedAppointments);
                        setFilteredAppointments(sortedAppointments); // Initialize with all appointments
                    } else {
                        setAppointments([]);
                        setFilteredAppointments([]);
                    }
                })
                .catch(error => {
                    console.error('Failed to fetch appointments:', error);
                });
        }

        fetchDoctors()
            .then(data => {
                setDoctors(data.$values);
            })
            .catch(error => {
                console.error('Failed to fetch doctors:', error);
            });

        fetchSlots()
            .then(data => {
                setSlot(data.$values);
            })
            .catch(error => {
                console.error('Failed to fetch slots:', error);
            });
    }, []);

    useEffect(() => {
        if (statusFilter === 'Tất cả') {
            setFilteredAppointments(appointments);
        } else {
            setFilteredAppointments(appointments.filter(app => app.status === statusFilter));
        }
    }, [statusFilter, appointments]);

    const formatDate = (dateString) => {
        try {
            const parsedDate = parse(dateString, 'dd-MM-yyyy', new Date());
            return format(parsedDate, 'yyyy-MM-dd'); // Format to ISO 8601 for input type date
        } catch (error) {
            console.error('Failed to parse date:', error);
            return '';
        }
    };

    const handleEditClick = (appointment) => {
        setSelectedAppointment({
            ...appointment,
            date: formatDate(appointment.date) // Convert date to ISO 8601 for input type date
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedAppointment(null);
    };

    const handleSave = async () => {
        if (selectedAppointment) {
            try {
                const updatedAppointment = {
                    ...selectedAppointment,
                    date: format(parse(selectedAppointment.date, 'yyyy-MM-dd', new Date()), 'dd-MM-yyyy') // Convert back to dd-MM-yyyy for saving
                };
                await updateAppointment(updatedAppointment.id, updatedAppointment);
                const accountId = localStorage.getItem('accountId');
                if (accountId) {
                    fetchAppointments(accountId)
                        .then(data => {
                            if (data && data.$values) {
                                const sortedAppointments = data.$values.sort((a, b) => {
                                    const dateA = parse(a.date, 'dd-MM-yyyy', new Date());
                                    const dateB = parse(b.date, 'dd-MM-yyyy', new Date());
                                    return compareDesc(dateA, dateB);
                                });
                                setAppointments(sortedAppointments);
                                setFilteredAppointments(sortedAppointments);
                            } else {
                                setAppointments([]);
                                setFilteredAppointments([]);
                            }
                        })
                        .catch(error => {
                            console.error('Failed to fetch updated appointments:', error);
                        });
                }
                handleClose();
            } catch (error) {
                console.error('Failed to update appointment:', error);
            }
        }
    };

    const handleDeleteClick = async (appointmentId) => {
        try {
            setDeleteAppointmentId(appointmentId); // Set the appointment ID to delete
        } catch (error) {
            console.error('Failed to delete appointment:', error);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await cancelAppointment(deleteAppointmentId);
            setDeleteAppointmentId(null); // Reset delete appointment ID after deletion
            const accountId = localStorage.getItem('accountId');
            if (accountId) {
                fetchAppointments(accountId)
                    .then(data => {
                        if (data && data.$values) {
                            const sortedAppointments = data.$values.sort((a, b) => {
                                const dateA = parse(a.date, 'dd-MM-yyyy', new Date());
                                const dateB = parse(b.date, 'dd-MM-yyyy', new Date());
                                return compareDesc(dateA, dateB);
                            });
                            setAppointments(sortedAppointments);
                            setFilteredAppointments(sortedAppointments);
                        } else {
                            setAppointments([]);
                            setFilteredAppointments([]);
                        }
                    })
                    .catch(error => {
                        console.error('Failed to fetch updated appointments:', error);
                    });
            }
            handleSnackbarOpen('Xóa cuộc hẹn thành công', 'success');
        } catch (error) {
            console.error('Failed to cancel appointment:', error);
            handleSnackbarOpen('Xóa cuộc hẹn thất bại', 'error');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedAppointment({ ...selectedAppointment, [name]: value });
    };

    const handleDeleteConfirmationOpen = (appointmentId) => {
        setDeleteAppointmentId(appointmentId);
    };

    const handleDeleteConfirmationClose = () => {
        setDeleteAppointmentId(null);
    };

    const handleSnackbarOpen = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };

    return (
        <>
            <Helmet>
                <title>
                    Xem lịch thăm khám
                </title>
            </Helmet>
            <Header />
            <Navbar />
            <div className="appointment-list-container">
                <div className="appointment-list-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2>Danh sách cuộc hẹn</h2>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                                component={Link}
                                to="/CreateAppointment"
                                variant="contained"
                                sx={{ backgroundColor: '#6495ED', color: 'white', '&:hover': { backgroundColor: '#0099FF' } }}
                                style={{ marginRight: '16px' }}
                            >
                                Đặt lịch khám
                            </Button>
                            <Select
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                                sx={{ 
                                    width: '200px', // Thay đổi chiều ngang
                                    height: '40px', // Thay đổi chiều cao
                                    '& .MuiSelect-select': {
                                        height: '40px', // Đảm bảo chiều cao của phần tử chọn
                                        display: 'flex',
                                        alignItems: 'center', // Căn giữa chữ theo chiều dọc
                                        justifyContent: 'left', // Căn giữa chữ theo chiều ngang
                                        padding: '10px', // Thay đổi khoảng cách bên trong
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderRadius: '4px', // Thay đổi đường viền
                                    },
                                }}
                            >
                                <MenuItem value="Tất cả">Tất cả</MenuItem>
                                <MenuItem value="Đã phê duyệt">Đã phê duyệt</MenuItem>
                                <MenuItem value="Đang chờ phê duyệt">Đang chờ phê duyệt</MenuItem>
                                <MenuItem value="Đã hủy">Đã hủy</MenuItem>
                                <MenuItem value="Tái khám">Tái khám</MenuItem>
                                <MenuItem value="Đã khám">Đã khám</MenuItem>
                            </Select>
                        </div>
                    </div>
                </div>
                <TableContainer component={Paper}>
                    <Table className="appointment-table" aria-label="Danh sách cuộc hẹn">
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Thời gian</strong></TableCell>
                                <TableCell><strong>Ngày</strong></TableCell>
                                <TableCell><strong>Bác sĩ</strong></TableCell>
                                <TableCell><strong>Dịch vụ</strong></TableCell>
                                <TableCell><strong>Trạng thái</strong></TableCell>
                                <TableCell><strong>Ghi chú</strong></TableCell>
                                <TableCell><strong>Hành động</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredAppointments.length > 0 ? (
                                filteredAppointments
                                    .map(appointment => (
                                        <TableRow key={appointment.id}>
                                            <TableCell>{appointment.time}</TableCell>
                                            <TableCell>{appointment.date}</TableCell>
                                            <TableCell>{appointment.doctorName}</TableCell>
                                            <TableCell>{appointment.serviceName}</TableCell>
                                            <TableCell>{appointment.status}</TableCell>
                                            <TableCell>{appointment.note}</TableCell>
                                            <TableCell>
                                                <IconButton title="Chỉnh sửa" color="primary" onClick={() => handleEditClick(appointment)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton title="Xóa lịch hẹn" sx={{ color: '#ff0000' }} onClick={() => handleDeleteConfirmationOpen(appointment.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7}>Không có cuộc hẹn nào.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {selectedAppointment && (
                    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                        <DialogTitle>Chỉnh sửa cuộc hẹn</DialogTitle>
                        <DialogContent>
                            <TextField
                                margin="dense"
                                name="date"
                                label="Ngày"
                                type="date"
                                fullWidth
                                value={selectedAppointment.date}
                                onChange={handleChange}
                            />
                            <Select
                                margin="dense"
                                name="doctorId"
                                labelId="doctor-select-label"
                                id="doctor-select"
                                fullWidth
                                value={selectedAppointment.doctorId || ''}
                                onChange={handleChange}
                            >
                                {doctors.map(doctor => (
                                    <MenuItem key={doctor.accId} value={doctor.accId}>{doctor.name}</MenuItem>
                                ))}
                            </Select>
                            <Select
                                margin="dense"
                                name="slotId"
                                labelId="slot-select-label"
                                id="slot-select"
                                fullWidth
                                value={selectedAppointment.slotId || ''}
                                onChange={handleChange}
                            >
                                {slot.map(slot => (
                                    <MenuItem key={slot.slotId} value={slot.slotId}>{slot.time}</MenuItem>
                                ))}
                            </Select>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">Hủy</Button>
                            <Button onClick={handleSave} color="primary">Lưu</Button>
                        </DialogActions>
                    </Dialog>
                )}
                <Dialog
                    open={!!deleteAppointmentId}
                    onClose={handleDeleteConfirmationClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Xác nhận xóa cuộc hẹn</DialogTitle>
                    <DialogActions>
                        <Button onClick={handleDeleteConfirmationClose} color="primary">
                            Hủy
                        </Button>
                        <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                            Đồng ý
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    open={snackbarOpen}
                    autoHideDuration={3000} // 3 seconds
                    onClose={handleSnackbarClose}
                >
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </div>
            <Footer />
        </>
    );
};

export default GetAppointment;