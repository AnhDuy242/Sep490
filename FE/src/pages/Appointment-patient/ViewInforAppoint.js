import React, { useEffect, useState } from 'react';
import { fetchAppointments, updateAppointment, fetchDoctors, fetchSlots, cancelAppointment, fetchAvailableSlots } from '../../services/AppointmentPatient';
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
    const [slots, setSlots] = useState([]); // Add state for slots
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

        if (name === 'accId' || name === 'date') {
            fetchAvailableSlotsData(); // Fetch slots whenever doctor or date is changed
        }
    };

    const fetchAvailableSlotsData = async () => {
        try {
            // Convert selected date to 'dd-MM-yyyy' format
            const formattedDate = format(new Date(selectedAppointment.date), 'dd-MM-yyyy');
            const accId = selectedAppointment.accId;
            console.log(selectedAppointment);
            if (accId && formattedDate) {
                const response = await fetch(`https://localhost:7240/api/PatientAppointment/GetListSlot?docid=${accId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ date: formattedDate }), // Use 'dd-MM-yyyy' format for Date
                });
                console.log(response);
                if (response.ok) {
                    const result = await response.json();
                    if (result && result.$values) {
                        setSlots(result.$values);
                    } else {
                        setSlots([]);
                    }
                } else {
                    console.error('Failed to fetch slots:', response.statusText);
                }
            }
        } catch (error) {
            console.error('Failed to fetch slots:', error);
        }
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
                                displayEmpty
                                inputProps={{ 'aria-label': 'Status Filter' }}
                                style={{ marginRight: '16px' }}
                            >
                                <MenuItem value="Tất cả">Tất cả</MenuItem>
                                <MenuItem value="Chưa khám">Chưa khám</MenuItem>
                                <MenuItem value="Đã khám">Đã khám</MenuItem>
                                <MenuItem value="Hủy">Hủy</MenuItem>
                            </Select>
                        </div>
                    </div>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Ngày</TableCell>
                                    <TableCell>Bác sĩ</TableCell>
                                    <TableCell>Thời gian</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredAppointments.map((appointment) => (
                                    <TableRow key={appointment.id}>
                                        <TableCell>{appointment.date}</TableCell>
                                        <TableCell>{appointment.doctorName}</TableCell>
                                        <TableCell>{appointment.time}</TableCell>
                                        <TableCell>{appointment.status}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleEditClick(appointment)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteConfirmationOpen(appointment.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Sửa cuộc hẹn</DialogTitle>
                <DialogContent>
                    {selectedAppointment && (
                        <>
                            <TextField
                                autoFocus
                                margin="dense"
                                name="date"
                                label="Ngày"
                                type="date"
                                fullWidth
                                variant="standard"
                                value={selectedAppointment.date}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                            <Select
                                name="accId"
                                value={selectedAppointment.accId || ''}
                                onChange={handleChange}
                                fullWidth
                                variant="standard"
                            >
                                {doctors.map((doctor) => (
                                    <MenuItem key={doctor.accId} value={doctor.accId}>
                                        {doctor.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Select
                                name="slotId"
                                value={selectedAppointment.slotId}
                                onChange={handleChange}
                                fullWidth
                                variant="standard"
                            >
                                {slots.map((slot) => (
                                    <MenuItem key={slot.slotId} value={slot.slotId}>
                                        {slot.time}
                                    </MenuItem>
                                ))}
                            </Select>
                        </>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleSave}>Lưu</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={deleteAppointmentId !== null}
                onClose={handleDeleteConfirmationClose}
            >
                <DialogTitle>Xác nhận</DialogTitle>
                <DialogContent>Bạn có chắc chắn muốn xóa cuộc hẹn này?</DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteConfirmationClose}>Hủy</Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Footer />
        </>
    );
};

export default GetAppointment;
