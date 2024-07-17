import React, { useEffect, useState } from 'react';
import { fetchAppointments, updateAppointment, fetchDoctors } from '../../services/AppointmentPatient';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, Button } from '@mui/material';
import './../../assets/css/GetAppointment.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from '../../layouts/Header';
import Navbar from '../../layouts/Navbar'
import Footer from '../../layouts/Footer'

const GetAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const accountId = localStorage.getItem('accountId');
        if (accountId) {
            fetchAppointments(accountId)
                .then(data => {
                    if (data && data.$values) {
                        setAppointments(data.$values);
                    } else {
                        setAppointments([]);
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

    const handleEditClick = (appointment) => {
        setSelectedAppointment(appointment);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedAppointment(null);
    };

    const handleSave = async () => {
        if (selectedAppointment) {
            try {
                await updateAppointment(selectedAppointment.id, selectedAppointment);
                // Gọi lại API để lấy danh sách cuộc hẹn cập nhật
                const accountId = localStorage.getItem('accountId');
                if (accountId) {
                    fetchAppointments(accountId)
                        .then(data => {
                            if (data && data.$values) {
                                setAppointments(data.$values);
                            } else {
                                setAppointments([]);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedAppointment({ ...selectedAppointment, [name]: value });
    };

    return (
        <>
            <Header />
            <Navbar />
            <div className="appointment-list-container">
                <h2>Danh sách cuộc hẹn</h2>
                <TableContainer component={Paper}>
                    <Table className="appointment-table" aria-label="Danh sách cuộc hẹn">
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Tên bệnh nhân</strong></TableCell>
                                <TableCell><strong>Thời gian</strong></TableCell>
                                <TableCell><strong>Ngày</strong></TableCell>
                                <TableCell><strong>Bác sĩ</strong></TableCell>
                                <TableCell><strong>Trạng thái</strong></TableCell>
                                <TableCell><strong>Ghi chú</strong></TableCell>
                                <TableCell><strong>Hành động</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appointments.length > 0 ? (
                                appointments.map(appointment => (
                                    <TableRow key={appointment.id}>
                                        <TableCell>{appointment.patientName}</TableCell>
                                        <TableCell>{appointment.time}</TableCell>
                                        <TableCell>{appointment.date}</TableCell>
                                        <TableCell>{appointment.doctorName}</TableCell>
                                        <TableCell>{appointment.status}</TableCell>
                                        <TableCell>{appointment.note}</TableCell>
                                        <TableCell>
                                            <IconButton title="Chỉnh sửa" color="primary" onClick={() => handleEditClick(appointment)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton title="Xóa lịch hẹn" sx={{ color: '#ff0000' }}>
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
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">Hủy</Button>
                            <Button onClick={handleSave} color="primary">Lưu</Button>
                        </DialogActions>
                    </Dialog>
                )}
            </div>
            <Footer />
        </>

    );
};

export default GetAppointment;