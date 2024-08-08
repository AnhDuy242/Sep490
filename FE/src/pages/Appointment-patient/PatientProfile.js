import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Snackbar, Alert, Box, IconButton } from '@mui/material';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Navbar from '../../layouts/Navbar';
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    password: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const accountId = localStorage.getItem('accountId'); // Adjust as necessary

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`https://localhost:7240/api/PatientProfile/GetPatientProfile/${accountId}`);
        if (!response.ok) {
          throw new Error('Không thể tải thông tin hồ sơ');
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        setSnackbarMessage(error.message);
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    };

    fetchProfile();
  }, [accountId]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdateProfile = async () => {
    // Validate form fields
    if (!profile.name || !profile.phone || !profile.password) {
      setSnackbarMessage('Vui lòng điền tất cả các trường bắt buộc');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }
  
    if (profile.name.length > 50) {
      setSnackbarMessage('Tên không được vượt quá 50 ký tự');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }
  
    if (profile.address.length > 200) {
      setSnackbarMessage('Địa chỉ không được vượt quá 200 ký tự');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }
  
    if (profile.phone.length < 10 || profile.phone.length > 11) {
      setSnackbarMessage('Số điện thoại phải từ 10 đến 11 số');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      setSnackbarMessage('Email không hợp lệ');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }
  
    if (profile.password.length < 6) {
      setSnackbarMessage('Mật khẩu phải có ít nhất 6 ký tự');
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
  
      const response = await fetch(`https://localhost:7240/api/PatientProfile/UpdatePatientProfile/${accountId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Cập nhật hồ sơ thất bại');
      }
  
      setSnackbarMessage('Cập nhật hồ sơ thành công');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setIsEditing(false); // Exit edit mode after successful update
    } catch (error) {
      console.log(error);
      setSnackbarMessage(error.message);
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
        <title>Xem hồ sơ bệnh nhân</title>
      </Helmet>
      <Header />
      <Navbar />
  
      <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, mb: 8 }}>
        <Typography variant="h4" gutterBottom>
          Hồ Sơ Bệnh Nhân
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
            label="Địa chỉ"
            name="address"
            value={profile.address || ''}
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
      <Footer sx={{ position: 'fixed', bottom: 0, width: '100%' }} />
    </>
  );
};

export default Profile;
