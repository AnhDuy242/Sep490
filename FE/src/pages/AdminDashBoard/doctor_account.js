import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, IconButton, Checkbox, Typography, TextField,
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
} from '@mui/material';
import { loadDoctors, deleteDoctor, addDoctor } from '../../services/doctor_service';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import '../../assets/css/doctor_list_table.css';

const DoctorTable = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [deletePhone, setDeletePhone] = useState('');
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    gender: '',
    age: '',
    phone: '',
    role: 'Doctor', // Set default value for role
  });
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    loadDoctors(setDoctors, setLoading, setError);
  }, []);

  const handleDeleteDoctor = async () => {
    try {
      await deleteDoctor(deletePhone);
      const updatedDoctors = doctors.filter((doctor) => doctor.phone !== deletePhone);
      setDoctors(updatedDoctors);
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  const handleOpenDeleteDialog = (phone) => {
    setDeletePhone(phone);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeletePhone('');
    setOpenDeleteDialog(false);
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setNewDoctor({
      name: '',
      gender: '',
      age: '',
      phone: '',
      role: 'Doctor', // Reset to default value
    });
    setValidationError(''); // Clear validation error
    setOpenAddDialog(false);
  };

  const handleAddDoctor = async () => {
    // Validation
    if (!newDoctor.name || !newDoctor.gender || !newDoctor.age || !newDoctor.phone) {
      setValidationError('Tất cả các trường phải được điền đầy đủ.');
      return;
    }

    try {
      const addedDoctor = await addDoctor(newDoctor);
      setDoctors([...doctors, addedDoctor]);
      handleCloseAddDialog();
    } catch (error) {
      console.error('Error adding doctor:', error);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Typography fontSize={50}>Quản lý tài khoản bác sĩ</Typography>
      <TextField
        label="Tìm kiếm theo tên hoặc số điện thoại"
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button className="btn_add" variant="contained" onClick={handleOpenAddDialog}>
        Thêm tài khoản
      </Button>
      <Button className="btn_delete">Xóa các lựa chọn</Button>
      <TableContainer component={Paper}>
        <Table className="table_list">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Doctor Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>{doctor.phone}</TableCell>
                <TableCell>{doctor.password}</TableCell>
                <TableCell>{doctor.gender}</TableCell>
                <TableCell>{doctor.age}</TableCell>
                <TableCell>{doctor.departmentName}</TableCell>
                <TableCell>
                  <IconButton
                    title="Xóa"
                    onClick={() => handleOpenDeleteDialog(doctor.phone)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton title="Chi tiết">
                    <InfoIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Dialog xác nhận xóa */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xác nhận xóa bác sĩ</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Bạn có chắc chắn muốn xóa bác sĩ có số điện thoại: {deletePhone}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Hủy
          </Button>
          <Button
            onClick={handleDeleteDoctor}
            color="primary"
            autoFocus
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog thêm bác sĩ */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Thêm tài khoản bác sĩ</DialogTitle>
        <DialogContent>
          {validationError && (
            <Typography color="error" variant="body2">
              {validationError}
            </Typography>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Tên"
            type="text"
            fullWidth
            value={newDoctor.name}
            onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            id="gender"
            label="Giới tính"
            type="text"
            fullWidth
            value={newDoctor.gender}
            onChange={(e) => setNewDoctor({ ...newDoctor, gender: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            id="age"
            label="Tuổi"
            type="number"
            fullWidth
            value={newDoctor.age}
            onChange={(e) => setNewDoctor({ ...newDoctor, age: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            id="phone"
            label="Số điện thoại"
            type="text"
            fullWidth
            value={newDoctor.phone}
            onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            id="role"
            label="Vai trò"
            type="text"
            fullWidth
            value={newDoctor.role}
            disabled // Make this field read-only
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleAddDoctor} color="primary">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DoctorTable;



