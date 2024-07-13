import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, TextField, MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import { createPatient } from './../../services/receptionist_management';

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

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatientData({ ...patientData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            await createPatient(patientData);
            handleClose();
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
                            <MenuItem value="other">Khác</MenuItem>
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
                        <TableRow>
                            {/* Render thông tin tài khoản bệnh nhân ở đây */}
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default CreatePatientAccount;
