import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Checkbox,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { loadDoctors } from '../../services/doctor_service';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import '../../assets/css/doctor_list_table.css';

const DoctorTable = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletePhone, setDeletePhone] = useState('');

  useEffect(() => {
    loadDoctors(setDoctors, setLoading, setError);
  }, []);

  const handleDeleteDoctor = async (phone) => {
    try {
      const response = await fetch(`https://localhost:7240/api/Doctor/${phone}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete doctor with phone ${phone}`);
      }
      // Nếu xóa thành công, cập nhật lại danh sách bác sĩ
      const updatedDoctors = doctors.filter((doctor) => doctor.phone !== phone);
      setDoctors(updatedDoctors);
      handleCloseDeleteDialog(); // Đóng dialog sau khi xóa thành công
    } catch (error) {
      console.error('Error deleting doctor:', error);
      // Xử lý lỗi xóa bác sĩ
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
      <Button className="btn_add" variant="contained">
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
                    onClick={() => handleOpenDeleteDialog(doctor.phone)} // Gọi hàm mở dialog xóa bác sĩ khi nhấp vào biểu tượng xóa
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
            onClick={() => handleDeleteDoctor(deletePhone)}
            color="primary"
            autoFocus
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DoctorTable;








