
import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, IconButton,
  Checkbox, Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem,
  FormControl, InputLabel
} from '@mui/material';
import { Autocomplete } from '@mui/lab';  // Import thêm Autocomplete
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
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [openMultipleDeleteDialog, setOpenMultipleDeleteDialog] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    gender: '',
    age: '',
    phone: '',
    role: 'Doctor', // Set default value for role
  });
  const [validationError, setValidationError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);

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
  //Dialog xóa 1 bác sĩ
  const handleOpenDeleteDialog = (phone) => {
    setDeletePhone(phone);
    setOpenDeleteDialog(true);
  };
  //đóng dialog xóa 1 bác sĩ
  const handleCloseDeleteDialog = () => {
    setDeletePhone('');
    setOpenDeleteDialog(false);
  };
  //mở dialog thêm bác sĩ
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };
  //đóng dialog thêm bác sĩ
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
  //hàm xử lý checkbox
  const handleCheckboxChange = (phone) => {
    if (selectedDoctors.includes(phone)) {
      setSelectedDoctors(selectedDoctors.filter((p) => p !== phone));
    } else {
      setSelectedDoctors([...selectedDoctors, phone]);
    }
  };

  //xử lý nút nhấn xóa các lựa chọn
  const handleOpenMultipleDeleteDialog = () => {
    setOpenMultipleDeleteDialog(true);
  };
  //đóng diaglog xóa nhiều bác sĩ
  const handleCloseMultipleDeleteDialog = () => {
    setOpenMultipleDeleteDialog(false);
  };

  //xóa nhiều bác sĩ
  const handleDeleteMutipleDoctor = async () => {
    try {
      await Promise.all(selectedDoctors.map(async (phone) => {
        await deleteDoctor(phone);
      }));
      const updatedDoctors = doctors.filter((doctor) => !selectedDoctors.includes(doctor.phone));
      setDoctors(updatedDoctors);
      setSelectedDoctors([]);
      handleCloseMultipleDeleteDialog();
    } catch (error) {
      console.error('Error deleting doctors:', error);
    }
  };

  const handleSearchChange = (event, value) => {
    setSearchQuery(value);
    const filtered = doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(value.toLowerCase()) ||
      doctor.phone.includes(value)
    );
    setFilteredDoctors(filtered);
  };

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Typography fontSize={50}>Quản lý tài khoản bác sĩ</Typography>
      <Autocomplete
        freeSolo
        options={doctors.map(doctor => doctor.name + ' (' + doctor.phone + ')')}
        inputValue={searchQuery}
        onInputChange={handleSearchChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tìm kiếm theo tên hoặc số điện thoại"
            variant="outlined"
            fullWidth
            margin="normal"
          />
        )}
      />
      <Button className="btn_add" variant="contained" onClick={handleOpenAddDialog}>
        Thêm tài khoản
      </Button>
      <Button
        className="btn_delete"
        disabled={selectedDoctors.length === 0}
        onClick={handleOpenMultipleDeleteDialog}
      >
        Xóa các lựa chọn
      </Button>
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
            {(searchQuery ? filteredDoctors : doctors).map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedDoctors.includes(doctor.phone)}
                    onChange={() => handleCheckboxChange(doctor.phone)}
                  />
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
      {/*Dialog xóa nhiều lựa chọn*/}
      <Dialog
        open={openMultipleDeleteDialog}
        onClose={handleCloseMultipleDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xác nhận xóa nhiều bác sĩ</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Bạn có chắc chắn muốn xóa {selectedDoctors.length} bác sĩ đã chọn?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMultipleDeleteDialog} color="primary">
            Hủy
          </Button>
          <Button
            onClick={handleDeleteMutipleDoctor}
            color="primary"
            autoFocus
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
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
          {/* <TextField
            margin="dense"
            id="gender"
            label="Giới tính"
            type="text"
            fullWidth
            value={newDoctor.gender}
            onChange={(e) => setNewDoctor({ ...newDoctor, gender: e.target.value })}
            required
          /> */}
          <FormControl fullWidth margin="dense" required>
            <InputLabel id="gender-label">Giới tính</InputLabel>
            <Select
              labelId="gender-label"
              id="gender"
              value={newDoctor.gender}
              onChange={(e) => setNewDoctor({ ...newDoctor, gender: e.target.value })}
              label="Giới tính"
            >
              <MenuItem value="Male">Nam</MenuItem>
              <MenuItem value="Female">Nữ</MenuItem>
            </Select>
          </FormControl>
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
