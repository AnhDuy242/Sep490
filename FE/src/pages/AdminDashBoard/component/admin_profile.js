import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Snackbar, Alert, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [originalEmail, setOriginalEmail] = useState(''); // Store original email
  const [confirmPassword, setConfirmPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const adminId = localStorage.getItem('accountId'); // Adjust as necessary

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`https://localhost:7240/api/AdminProfile/GetAdmin/${adminId}`);
        setProfile({
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          password: response.data.password || ''
        });
        setOriginalEmail(response.data.email || ''); // Store original email
      } catch (error) {
        setSnackbarMessage('Không thể tải thông tin hồ sơ');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    };

    fetchProfile();
  }, [adminId]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenOtpDialog = () => {
    setOtpDialogOpen(true);
  };

  const handleCloseOtpDialog = () => {
    setOtpDialogOpen(false);
    setOtp('');
    setOtpError('');
  };

  const handleSendOtp = async () => {
    try {
      await axios.post(`https://localhost:7240/api/Otp/SendOtp?Email=${originalEmail}`); // Send OTP to original email
      handleOpenOtpDialog();
    } catch (error) {
      setSnackbarMessage('Không thể gửi OTP');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };
  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        'https://localhost:7240/api/Otp/VerifyOtpEmail',
        {
          email: originalEmail, // Send the current email from the profile
          otp: otp              // Send the OTP
        }
      );
      if (response.status === 200) { // Check if response status is 201
        await handleUpdateProfile(); // Call the function to update the profile
        handleCloseOtpDialog();      // Close the OTP dialog
      } else {
        setOtpError('OTP không đúng'); // Handle invalid OTP
      }
    } catch (error) {
      setOtpError('Xác minh OTP thất bại'); // Handle OTP verification failure
    }
  };
  

  const handleUpdateProfile = async () => {
    if (!profile.name || profile.name.length > 50) {
      setSnackbarMessage('Tên không được để trống và phải nhỏ hơn 50 ký tự');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }
  
    if (!profile.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      setSnackbarMessage('Email không hợp lệ');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }
  
    if (!profile.phone || profile.phone.length < 10 || profile.phone.length > 11) {
      setSnackbarMessage('Số điện thoại phải có từ 10 đến 11 ký tự');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }
  
    if (!profile.password || profile.password.length > 50) {
      setSnackbarMessage('Mật khẩu không được để trống và phải nhỏ hơn 50 ký tự');
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
  
      const response = await fetch(`https://localhost:7240/api/AdminProfile/UpdateAdmin/${adminId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.error || 'Không thể cập nhật hồ sơ');
      }
      
      setSnackbarMessage('Cập nhật hồ sơ thành công');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setIsEditing(false); // Exit edit mode after successful update
    } catch (error) {
      console.log(error);
      setSnackbarMessage(error.message || 'Không thể cập nhật hồ sơ');
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

  const handleEdit = () => {
    if (isEditing) {
      // If already in editing mode, trigger OTP sending
      handleSendOtp();
    } else {
      // Toggle edit mode
      setIsEditing(true);
    }
  };

  if (!profile) return <Typography>Đang tải...</Typography>;

  return (
    <>
      <Helmet>
        <title>Xem hồ sơ quản trị viên</title>
      </Helmet>

      <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, mb: 8 }}>
        <Typography variant="h4" gutterBottom>
          Hồ Sơ Quản Trị Viên
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
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleEdit}
            sx={{ mb: 2 }}
          >
            {isEditing ? 'Gửi OTP' : 'Chỉnh sửa'}
          </Button>
        </Box>
      </Container>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog open={otpDialogOpen} onClose={handleCloseOtpDialog}>
        <DialogTitle>Xác thực OTP</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nhập OTP"
            type="text"
            fullWidth
            variant="outlined"
            value={otp}
            onChange={handleOtpChange}
            error={!!otpError}
            helperText={otpError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOtpDialog}>Hủy</Button>
          <Button onClick={handleVerifyOtp}>Xác nhận</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminProfile;
