import React, { useEffect, useState } from 'react';
import { fetchAppointments } from '../../services/AppointmentPatient';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import './../../assets/css/GetAppointment.css'; // Import file CSS để tạo kiểu bảng
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
const GetAppointment = () => {
    const [appointments, setAppointments] = useState([]);

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
    }, []);

    return (
        <div className="appointment-list-container">
            <h2>Danh sách cuộc hẹn</h2>
            <TableContainer component={Paper}>
                <Table className="appointment-table" aria-label="Danh sách cuộc hẹn">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Tên bệnh nhân</strong></TableCell>
                            <TableCell><strong>Thời gian</strong></TableCell>
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
                                    <TableCell>{appointment.doctorName}</TableCell>
                                    <TableCell>{appointment.status}</TableCell>
                                    <TableCell>{appointment.note}</TableCell>
                                    <TableCell>
                                        <IconButton title="Chỉnh sửa" color="primary" >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton title="Chi tiết" sx={{ color: '#ff5722' }}>
                                            <InfoIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5}>Không có cuộc hẹn nào.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default GetAppointment;
