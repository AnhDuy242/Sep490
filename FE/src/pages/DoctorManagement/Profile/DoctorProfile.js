import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Snackbar, Alert, Avatar, Box, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

const defaultImg = 'https://via.placeholder.com/150'; // Link to default image

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(defaultImg);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState(''); // OTP state
  const [otpError, setOtpError] = useState('');
  const [otpDialogOpen, setOtpDialogOpen] = useState(false); // OTP Dialog visibility state
  const accoundId = localStorage.getItem('accountId');
  const [emailError, setEmailError] = useState('');
  const [originalEmail, setOriginalEmail] = useState(''); // Store original email

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`https://localhost:7240/api/UpdateProfile/${accoundId}`);
        setProfile(response.data);
        setAvatarUrl(response.data.img || defaultImg);
        setDescription(response.data.description || '');
        setPhone(response.data.accountPhone || '');
        setEmail(response.data.accountEmail || '');
        setPassword(response.data.accountPassword || '');
        setOriginalEmail(response.data.accountEmail || ''); // Set original email
      } catch (error) {
        setSnackbarMessage('Failed to fetch profile');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    };

    fetchProfile();
  }, [accoundId]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleOpenOtpDialog = () => {
    setOtpDialogOpen(true);
  };

  const handleCloseOtpDialog = () => {
    setOtpDialogOpen(false);
    setOtp(''); // Reset OTP input
    setOtpError(''); // Reset OTP error
  };

  const handleUpdateProfile = async () => {
    if (password !== confirmPassword) {
      setSnackbarMessage('Mật khẩu không trùng hợp');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Email không hợp lệ');
      setSnackbarMessage('Email không hợp lệ');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    setEmailError('');
    if (!email || !phone || !password) {
      setSnackbarMessage('Hãy điền đầy đủ thông tin');
      setSnackbarSeverity('warning');
      setOpenSnackbar(true);
      return;
    }

    try {
      // Call API to send OTP to the original email
      await axios.post(`https://localhost:7240/api/Otp/SendOtp?Email=${originalEmail}`);
      handleOpenOtpDialog(); // Open OTP dialog
    } catch (error) {
      setSnackbarMessage('Không thể gửi mã OTP');
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
        const updatedProfile = {
          img: avatarUrl,
          description,
          accountPhone: phone,
          accountEmail: email,
          accountPassword: password,
        };
        await axios.put(`https://localhost:7240/doctorProfile/${accoundId}`, updatedProfile);
        setSnackbarMessage('Cập nhật hồ sơ thành công');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setIsEditing(false);
        handleCloseOtpDialog();
      } else {
        setOtpError('OTP không đúng');
      }
    } catch (error) {
      setOtpError('Xác minh OTP thất bại');
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await axios.post('https://localhost:7240/api/Upload/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const { url } = uploadResponse.data;
        setAvatarUrl(url); // Update the avatar URL with the uploaded image URL
      } catch (error) {
        setSnackbarMessage('Không thể tải ảnh lên');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    }
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      document.getElementById('file-input').click();
    }
  };

  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Hồ sơ
      </Typography>
      <Box sx={{ position: 'relative', mb: 2, cursor: 'pointer' }} onClick={handleAvatarClick}>
        <Avatar
          alt="Profile Picture"
          src={avatarUrl}
          sx={{ width: 150, height: 150 }}
        />
        {isEditing && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              textAlign: 'center',
              borderRadius: '50%',
              zIndex: 1,
              cursor: 'pointer',
            }}
          >
            Bấm để tải lên
          </Box>
        )}
        <input
          type="file"
          id="file-input"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </Box>
      <Box sx={{ width: '100%', maxWidth: 600, border: '1px solid gray', borderRadius: 2, p: 2 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          variant="outlined"
          disabled={!isEditing}
          multiline
          rows={4}
          sx={{ border: '1px solid gray', borderRadius: 1 }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Số điện thoại"
          value={phone}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,11}$/.test(value)) { 
              setPhone(value);
            }
          }}
          variant="outlined"
          disabled={!isEditing}
          sx={{ border: '1px solid gray', borderRadius: 1 }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          error={!!emailError}
          helperText={emailError}
          sx={{ border: '1px solid gray', borderRadius: 1 }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Mật khẩu"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 50) { 
              setPassword(value);
            }
          }}
          variant="outlined"
          disabled={!isEditing}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
          sx={{ border: '1px solid gray', borderRadius: 1 }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Xác nhận mật khẩu"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 50) { 
              setConfirmPassword(value);
            }
          }}
          variant="outlined"
          disabled={!isEditing}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
          sx={{ border: '1px solid gray', borderRadius: 1 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleToggleEdit} sx={{ mr: 2 }}>
            {isEditing ? 'Hủy' : 'Chỉnh sửa'}
          </Button>
          {isEditing && (
            <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
              Cập nhật
            </Button>
          )}
        </Box>
      </Box>

      {/* OTP Dialog */}
      <Dialog open={otpDialogOpen} onClose={handleCloseOtpDialog}>
        <DialogTitle>Xác minh OTP</DialogTitle>
        <DialogContent>
          <TextField
            label="Nhập mã OTP"
            variant="outlined"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            error={!!otpError}
            helperText={otpError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOtpDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleVerifyOtp} color="primary">
            Xác minh
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Adjust snackbar position here
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
