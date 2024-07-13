import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, TextField, MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import { createPatient, getAllPatients } from './../../services/receptionist_management';

const CreatePatientAccount = () => {
    const [open, setOpen] = useState(false);
    const [patientData, setPatientData] = useState({
        id: '',
        phone: '',
        email: '',
        password: '',
        name: '',
        gender: '',
        address: '',
        birthDate: '',
        activeStatus: true // Mặc định là true
    });
    const [patients, setPatients] = useState([]);

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
        setOpen(true);
    };

    const handleClose = () => {
        setPatientData({
            id: '',
            phone: '',
            email: '',
            password: '',
            name: '',
            gender: '',
            address: '',
            birthDate: '',
            activeStatus: true // Mặc định là true
        });
        setOpen(false);

    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatientData({ ...patientData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            await createPatient(patientData);
            setOpen(false);
            // Fetch the updated list of patients after adding a new one
            const patientsList = await getAllPatients();
            setPatients(patientsList);
        } catch (error) {
            console.error('Error creating patient:', error);
        }
    };

    return (
        <>
            <Button className="btn_add" variant="contained" onClick={handleClickOpen}>
                Thêm tài khoản
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Thêm tài khoản</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Số điện thoại"
                        type="text"
                        fullWidth
                        name="phone"
                        value={patientData.phone}
                        onChange={handleChange}
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
                        label="Password"
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
                    />
                    <TextField
                        margin="dense"
                        label="Ngày sinh"
                        type="date"
                        fullWidth
                        name="birthDate"
                        value={patientData.birthDate}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    {/* Không cần trường "Trạng thái hoạt động" vì mặc định là true */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleSubmit}>Lưu</Button>
                </DialogActions>
            </Dialog>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID Tài Khoản</TableCell>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Password</TableCell>
                            <TableCell>Tên</TableCell>
                            <TableCell>Giới tính</TableCell>
                            <TableCell>Địa chỉ</TableCell>
                            <TableCell>Ngày sinh</TableCell>
                            <TableCell>Trạng thái hoạt động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients && patients.length > 0 ? (
                            patients.map((patient) => (
                                <TableRow key={patient.accId}>
                                    <TableCell>{patient.accId}</TableCell>
                                    <TableCell>{patient.phone}</TableCell>
                                    <TableCell>{patient.email}</TableCell>
                                    <TableCell>{patient.password}</TableCell>
                                    <TableCell>{patient.name}</TableCell>
                                    <TableCell>{patient.gender}</TableCell>
                                    <TableCell>{patient.address}</TableCell>
                                    <TableCell>{patient.dob}</TableCell>
                                    <TableCell>{patient.isActive ? 'Active' : 'Inactive'}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} align="center">
                                    Không có dữ liệu
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default CreatePatientAccount;
