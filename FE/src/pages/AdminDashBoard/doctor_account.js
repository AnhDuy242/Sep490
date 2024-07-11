import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, IconButton, Typography, TextField, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, Select, MenuItem, FormControl, InputLabel, TablePagination
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

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchType, setSearchType] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

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

  const handleEditDoctor = async () => {
    if (!currentDoctor.name || !currentDoctor.gender || !currentDoctor.age || !currentDoctor.phone) {
      setValidationError('Tất cả các trường phải được điền đầy đủ.');
      return;
    }

    const updatedDoctorData = {
      ...currentDoctor,
      isActive: currentDoctor.isActive === 'true' || currentDoctor.isActive === true
    };

    try {
      const updatedDoctor = await updateDoctor(currentDoctor.accId, updatedDoctorData);
      setDoctors(doctors.map(doc => (doc.accId === updatedDoctor.accId ? updatedDoctor : doc)));
      handleCloseEditDialog();
      window.location.reload();
    } catch (error) {
      console.error('Error updating doctor:', error);
    }
  };

  const handleSearchChange = (event, value) => {
    setSearchQuery(value);
    const filtered = doctors
      .filter(doctor =>
        doctor.name.toLowerCase().includes(value.toLowerCase()) ||
        doctor.phone.includes(value)
      ).slice(0, 5);
    setFilteredDoctors(filtered);
  };


  
  // Hàm để xử lý khi không có gợi ý được chọn
  const handleInputChange = (event, value) => {
    setSearchQuery(value);
  
    // Filter doctors based on name or phone directly
    const filtered = doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(value.toLowerCase()) ||
      doctor.phone.includes(value)
    );
  
    setFilteredDoctors(filtered);
  };
  


  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredAccounts = (searchQuery ? filteredDoctors : doctors).filter((account) => {
    if (searchType === 'name') {
      return account.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchType === 'phone') {
      return account.phone.includes(searchTerm);
    }
    return true;
  });

  const paginatedAccounts = filteredAccounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID Tài Khoản</TableCell>
              <TableCell>Tên bác sĩ</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Mật khẩu</TableCell>
              <TableCell>Giới tính</TableCell>
              <TableCell>Tuổi</TableCell>
              <TableCell>Chuyên khoa</TableCell>
              <TableCell>Trạng thái hoạt động</TableCell>
              <TableCell>Chức năng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAccounts.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>{doctor.accId}</TableCell>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>{doctor.phone}</TableCell>
                <TableCell>{doctor.password}</TableCell>
                <TableCell>{doctor.gender}</TableCell>
                <TableCell>{doctor.age}</TableCell>
                <TableCell>{doctor.departmentName}</TableCell>
                <TableCell>{doctor.isActive ? 'Active' : 'Inactive'}</TableCell>
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
            id="edit-pwsd"
            label="Mật khẩu"
            type="text"
            fullWidth
            value={currentDoctor?.password || ''}
            onChange={(e) => setCurrentDoctor({ ...currentDoctor, password: e.target.value })}
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
          <FormControl fullWidth margin="dense" required>
            <InputLabel id="edit-isActive-label">Trạng thái hoạt động</InputLabel>
            <Select
              labelId="edit-isActive-label"
              id="edit-isActive"
              value={currentDoctor?.isActive ? 'true' : 'false'}
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

