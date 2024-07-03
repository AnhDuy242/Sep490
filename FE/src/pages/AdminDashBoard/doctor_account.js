import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, IconButton,
  Checkbox, Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem,
  FormControl, InputLabel
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
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
    role: 'Doctor',
  });
  const [validationError, setValidationError] = useState('');

  //dùng search và lưu vào mảng
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  //load danh sách bác sĩ
  useEffect(() => {
    loadDoctors(setDoctors, setLoading, setError);
  }, []);

  //xóa bác sĩ
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
      role: 'Doctor',
    });
    setValidationError('');
    setOpenAddDialog(false);
  };

  //thêm bác sĩ
  const handleAddDoctor = async () => {
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

  //xử lý check box
  const handleCheckboxChange = (phone) => {
    if (selectedDoctors.includes(phone)) {
      setSelectedDoctors(selectedDoctors.filter((p) => p !== phone));
    } else {
      setSelectedDoctors([...selectedDoctors, phone]);
    }
  };

  const handleOpenMultipleDeleteDialog = () => {
    setOpenMultipleDeleteDialog(true);
  };

  const handleCloseMultipleDeleteDialog = () => {
    setOpenMultipleDeleteDialog(false);
  };

  const handleDeleteMultipleDoctors = async () => {
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

  //xử lý search auto change
  const handleSearchChange = (event, value) => {
    setSearchQuery(value);
    const filtered = doctors
      .filter(doctor =>
        doctor.name.toLowerCase().includes(value.toLowerCase()) ||
        doctor.phone.includes(value)
      ).slice(0,5); // Giới hạn kết quả hiển thị
    setFilteredDoctors(filtered);
  };

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Typography fontSize={50}>Quản lý tài khoản bác sĩ</Typography>
      <Autocomplete
        freeSolo
        options={filteredDoctors.map(doctor => doctor.name + ' (' + doctor.phone + ')')}
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
              <TableCell>Account ID</TableCell>
              <TableCell>Doctor Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Is active</TableCell>
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
                <TableCell>{doctor.accId}</TableCell>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>{doctor.phone}</TableCell>
                <TableCell>{doctor.password}</TableCell>
                <TableCell>{doctor.gender}</TableCell>
                <TableCell>{doctor.age}</TableCell>
                <TableCell>{doctor.departmentName}</TableCell>
                <TableCell>{doctor.isActive ? 'Active' : 'Inactive'}</TableCell> {/* Sử dụng điều kiện để hiển thị giá trị */}

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
      {/**Xóa nhiều bác sĩ */}
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
            onClick={handleDeleteMultipleDoctors}
            color="primary"
            autoFocus
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
      {/*xóa 1 bác sĩ */}
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
      {/**Thêm bác sĩ */}
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
            disabled
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



