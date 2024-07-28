import React, { useEffect, useState } from 'react';
import { fetchAllAppointments, setNotificationTime } from '../../services/AdminManagerment';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';

const AdminViewAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [open, setOpen] = useState(false);
    const [reminderTime, setReminderTime] = useState('');

    useEffect(() => {
        const getAppointments = async () => {
            const data = await fetchAllAppointments();
            if (data && data.$values) {
                setAppointments(data.$values);
            }
        };

        getAppointments();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setReminderTime(''); 
    };

    const handleSetReminder = async () => {
        const result = await setNotificationTime(reminderTime);
        if (result) {
            console.log('Thời gian nhắc lịch đã được cài đặt');
        }
        setOpen(false);
    };

    return (
        <>
            <Button variant="contained" color="primary" style={{ marginBottom: '16px' }} onClick={handleClickOpen}>
                Nhắc lịch
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Đặt thời gian nhắc lịch</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Thời gian nhắc lịch"
                        type="text"
                        fullWidth
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleSetReminder} color="primary">
                        Đặt
                    </Button>
                </DialogActions>
            </Dialog>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Tên bệnh nhân</TableCell>
                            <TableCell>Tên bác sĩ</TableCell>
                            <TableCell>Ngày</TableCell>
                            <TableCell>Thời gian</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Ghi chú</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appointments.map((appointment) => (
                            <TableRow key={appointment.id}>
                                <TableCell>{appointment.id}</TableCell>
                                <TableCell>{appointment.patientName}</TableCell>
                                <TableCell>{appointment.doctorName}</TableCell>
                                <TableCell>{appointment.date}</TableCell>
                                <TableCell>{appointment.time}</TableCell>
                                <TableCell>{appointment.status}</TableCell>
                                <TableCell>{appointment.note || 'Không có'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default AdminViewAppointment;
