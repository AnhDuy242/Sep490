import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Snackbar, Alert, Box, IconButton } from '@mui/material';
import axios from 'axios';
import { Helmet } from 'react-helmet';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Header from '../../../layouts/Header';
import { Navbar } from 'react-bootstrap';
import Footer from '../../../layouts/Footer';

const ReceptionistProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const receptionistId = localStorage.getItem('accountId'); // Adjust as necessary

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`https://localhost:7240/api/ReceptionistProfile/GetReceptionistProfile/${receptionistId}`);
        // Update profile state with fetched data
        setProfile(response.data);
      } catch (error) {
        setSnackbarMessage('Không thể tải thông tin hồ sơ');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    };

    fetchProfile();
  }, [receptionistId]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdateProfile = async () => {
    if (!profile.name || !profile.email || !profile.phone || !profile.password) {
      setSnackbarMessage('Vui lòng điền tất cả các trường bắt buộc');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }

    if (profile.password !== confirmPassword) {
      setSnackbarMessage('Mật khẩu không khớp');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    try {
      const updatedProfile = {
        ...profile,
        password: profile.password,
      };

      await axios.put(`https://localhost:7240/api/ReceptionistProfile/UpdateReceptionistProfile/${receptionistId}`, updatedProfile);

      setSnackbarMessage('Cập nhật hồ sơ thành công');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setIsEditing(false); // Exit edit mode after successful update
    } catch (error) {
      setSnackbarMessage('Cập nhật hồ sơ thất bại');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  if (!profile) return <Typography>Đang tải...</Typography>;

  return (
    <>
      <Helmet>
        <title>Xem hồ sơ nhân viên</title>
      </Helmet>
    
  
      <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, mb: 8 }}>
        <Typography variant="h4" gutterBottom>
          Hồ Sơ Nhân Viên
        </Typography>
        <Box sx={{ width: '100%', maxWidth: 600, border: '1px solid gray', borderRadius: 2, p: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Tên"
            name="name"
            value={profile.name || ''}
            onChange={handleChange}
            variant="outlined"
            disabled={!isEditing}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Số điện thoại"
            name="phone"
            value={profile.phone || ''}
            onChange={handleChange}
            variant="outlined"
            disabled={!isEditing}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={profile.email || ''}
            onChange={handleChange}
            variant="outlined"
            disabled={!isEditing}
            sx={{ mb: 2 }}
          />
      
          <TextField
            fullWidth
            margin="normal"
            label="Mật khẩu"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={profile.password || ''}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <IconButton
                  edge="end"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          {isEditing && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Xác nhận mật khẩu"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                variant="outlined"
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      edge="end"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Ẩn xác nhận mật khẩu' : 'Hiện xác nhận mật khẩu'}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            </>
          )}
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color={isEditing ? 'secondary' : 'primary'} onClick={handleToggleEdit}>
              {isEditing ? 'Trở về' : 'Chỉnh sửa hồ sơ'}
            </Button>
            {isEditing && (
              <Button variant="contained" color="primary" sx={{ ml: 2 }} onClick={handleUpdateProfile}>
                Lưu thay đổi
              </Button>
            )}
          </Box>
        </Box>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default ReceptionistProfile;
