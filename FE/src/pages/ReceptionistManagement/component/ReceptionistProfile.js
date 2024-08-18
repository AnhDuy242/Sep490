import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Snackbar, Alert, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Footer from '../../../layouts/Footer';

const ReceptionistProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [originalEmail, setOriginalEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const [otpError, setOtpError] = useState('');
  const receptionistId = localStorage.getItem('accountId'); // Adjust as necessary

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`https://localhost:7240/api/ReceptionistProfile/GetReceptionistProfile/${receptionistId}`);
        setProfile(response.data);
        setOriginalEmail(response.data.email);
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

  const handleSendOtp = async () => {
    try {
      await axios.post(`https://localhost:7240/api/Otp/SendOtp?Email=${encodeURIComponent(originalEmail)}`);
      setOpenOtpDialog(true);
    } catch (error) {
      setSnackbarMessage('Gửi OTP thất bại');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('https://localhost:7240/api/Otp/VerifyOtpEmail', {
        email: originalEmail,
        otp,
      });

      if (response.status === 200) {
        // Proceed to update profile after OTP verification
        await updateProfile();
        setOpenOtpDialog(false);
      } else {
        setOtpError('OTP không đúng');
      }
    } catch (error) {
      setOtpError('Xác minh OTP thất bại');
    }
  };

  const updateProfile = async () => {
    try {
      const response = await fetch(`https://localhost:7240/api/ReceptionistProfile/UpdateReceptionistProfile/${receptionistId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profile,
          password: profile.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Cập nhật hồ sơ thất bại');
      }

      setSnackbarMessage('Cập nhật hồ sơ thành công');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setIsEditing(false); // Exit edit mode after successful update
    } catch (error) {
      setSnackbarMessage(error.message || 'Cập nhật hồ sơ thất bại');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleUpdateProfile = () => {
    // Kiểm tra các trường bắt buộc
    if (!profile.name || !profile.email || !profile.phone || !profile.password) {
      setSnackbarMessage('Vui lòng điền tất cả các trường bắt buộc');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }

    // Kiểm tra độ dài tên
    if (profile.name.length > 50) {
      setSnackbarMessage('Tên không được vượt quá 50 ký tự');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }

    // Kiểm tra định dạng email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(profile.email)) {
      setSnackbarMessage('Email không hợp lệ');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }

    // Kiểm tra số điện thoại (10-11 số)
    const phonePattern = /^\d{10,11}$/;
    if (!phonePattern.test(profile.phone)) {
      setSnackbarMessage('Số điện thoại phải có 10 hoặc 11 chữ số');
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

    // Send OTP
    handleSendOtp();
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
              <Button
                variant="contained"
                color="primary"
                sx={{ ml: 2 }}
                onClick={handleUpdateProfile}
              >
                Lưu thay đổi
              </Button>
            )}
          </Box>
        </Box>

        <Dialog open={openOtpDialog} onClose={() => setOpenOtpDialog(false)}>
          <DialogTitle>Xác minh OTP</DialogTitle>
          <DialogContent>
            <TextField
              label="Nhập OTP"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              error={!!otpError}
              helperText={otpError}
              variant="outlined"
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenOtpDialog(false)} color="secondary">
              Hủy
            </Button>
            <Button onClick={handleVerifyOtp} color="primary">
              Xác minh
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>

    </>
  );
};

export default ReceptionistProfile;
