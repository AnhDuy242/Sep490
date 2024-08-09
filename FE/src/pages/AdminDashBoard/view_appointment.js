import React, { useEffect, useState } from 'react';
import { fetchAllAppointments, setNotificationTime, getNotificationTime } from '../../services/AdminManagerment'; // Thêm hàm getNotificationTime
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
    Box,
    Typography,
    Snackbar,
    Alert
} from '@mui/material';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import './component/view_appointment.css';  // Đảm bảo bạn đã thêm CSS vào đây

const AdminViewAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [open, setOpen] = useState(false);
    const [reminderTime, setReminderTime] = useState(new Date());
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [currentReminderTime,setCurrentReminderTime]= useState(new Date());;
    useEffect(() => {
        const getAppointments = async () => {
            const data = await fetchAllAppointments();
            if (data && data.$values) {
                setAppointments(data.$values);
            }
        };

        const fetchNotificationTime = async () => {
            const response = await getNotificationTime();
            if (response && response.time) {
                const [hours, minutes] = response.time.split(':');
                const date = new Date();
                date.setHours(parseInt(hours, 10));
                date.setMinutes(parseInt(minutes, 10));
                setCurrentReminderTime(date);
            }
        };

        getAppointments();
        fetchNotificationTime();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSetReminder = async () => {
        try {
            const formattedTime = format(reminderTime, 'HH:mm');
            const response = await setNotificationTime(formattedTime);
    
         
                setSnackbarOpen(true); // Hiển thị Snackbar thông báo thành công
                // Fetch the updated notification time
                const updatedResponse = await getNotificationTime();
                if (updatedResponse && updatedResponse.time) {
                    const [hours, minutes] = updatedResponse.time.split(':');
                    const date = new Date();
                    date.setHours(parseInt(hours, 10));
                    date.setMinutes(parseInt(minutes, 10));
                    setCurrentReminderTime(date);
                    setSnackbarOpen(true);
                }

            
        } catch (error) {
            console.error('Error setting reminder:', error);
        }
        setOpen(false);
    };
    
    

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            <Box display="flex" alignItems="center" marginBottom="16px">
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Chỉnh sửa thời gian nhắc lịch
                </Button>
                <Typography variant="h6" style={{ marginLeft: '16px' }}>
                    Thời gian nhắc lịch hiện tại: {format(currentReminderTime, 'HH:mm')}
                </Typography>
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Đặt thời gian nhắc lịch</DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="h6" gutterBottom>
                                Chọn thời gian
                            </Typography>
                            <StaticTimePicker
                                orientation="portrait"
                                value={reminderTime}
                                onChange={(newValue) => setReminderTime(newValue)}
                                ampm={false}
                                renderInput={(params) => <input {...params} />}
                                className="hide-picker-buttons"
                            />
                            <Typography variant="body2" color="textSecondary" mt={2}>
                                Thời gian đã chọn: {format(reminderTime, 'HH:mm')} ({format(reminderTime, 'hh:mm a')})
                            </Typography>
                        </Box>
                    </LocalizationProvider>
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
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    Thời gian nhắc lịch đã được cài đặt
                </Alert>
            </Snackbar>
        </>
    );
};

export default AdminViewAppointment;
