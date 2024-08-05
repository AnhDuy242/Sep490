import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Grid, Divider, Snackbar, Alert, CircularProgress, TextField } from '@mui/material';
import axios from 'axios';

// Function to convert yyyy-MM-dd to dd-MM-yyyy
const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
};

const AppointmentsDoctor = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [searchDate, setSearchDate] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            const pid = localStorage.getItem('accountId'); // Fetch pid from local storage
            if (!pid) {
                setSnackbarMessage('Không tìm thấy ID bệnh nhân.');
                setSnackbarOpen(true);
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`https://localhost:7240/api/PatientAppointment/GetAppointmentForDoctor?did=${pid}`);
                setAppointments(response.data.$values);
                setFilteredAppointments(response.data.$values);
                setLoading(false);
            } catch (error) {
                setSnackbarMessage('Lỗi khi tải cuộc hẹn.');
                setSnackbarOpen(true);
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    useEffect(() => {
        if (searchDate) {
            const formattedSearchDate = formatDate(searchDate); // Convert to dd-MM-yyyy
            const filtered = appointments.filter(appointment => appointment.date === formattedSearchDate);
            setFilteredAppointments(filtered);
        } else {
            setFilteredAppointments(appointments);
        }
    }, [searchDate, appointments]);

    const groupAppointmentsByDate = () => {
        return filteredAppointments.reduce((acc, appointment) => {
            const date = appointment.date;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(appointment);
            return acc;
        }, {});
    };

    const groupedAppointments = groupAppointmentsByDate();

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Danh sách cuộc hẹn
            </Typography>

            <TextField
                label="Tìm kiếm theo ngày (yyyy-MM-dd)"
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
                style={{ marginBottom: 20 }}
                onChange={(e) => setSearchDate(e.target.value)}
            />

            {loading ? (
                <CircularProgress />
            ) : (
                Object.keys(groupedAppointments).map(date => (
                    <div key={date}>
                        <Typography variant="h6" gutterBottom>
                            Ngày: {new Date(date).toLocaleDateString()}
                        </Typography>
                        <Grid container spacing={2}>
                            {groupedAppointments[date].map(appointment => (
                                <Grid item xs={12} sm={6} md={4} key={appointment.id}>
                                    <Card variant="outlined" style={{ marginBottom: 10 }}>
                                        <CardContent>
                                            <Typography variant="h6">Dịch vụ: {appointment.serviceName}</Typography>
                                            <Typography variant="body2">Bác sĩ: {appointment.doctorName}</Typography>
                                            <Typography variant="body2">Bệnh nhân: {appointment.patientName}</Typography>
                                            <Typography variant="body2">Giờ: {appointment.time}</Typography>
                                            <Typography variant="body2">Trạng thái: {appointment.status}</Typography>
                                            <Typography variant="body2">Ghi chú: {appointment.note || 'Không có'}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <Divider style={{ margin: '20px 0' }} />
                    </div>
                ))
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="error">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AppointmentsDoctor;
