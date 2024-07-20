import React, { useState, useEffect } from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, 
    TextField, MenuItem, FormControl, InputLabel, Select, TablePagination} from '@mui/material';
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
    const [searchType, setSearchType] = useState('name');
    const [searchTerm, setSearchTerm] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

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

    const filteredAccounts = patients.filter((account) => {
        if (searchType === 'name') {
            return account.name.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchType === 'phone') {
            return account.phone.includes(searchTerm);
        }
        return true;
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
                        {filteredAccounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((patient) => (
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
        </>
    );
};

export default CreatePatientAccount;
