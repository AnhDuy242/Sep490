import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, IconButton, Typography, TextField,
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { loadDoctors, addDoctor, updateDoctor } from '../../services/doctor_service';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import '../../assets/css/doctor_list_table.css';

const DoctorTable = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);
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

  const handleOpenEditDialog = (doctor) => {
    setCurrentDoctor(doctor);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setCurrentDoctor(null);
    setValidationError('');
    setOpenEditDialog(false);
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

  // Hàm chỉnh sửa bác sĩ
  const handleEditDoctor = async () => {
    if (!currentDoctor.name || !currentDoctor.gender || !currentDoctor.age || !currentDoctor.phone) {
      setValidationError('Tất cả các trường phải được điền đầy đủ.');
      return;
    }

    // Chuyển đổi isActive thành boolean
    const updatedDoctorData = {
      ...currentDoctor,
      isActive: currentDoctor.isActive === 'true' || currentDoctor.isActive === true // Chuyển đổi string 'true' hoặc boolean true
    };

    console.log('Current Doctor Data:', updatedDoctorData);

    try {
      const updatedDoctor = await updateDoctor(currentDoctor.accId, updatedDoctorData);
      setDoctors(doctors.map(doc => (doc.accId === updatedDoctor.accId ? updatedDoctor : doc)));
      handleCloseEditDialog();
      window.location.reload();
    } catch (error) {
      // console.error('Error updating doctor:', error);
    }
  };
  //xử lý search auto change
  const handleSearchChange = (event, value) => {
    setSearchQuery(value);
    const filtered = doctors
      .filter(doctor =>
        doctor.name.toLowerCase().includes(value.toLowerCase()) ||
        doctor.phone.includes(value)
      ).slice(0, 5); // Giới hạn kết quả hiển thị
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
      <TableContainer component={Paper}>
        <Table className="table_list">
          <TableHead>
            <TableRow>
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
                  <IconButton title="Chỉnh sửa" color="primary" onClick={() => handleOpenEditDialog(doctor)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton title="Chi tiết" sx={{ color: '#ff5722' }}>
                    <InfoIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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

      {/**Chỉnh sửa bác sĩ */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Chỉnh sửa tài khoản bác sĩ</DialogTitle>
        <DialogContent>
          {validationError && (
            <Typography color="error" variant="body2">
              {validationError}
            </Typography>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="edit-name"
            label="Tên"
            type="text"
            fullWidth
            value={currentDoctor?.name || ''}
            onChange={(e) => setCurrentDoctor({ ...currentDoctor, name: e.target.value })}
            required
          />
          <TextField
            autoFocus
            margin="dense"
            id="edit-email"
            label="Email"
            type="text"
            fullWidth
            value={currentDoctor?.email || ''}
            onChange={(e) => setCurrentDoctor({ ...currentDoctor, email: e.target.value })}
            required
          />
          <FormControl fullWidth margin="dense" required>
            <InputLabel id="edit-gender-label">Giới tính</InputLabel>
            <Select
              labelId="edit-gender-label"
              id="edit-gender"
              value={currentDoctor?.gender || ''}
              onChange={(e) => setCurrentDoctor({ ...currentDoctor, gender: e.target.value })}
              label="Giới tính"
            >
              <MenuItem value="Male">Nam</MenuItem>
              <MenuItem value="Female">Nữ</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            id="edit-age"
            label="Tuổi"
            type="number"
            fullWidth
            value={currentDoctor?.age || ''}
            onChange={(e) => setCurrentDoctor({ ...currentDoctor, age: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            id="edit-phone"
            label="Số điện thoại"
            type="text"
            fullWidth
            value={currentDoctor?.phone || ''}
            onChange={(e) => setCurrentDoctor({ ...currentDoctor, phone: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            id="edit-role"
            label="Vai trò"
            type="text"
            fullWidth
            value={currentDoctor?.role || 'Doctor'}
            disabled
          />
          <TextField
            margin="dense"
            id="edit-depId"
            label="Chuyên khoa"
            type="text"
            fullWidth
            value={currentDoctor?.depId || ''}
            onChange={(e) => setCurrentDoctor({ ...currentDoctor, depId: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            id="edit-depName"
            label="Tên chuyên khoa"
            type="text"
            fullWidth
            value={currentDoctor?.departmentName || ''}
            onChange={(e) => setCurrentDoctor({ ...currentDoctor, departmentName: e.target.value })}
            required
          />
          {/* <TextField
            margin="dense"
            id="edit-isActive"
            label="Trạng thái hoạt động"
            type="text"
            fullWidth
            value={currentDoctor?.isActive || ''}
            onChange={(e) => setCurrentDoctor({ ...currentDoctor, isActive: e.target.value })}
            required
          /> */}
          <FormControl fullWidth margin="dense" required>
            <InputLabel id="edit-isActive-label">Trạng thái hoạt động</InputLabel>
            <Select
              labelId="edit-isActive-label"
              id="edit-isActive"
              value={currentDoctor?.isActive ? 'true' : 'false'} // Chuyển đổi giá trị boolean thành chuỗi
              onChange={(e) => setCurrentDoctor({ ...currentDoctor, isActive: e.target.value === 'true' })}
              label="Trạng thái hoạt động"
            >
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleEditDoctor} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DoctorTable;


