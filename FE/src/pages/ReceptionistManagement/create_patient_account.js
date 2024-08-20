import React, { useState, useEffect, useRef } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, MenuItem, FormControl, InputLabel, Select, TablePagination, Autocomplete, Grid,
    Snackbar,
    Alert,
    Box,
    Input,
    InputAdornment,
    IconButton
} from '@mui/material';
import { createPatient, getAllPatients, updatePatientStatus } from './../../services/receptionist_management'; // Import hàm updatePatientStatus
import AddIcon from '@mui/icons-material/Add';
import { bookAppointment, getListDepartment, fetchDoctors, fetchSlots, fetchServices, fetchDoctorByService, fetchSlotsByDoctorAndDate, fetchDateByDoctor, ReceptionbookAppointment } from '../../services/AppointmentPatient';
import MuiAlert from '@mui/material/Alert';
import { format, addDays, isAfter, parse, parseISO } from 'date-fns';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import './component/rep.css'
import dayjs from 'dayjs';
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const CreatePatientAccount = () => {
    const [open, setOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false); // State mới cho dialog của nút Add
    const [patientData, setPatientData] = useState({
        patientId: '',
        phone: '',
        email: '',
        password: '',
        name: '',
        gender: '',
        address: '',
        dob: '',
        isActive: true // Mặc định là true
    });
    const [addData, setAddData] = useState(''); // State cho dữ liệu nhập từ dialog Add
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    //
    const today = dayjs();
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [doctorOptions, setDoctorOptions] = useState([]);
    const [serviceOptions, setServiceOptions] = useState([]);
    const [doctor, setDoctor] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [slot, setSlot] = useState([]);
    const [doctorId, setDoctorId] = useState('');
    const [patientId, setPatientId] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [serviceId, setServId] = useState('');
    const [depId, setDepId] = useState('');
    const [service, setService] = useState('');
    //
    const [dateOptions, setDateOptions] = useState([]);
    const [slotOptions, setSlotOptions] = useState([]);
    const formRef = useRef(null);
    const [passwordVisible, setPasswordVisible] = useState({});

    const handleTogglePasswordVisibility = (accId) => {
        setPasswordVisible((prev) => ({
            ...prev,
            [accId]: !prev[accId]
        }));
    };
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };
    const handleExtractText = async () => {
        if (!file) {
            setSnackbarMessage('Vui lòng chọn file trước khi trích xuất.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('https://localhost:7240/api/OCR_API/extract-text', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const result = response.data;

            // Chuyển đổi ngày sinh từ dd/MM/yyyy sang yyyy-MM-dd

            let formattedDob = '';
            if (result.dateOfBirth) {
                try {
                    const parsedDate = parseISO(result.dateOfBirth); // Ensure result.dateOfBirth is ISO format
                    if (!isNaN(parsedDate.getTime())) {
                        formattedDob = format(parsedDate, 'yyyy-MM-dd'); // Format to yyyy-MM-dd
                    } else {
                        console.error('Parsed date is invalid');
                    }
                } catch (error) {
                    console.error('Date parsing error:', error);
                }
            }
            // Cập nhật state với kết quả OCR
            setPatientData({
                ...patientData,
                phone: result.phoneNumber || '',
                name: result.fullName || '',
                dob: formattedDob,
                address: result.address || '',
                gender: result.gender.toLowerCase() === 'Nam' ? 'male' : result.gender.toLowerCase() === 'Nữ' ? 'female' : 'male',
                email: result.email || '',
                // Thêm các trường khác nếu cần
            });

            setSnackbarMessage('Trích xuất thông tin thành công!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Lỗi khi trích xuất text:', error);
            setSnackbarMessage('Có lỗi xảy ra khi trích xuất thông tin.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };
    useEffect(() => {
        // Fetch departments on component mount
        getListDepartment()
            .then(data => {
                console.log('Fetched departments:', data);
                setDepartmentOptions(data.$values || []);
            })
            .catch(error => {
                console.error('Error fetching departments:', error);
            });
        fetchSlots()
            .then(data => {
                console.log('Fetched slots:', data);
                setSlot(data.$values || []);
            })
            .catch(error => {
                console.error('Failed to fetch slots:', error);
            });
    }, []);

    useEffect(() => {
        // Fetch services when department changes
        if (depId) {
            fetchServices(depId)
                .then(data => {
                    console.log('Fetched services:', data);
                    setServiceOptions(data || []);
                    console.log('After setServiceOptions:', data || []);
                })
                .catch(error => {
                    console.error('Failed to fetch services:', error);
                });
        }
    }, [depId]);

    useEffect(() => {
        // Fetch services when department changes
        if (serviceId) {
            fetchDoctorByService(serviceId)
                .then(data => {
                    console.log('Fetched services:', data);
                    setDoctorOptions(data || []);
                    console.log('After set doc:', data || []);
                })
                .catch(error => {
                    console.error('Failed to fetch services:', error);
                });
        }
    }, [serviceId]);

    // useEffect(() => {
    //     // Fetch dates by doctor
    //     if (doctorId) {
    //         fetchDateByDoctor(doctorId)
    //             .then(data => setDateOptions(data || []))
    //             .catch(error => console.error('Failed to fetch dates:', error));
    //     }
    // }, [doctorId]);
    useEffect(() => {
        // Fetch dates by doctor
        if (doctorId) {
            fetchDateByDoctor(doctorId)
                .then(data => {
                    const filteredDates = getNextFourDays(data);
                    setDateOptions(filteredDates || []);
                })
                .catch(error => console.error('Failed to fetch dates:', error));
        }
    }, [doctorId]);


    //Lấy 30 ngày
    const getNextFourDays = (dates) => {
        const today = new Date();
        const nextFourDays = [];
        let count = 0;

        for (const dateItem of dates) {
            const [day, month, year] = dateItem.date.split('-');
            const date = new Date(`${year}-${month}-${day}`);

            if (isAfter(date, today) || date.toDateString() === today.toDateString()) {
                nextFourDays.push(dateItem);
                count++;
            }

            if (count === 30) break;
        }

        return nextFourDays;
    };



    useEffect(() => {
        // Fetch slots when date or doctor changes
        if (doctorId && date) {
            fetchSlotsByDoctorAndDate(doctorId, date)
                .then(data => setSlotOptions(data || []))
                .catch(error => console.error('Failed to fetch slots:', error));
        }
    }, [doctorId, date]);

    const handleDepartmentChange = (event) => {
        const depId = event.target.value;
        setDepId(depId);
        setDoctor(''); // Reset doctor selection when department changes
        setServId(''); // Reset service selection when department changes
        console.log('Selected department:', depId); // Log selected department ID
    };

    const handleDoctorChange = (event) => {
        const doctorId = event.target.value;
        setDoctorId(doctorId);
        setDoctor(doctorId); // Assuming doctor name is also needed somewhere
    };

    const handleDateChange = (event) => {
        const date = event.target.value;
        setDate(date);
    };

    const handleTimeChange = (event) => {
        const time = event.target.value;
        setTime(time);
    };

    const handleServiceChange = (event) => {
        const serviceId = event.target.value;
        setServId(serviceId);
        setService(serviceId);
        console.log('id của cái này là:', serviceId)
    };

    const accountId = localStorage.getItem('accountId');
    const convertToDate = (dateStr) => {
        const [day, month, year] = dateStr.split('-');
        return new Date(`${year}-${month}-${day}`);
    };

    const handleSubmit1 = async (event) => {
        event.preventDefault();

        const testDate = convertToDate(date);
        if (isNaN(testDate.getTime())) {
            setOpenSnackbar(true);
            setSnackbarMessage('Ngày không hợp lệ. Vui lòng kiểm tra lại!');
            return;
        }

        const formattedDate = format(testDate, 'dd-MM-yyyy');
        const appointmentDto = {
            patientId: parseInt(patientId, 10),
            doctorId: doctorId,
            date: formattedDate,
            slotId: time,
            depId: depId,
            serviceId: serviceId
        };

        try {
            await ReceptionbookAppointment(appointmentDto);
            setSnackbarMessage('Thêm mới thành công');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            handleAddDialogClose();
            // Reset form
            setDepId('');
            setServId('');
            setDoctor('');
            setDoctorId('');
            setDate('');
            setTime('');
            setSlotOptions([]);
        } catch (error) {
            setOpenSnackbar(true);
            setSnackbarMessage('Đặt lịch thất bại. Vui lòng thử lại!');
            console.error('Error booking appointment:', error);
        }
    };



    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const SnackbarMessage = (props) => (
        <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} {...props} sx={{ backgroundColor: '#4caf50', color: '#fff' }} />
    );
    //
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const patientsList = await getAllPatients();
                setPatients(patientsList);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        fetchPatients();
    }, []);

    const handleClickOpen = () => {
        setPatientData({
            patientId: '',
            phone: '',
            email: '',
            password: '',
            name: '',
            gender: '',
            address: '',
            dob: '',
            activeStatus: true // Mặc định là true
        });
        setOpen(true);
    };

    const handleClose = () => {
        setPatientData({
            patientId: '',
            phone: '',
            email: '',
            password: '',
            name: '',
            gender: '',
            address: '',
            dob: '',
            activeStatus: true // Mặc định là true
        });
        setOpen(false);
    };

    const handleAddDialogOpen = (patientId) => {
        setPatientId(patientId); // Lưu ID bệnh nhân vào state
        setAddData(''); // Reset dữ liệu nhập khi mở dialog
        setAddDialogOpen(true);
    };


    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
    };

    const handleAddChange = (e) => {
        setAddData(e.target.value);
    };

    const handleAddSubmit = () => {
        // Xử lý dữ liệu nhập từ dialog Add
        console.log('Dữ liệu nhập từ dialog Add:', addData);
        setAddDialogOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatientData({ ...patientData, [name]: value });
        if (name === 'dob') {
            // Kiểm tra định dạng ngày sinh
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (dateRegex.test(value)) {
                // Định dạng ngày hợp lệ, cập nhật state
                setPatientData({ ...patientData, [name]: value });
            } else {
                // Định dạng ngày không hợp lệ, giữ nguyên giá trị trong state
                setPatientData({ ...patientData, [name]: patientData.dob });
            }
        } else {
            // Với các trường khác, cập nhật giá trị như bình thường
            setPatientData({ ...patientData, [name]: value });
        }
    };

    const handleSubmit = async () => {
        // Validate fields
        if (!patientData.phone || !patientData.email || !patientData.name || !patientData.address || !patientData.dob) {
            setSnackbarMessage('Tất cả các trường đều là bắt buộc.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        if (patientData.phone.length < 10 || patientData.phone.length > 11) {
            setSnackbarMessage('Số điện thoại phải có từ 10 đến 11 ký tự.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        if (!/\S+@\S+\.\S+/.test(patientData.email)) {
            setSnackbarMessage('Email không hợp lệ.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        if (patientData.name.length > 50) {
            setSnackbarMessage('Tên không được vượt quá 50 ký tự.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        if (patientData.address.length > 100) {
            setSnackbarMessage('Địa chỉ không được vượt quá 100 ký tự.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        try {
            // Ensure date is in correct format
            const formattedDate = format(new Date(patientData.dob), 'yyyy-MM-dd');
            const result = await createPatient({ ...patientData, dob: formattedDate });

            // If no errors, show success message
            setSnackbarMessage('Thêm mới bệnh nhân thành công!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setOpen(false);

            // Fetch updated patient list
            const patientsList = await getAllPatients();
            setPatients(patientsList);
        } catch (error) {
            // Show error message
            console.error('Error creating patient:', error);

            let errorMessage = 'Số điện thoại hoặc email đã tồn tại!';
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            }

            // Log ra message của lỗi
            console.log('Error message:', errorMessage);

            setSnackbarMessage(errorMessage);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };




    const handleStatusChange = async (patientId, currentStatus) => {
        try {
            // Cập nhật trạng thái của bệnh nhân
            await updatePatientStatus(patientId, currentStatus === null ? 1 : null);
            // Cập nhật danh sách bệnh nhân
            const patientsList = await getAllPatients();
            setSnackbarMessage('Thay đổi trạng thái thành công!');
            setSnackbarSeverity('success');

            setOpenSnackbar(true);
            setPatients(patientsList);
        } catch (error) {
            setSnackbarMessage('Thay đổi trạng thái thất bại');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            console.error('Error updating patient status:', error);
        }
    };

    const filteredAccounts = patients.filter((account) => {
        return account.phone.includes(searchTerm);
    });

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <Button className="btn_add" variant="contained" onClick={handleClickOpen}>
                Thêm tài khoản
            </Button>
            {/* Dialog để thêm tài khoản */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Thêm tài khoản</DialogTitle>
                <DialogContent>
                    <Input
                        type="file"
                        onChange={handleFileChange}
                        style={{ marginBottom: '1rem' }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleExtractText}
                        style={{ marginBottom: '1rem' }}
                    >
                        Điền dữ liệu từ ảnh
                    </Button>
                    <TextField
                        margin="dense"
                        label="Số điện thoại"
                        type="text"
                        fullWidth
                        name="phone"
                        value={patientData.phone}
                        onChange={handleChange}
                        required
                        inputProps={{ maxLength: 11 }} // Giới hạn độ dài tối đa của số điện thoại
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        name="email"
                        value={patientData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Mật khẩu"
                        type="password"
                        fullWidth
                        name="password"
                        value={patientData.password}
                        onChange={handleChange}
                        style={{ display: 'none' }}
                    />

                    <TextField
                        margin="dense"
                        label="Tên"
                        type="text"
                        fullWidth
                        name="name"
                        value={patientData.name}
                        onChange={handleChange}
                        required
                    />

                    <FormControl fullWidth margin="dense">
                        <InputLabel>Giới tính</InputLabel>
                        <Select
                            name="gender"
                            value={patientData.gender}
                            onChange={handleChange}
                        >
                            <MenuItem value="male">Nam</MenuItem>
                            <MenuItem value="female">Nữ</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        label="Địa chỉ"
                        type="text"
                        fullWidth
                        name="address"
                        value={patientData.address}
                        onChange={handleChange}
                        required

                    />
                    <TextField
                        margin="dense"
                        label="Ngày sinh"
                        type="date"
                        fullWidth
                        name="dob"
                        value={patientData.dob}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            min: format(addDays(new Date(), -365 * 100), 'yyyy-MM-dd'), // Đặt giá trị tối thiểu là 100 năm trước ngày hôm nay
                            max: format(new Date(), 'yyyy-MM-dd'), // Đặt giá trị tối đa là ngày hôm nay
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleSubmit}>Lưu</Button>
                </DialogActions>
            </Dialog>

            {/* Thanh tìm kiếm với Autocomplete */}
            <Autocomplete
                freeSolo
                options={patients.map((patient) => patient.phone)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Tìm kiếm theo số điện thoại"
                        margin="dense"
                        variant="outlined"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                )}
                onInputChange={(event, newInputValue) => {
                    setSearchTerm(newInputValue);
                }}
            />

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Mật khẩu</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Giới tính</TableCell>
                            <TableCell>Địa chỉ</TableCell>
                            <TableCell>Ngày sinh</TableCell>
                            <TableCell>Trạng thái tài khoản</TableCell>
                            <TableCell>Tạo lịch tái khám</TableCell>
                            <TableCell>Trạng thái</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAccounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((patient) => (
                            <TableRow key={patient.patientId}>
                                <TableCell>{patient.patientId}</TableCell>
                                <TableCell>{patient.phone}</TableCell>
                                <TableCell>{patient.email}</TableCell>
                                <TableCell>
                                    <TextField
                                        type={passwordVisible[patient.patientId] ? 'text' : 'password'}
                                        value={patient.password}
                                        InputProps={{
                                            readOnly: true,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => handleTogglePasswordVisibility(patient.patientId)}
                                                    >
                                                        {passwordVisible[patient.patientId] ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </TableCell>
                                <TableCell>{patient.name}</TableCell>
                                <TableCell>{patient.gender === 'Male' ? 'Nam' : 'Nữ'}</TableCell>
                                <TableCell>{patient.address}</TableCell>
                                <TableCell>      {format(new Date(patient.dob), 'dd-MM-yyyy')}</TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: '50%',
                                            backgroundColor: patient.isActive ? 'green' : 'red',
                                            display: 'inline-block',
                                            marginLeft: 5
                                        }}
                                    />
                                </TableCell>

                                <TableCell>
                                    <Button
                                        className="small-button"
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<AddIcon />}
                                        onClick={() => handleAddDialogOpen(patient.patientId)} // Truyền ID bệnh nhân vào hàm
                                    >
                                        Tái Khám
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        className="small-button"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleStatusChange(patient.patientId, patient.check)}
                                    >
                                        {patient.check === 1 ? 'Hoạt động' : (patient.check === 2 || patient.check === 3) ? 'Không hoạt động' : ''}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredAccounts.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                />
            </TableContainer>

            {/* Dialog để nhập dữ liệu khi bấm nút Add */}
            <Dialog open={addDialogOpen} onClose={handleAddDialogClose}>
                <DialogTitle>Nhập dữ liệu</DialogTitle>
                <DialogContent>
                    <Grid item xs={12} md={6}>
                        <form onSubmit={handleSubmit1}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
                                        <InputLabel id="department-label">Chuyên khoa</InputLabel>
                                        <Select
                                            labelId="department-label"
                                            id="department"
                                            value={depId || ''}
                                            onChange={handleDepartmentChange}
                                            label="Chuyên khoa"
                                        >
                                            {departmentOptions.map(depart => (
                                                <MenuItem key={depart.depId} value={depart.depId}>
                                                    {depart.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
                                        <InputLabel id="service-label">Dịch vụ</InputLabel>
                                        <Select
                                            labelId="service-label"
                                            id="service"
                                            value={serviceId || ''}
                                            onChange={handleServiceChange}
                                            label="Dịch vụ"
                                            disabled={!depId}
                                        >
                                            {serviceOptions.length > 0 ? (
                                                serviceOptions.map(service => (
                                                    <MenuItem key={service.serviceId} value={service.serviceId}>
                                                        {service.name}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem disabled>Không có dịch vụ nào có sẵn</MenuItem>
                                            )}
                                        </Select>


                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
                                        <InputLabel id="doctor-label">Bác sĩ</InputLabel>
                                        <Select
                                            labelId="doctor-label"
                                            id="doctor"
                                            value={doctor || ''}
                                            onChange={handleDoctorChange}
                                            label="Bác sĩ"
                                            disabled={!serviceId}
                                        >
                                            {doctorOptions.length > 0 ? (
                                                doctorOptions.map(doc => (
                                                    <MenuItem key={doc.docId} value={doc.docId}>
                                                        {doc.name}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem disabled>Không có bác sĩ</MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
                                        <InputLabel id="date-label">Chọn ngày</InputLabel>
                                        <Select
                                            labelId="date-label"
                                            id="date"
                                            value={date || ''}
                                            onChange={handleDateChange}
                                            label="Chọn ngày"
                                            disabled={!doctorId}
                                        >
                                            {dateOptions.length > 0 ? (
                                                dateOptions.map(slotItem => (
                                                    <MenuItem key={slotItem.$id} value={slotItem.date}>
                                                        {slotItem.date}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem disabled>Không có ngày</MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined" required sx={{ marginTop: 2 }}>
                                        <InputLabel id="time-label">Thời gian</InputLabel>
                                        <Select
                                            labelId="time-label"
                                            id="time"
                                            value={time || ''}
                                            onChange={handleTimeChange}
                                            label="Thời gian"
                                            startAdornment={<AccessTimeIcon sx={{ marginRight: 1 }} />}
                                            disabled={!date}
                                        >
                                            {slotOptions.length > 0 ? (
                                                slotOptions.map(slotItem => (
                                                    <MenuItem key={slotItem.slotId} value={slotItem.slotId}>
                                                        {slotItem.time}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem disabled>Không có thời gian</MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" color="primary" fullWidth>
                                        Đặt lịch
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </DialogContent>

            </Dialog>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Adjust position here
                sx={{ zIndex: 1300, position: 'absolute' }} // Adjust zIndex if needed
            >
                <Alert onClose={handleCloseSnackbar} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default CreatePatientAccount;
