import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, IconButton  } from '@mui/material';
import { loadDoctors } from '../../services/doctor_service'; // Import hàm loadDoctors từ file doctorService.js
import DeleteIcon from '@mui/icons-material/Delete'; // Import biểu tượng xóa
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info'; 
import '../../assets/css/doctor_list_table.css'

const DoctorTable = () => {
  const [doctors, setDoctors] = useState([]); // Trạng thái để lưu dữ liệu từ API
  const [loading, setLoading] = useState(true); // Trạng thái để kiểm tra xem dữ liệu đã tải xong chưa
  const [error, setError] = useState(null); // Trạng thái để lưu lỗi nếu có

  // Gọi API để lấy dữ liệu
  useEffect(() => {
    loadDoctors(setDoctors, setLoading, setError); // Gọi hàm loadDoctors và truyền các setter
  }, []); // Mảng rỗng để chỉ gọi API một lần khi component được render

  if (loading) return <CircularProgress />; // Hiển thị loading spinner nếu đang tải
  if (error) return <p>Error: {error}</p>; // Hiển thị thông báo lỗi nếu có lỗi

  return (
    // <TableContainer component={Paper}>
      <Table className="table_list">
        <TableHead>
          <TableRow>
            <TableCell>Check</TableCell>
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
              <TableCell></TableCell>
              <TableCell>{doctor.name}</TableCell>
              <TableCell>{doctor.email}</TableCell>
              <TableCell>{doctor.phone}</TableCell>
              <TableCell>{doctor.password}</TableCell>
              <TableCell>{doctor.gender}</TableCell>
              <TableCell>{doctor.age}</TableCell>
              <TableCell>{doctor.departmentName}</TableCell>
              <TableCell>
                <IconButton title='Xóa'>
                    <DeleteIcon />
                </IconButton>
                <IconButton title='Chi tiết'>
                    <InfoIcon/>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    // </TableContainer>
  );
};

export default DoctorTable;
