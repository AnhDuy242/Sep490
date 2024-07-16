// import React, { useEffect, useState } from 'react';
// import { fetchAppointments } from '../../services/AppointmentPatient';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
// import './../../assets/css/GetAppointment.css'; // Import file CSS để tạo kiểu bảng
// import InfoIcon from '@mui/icons-material/Info';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import Footer from '../../layouts/Footer'
// import Header from '../../layouts/Header'
// import NavBar from '../../layouts/Navbar'

// const GetAppointment = () => {
//     const [appointments, setAppointments] = useState([]);

//     useEffect(() => {
//         const accountId = localStorage.getItem('accountId');

//         if (accountId) {
//             fetchAppointments(accountId)
//                 .then(data => {
//                     if (data && data.$values) {
//                         setAppointments(data.$values);
//                     } else {
//                         setAppointments([]);
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Failed to fetch appointments:', error);
//                 });
//         }
//     }, []);

//     return (
//         <div className="appointment-list-container">
//             <h2>Danh sách cuộc hẹn</h2>
//             <TableContainer component={Paper}>
//                 <Table className="appointment-table" aria-label="Danh sách cuộc hẹn">
//                     <TableHead>
//                         <TableRow>
//                             <TableCell><strong>Tên bệnh nhân</strong></TableCell>
//                             <TableCell><strong>Thời gian</strong></TableCell>
//                             <TableCell><strong>Bác sĩ</strong></TableCell>
//                             <TableCell><strong>Trạng thái</strong></TableCell>
//                             <TableCell><strong>Ghi chú</strong></TableCell>
//                             <TableCell><strong>Hành động</strong></TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {appointments.length > 0 ? (
//                             appointments.map(appointment => (
//                                 <TableRow key={appointment.id}>
//                                     <TableCell>{appointment.patientName}</TableCell>
//                                     <TableCell>{appointment.time}</TableCell>
//                                     <TableCell>{appointment.doctorName}</TableCell>
//                                     <TableCell>{appointment.status}</TableCell>
//                                     <TableCell>{appointment.note}</TableCell>
//                                     <TableCell>
//                                         <IconButton title="Chỉnh sửa" color="primary" >
//                                             <EditIcon />
//                                         </IconButton>
//                                         <IconButton title="Xóa lịch hẹn" sx={{ color: '#ff0000' }}>
//                                             <DeleteIcon  />
//                                         </IconButton>
//                                     </TableCell>
//                                 </TableRow>
//                             ))
//                         ) : (
//                             <TableRow>
//                                 <TableCell colSpan={5}>Không có cuộc hẹn nào.</TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         </div>
//     );
// };

// export default GetAppointment;


import React, { useEffect, useState } from 'react';
import { fetchAppointments } from '../../services/AppointmentPatient';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import './../../assets/css/GetAppointment.css'; // Import file CSS để tạo kiểu bảng
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Footer from '../../layouts/Footer'
import Header from '../../layouts/Header'
import NavBar from '../../layouts/Navbar'
import { updateAppointment } from '../../services/AppointmentPatient';

const GetAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [editAppointment, setEditAppointment] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);

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

    const handleEditClick = (appointment) => {
        setEditAppointment(appointment);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };

    const handleSaveEdit = async () => {
        try {
            const updatedData = await updateAppointment(editAppointment.id, {
                date: editAppointment.date // Chỉ cập nhật trường date
            });
            console.log('Updated appointment:', updatedData);
            // Cập nhật lại danh sách cuộc hẹn nếu cần
            const updatedAppointments = appointments.map(appointment =>
                appointment.id === updatedData.id ? updatedData : appointment
            );
            setAppointments(updatedAppointments);
            setOpenEditDialog(false); // Đóng dialog sau khi lưu
        } catch (error) {
            console.error('Error updating appointment:', error);
            // Xử lý trạng thái lỗi hoặc hiển thị thông báo lỗi
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditAppointment({
            ...editAppointment,
            [name]: value
        });
    };

    return (
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
                                            <DeleteIcon  />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6}>Không có cuộc hẹn nào.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for editing appointment */}
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Chỉnh sửa lịch hẹn</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="date"
                        name="date"
                        label="Ngày"
                        type="date"
                        fullWidth
                        value={editAppointment ? editAppointment.date : ''}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        id="doctorId"
                        name="doctorId"
                        select
                        label="Bác sĩ"
                        fullWidth
                        value={editAppointment ? editAppointment.doctorId : ''}
                        onChange={handleInputChange}
                    >
                        {/* Replace with actual list of doctors */}
                        <MenuItem value={1}>Doctor 1</MenuItem>
                        <MenuItem value={2}>Doctor 2</MenuItem>
                        <MenuItem value={3}>Doctor 3</MenuItem>
                    </TextField>
                    {/* Add other fields for editing */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog} color="primary">
                        Hủy bỏ
                    </Button>
                    <Button onClick={handleSaveEdit} color="primary">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default GetAppointment;
