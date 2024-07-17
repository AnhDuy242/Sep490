// import React, { useEffect, useState } from 'react';
// import { fetchAppointments, updateAppointment, fetchDoctors, fetchSlots } from '../../services/AppointmentPatient';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, Button } from '@mui/material';
// import './../../assets/css/GetAppointment.css';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import Header from '../../layouts/Header';
// import Navbar from '../../layouts/Navbar';
// import Footer from '../../layouts/Footer';
// import { format, parse } from 'date-fns';

// const GetAppointment = () => {
//     const [appointments, setAppointments] = useState([]);
//     const [selectedAppointment, setSelectedAppointment] = useState(null);
//     const [doctors, setDoctors] = useState([]);
//     const [open, setOpen] = useState(false);
//     const [slot, setSlot] = useState([]);

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

//         fetchDoctors()
//             .then(data => {
//                 setDoctors(data.$values);
//             })
//             .catch(error => {
//                 console.error('Failed to fetch doctors:', error);
//             });

//         fetchSlots()
//             .then(data => {
//                 setSlot(data.$values);
//             })
//             .catch(error => {
//                 console.error('Failed to fetch slots:', error);
//             });
//     }, []);

//     const formatDate = (dateString) => {
//         try {
//             const parsedDate = parse(dateString, 'dd-MM-yyyy', new Date());
//             return format(parsedDate, 'yyyy-MM-dd'); // Format to ISO 8601 for input type date
//         } catch (error) {
//             console.error('Failed to parse date:', error);
//             return '';
//         }
//     };

//     const handleEditClick = (appointment) => {
//         setSelectedAppointment({
//             ...appointment,
//             date: formatDate(appointment.date) // Convert date to ISO 8601 for input type date
//         });
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setOpen(false);
//         setSelectedAppointment(null);
//     };

//     const handleSave = async () => {
//         if (selectedAppointment) {
//             try {
//                 const updatedAppointment = {
//                     ...selectedAppointment,
//                     date: format(parse(selectedAppointment.date, 'yyyy-MM-dd', new Date()), 'dd-MM-yyyy') // Convert back to dd-MM-yyyy for saving
//                 };
//                 await updateAppointment(updatedAppointment.id, updatedAppointment);
//                 const accountId = localStorage.getItem('accountId');
//                 if (accountId) {
//                     fetchAppointments(accountId)
//                         .then(data => {
//                             if (data && data.$values) {
//                                 setAppointments(data.$values);
//                             } else {
//                                 setAppointments([]);
//                             }
//                         })
//                         .catch(error => {
//                             console.error('Failed to fetch updated appointments:', error);
//                         });
//                 }
//                 handleClose();
//             } catch (error) {
//                 console.error('Failed to update appointment:', error);
//             }
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setSelectedAppointment({ ...selectedAppointment, [name]: value });
//     };

//     return (
//         <>
//             <Header />
//             <Navbar />
//             <div className="appointment-list-container">
//                 <h2>Danh sách cuộc hẹn</h2>
//                 <TableContainer component={Paper}>
//                     <Table className="appointment-table" aria-label="Danh sách cuộc hẹn">
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell><strong>Tên bệnh nhân</strong></TableCell>
//                                 <TableCell><strong>Thời gian</strong></TableCell>
//                                 <TableCell><strong>Ngày</strong></TableCell>
//                                 <TableCell><strong>Bác sĩ</strong></TableCell>
//                                 <TableCell><strong>Trạng thái</strong></TableCell>
//                                 <TableCell><strong>Ghi chú</strong></TableCell>
//                                 <TableCell><strong>Hành động</strong></TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {appointments.length > 0 ? (
//                                 appointments.map(appointment => (
//                                     <TableRow key={appointment.id}>
//                                         <TableCell>{appointment.patientName}</TableCell>
//                                         <TableCell>{appointment.time}</TableCell>
//                                         <TableCell>{appointment.date}</TableCell>
//                                         <TableCell>{appointment.doctorName}</TableCell>
//                                         <TableCell>{appointment.status}</TableCell>
//                                         <TableCell>{appointment.note}</TableCell>
//                                         <TableCell>
//                                             <IconButton title="Chỉnh sửa" color="primary" onClick={() => handleEditClick(appointment)}>
//                                                 <EditIcon />
//                                             </IconButton>
//                                             <IconButton title="Xóa lịch hẹn" sx={{ color: '#ff0000' }}>
//                                                 <DeleteIcon />
//                                             </IconButton>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))
//                             ) : (
//                                 <TableRow>
//                                     <TableCell colSpan={7}>Không có cuộc hẹn nào.</TableCell>
//                                 </TableRow>
//                             )}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//                 {selectedAppointment && (
//                     <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//                         <DialogTitle>Chỉnh sửa cuộc hẹn</DialogTitle>
//                         <DialogContent>
//                             <TextField
//                                 margin="dense"
//                                 name="date"
//                                 label="Ngày"
//                                 type="date"
//                                 fullWidth
//                                 value={selectedAppointment.date}
//                                 onChange={handleChange}
//                             />
//                             <Select
//                                 margin="dense"
//                                 name="doctorId"
//                                 labelId="doctor-select-label"
//                                 id="doctor-select"
//                                 fullWidth
//                                 value={selectedAppointment.doctorId || ''}
//                                 onChange={handleChange}
//                             >
//                                 {doctors.map(doctor => (
//                                     <MenuItem key={doctor.accId} value={doctor.accId}>{doctor.name}</MenuItem>
//                                 ))}
//                             </Select>
//                             <Select
//                                 margin="dense"
//                                 name="slotId"
//                                 labelId="slot-select-label"
//                                 id="slot-select"
//                                 fullWidth
//                                 value={selectedAppointment.slotId || ''}
//                                 onChange={handleChange}
//                             >
//                                 {slot.map(slot => (
//                                     <MenuItem key={slot.slotId} value={slot.slotId}>{slot.time}</MenuItem>
//                                 ))}
//                             </Select>
//                         </DialogContent>
//                         <DialogActions>
//                             <Button onClick={handleClose} color="primary">Hủy</Button>
//                             <Button onClick={handleSave} color="primary">Lưu</Button>
//                         </DialogActions>
//                     </Dialog>
//                 )}
//             </div>
//             <Footer />
//         </>
//     );
// };

// export default GetAppointment;



import React, { useEffect, useState } from 'react';
import { fetchAppointments, updateAppointment, fetchDoctors, fetchSlots } from '../../services/AppointmentPatient';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, Button } from '@mui/material';
import './../../assets/css/GetAppointment.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from '../../layouts/Header';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import { format, parse, compareDesc } from 'date-fns';

const GetAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [open, setOpen] = useState(false);
    const [slot, setSlot] = useState([]);

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

        fetchSlots()
            .then(data => {
                setSlot(data.$values);
            })
            .catch(error => {
                console.error('Failed to fetch slots:', error);
            });
    }, []);

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
            </div>
            <Footer />
        </>
    );
};

export default GetAppointment;
