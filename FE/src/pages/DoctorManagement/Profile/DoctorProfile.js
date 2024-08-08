import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Snackbar, Alert, Avatar, Box, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

const defaultImg = 'https://via.placeholder.com/150'; // Link đến ảnh mặc định

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(defaultImg); // State to manage the avatar URL
  const [confirmPassword, setConfirmPassword] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const accoundId = localStorage.getItem('accountId');
  const [emailError, setEmailError] = useState('');
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`https://localhost:7240/api/UpdateProfile/${accoundId}`);
        console.log('Fetched profile data:', response.data);
        setProfile(response.data);
        setAvatarUrl(response.data.img || defaultImg); // Set defaultImg if img is not available
        setDescription(response.data.description || '');
        setPhone(response.data.accountPhone || '');
        setEmail(response.data.accountEmail || '');
        setPassword(response.data.accountPassword || '');
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
      const updatedProfile = {
        img: avatarUrl,
        description,
        accountPhone: phone,
        accountEmail: email,
        accountPassword: password,
      };

      const response = await axios.put(`https://localhost:7240/doctorProfile/${accoundId}`, updatedProfile);

      setSnackbarMessage(response.data.message || 'Cập nhật hồ sơ thành công');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      console.log(response);
    } catch (error) {
      setSnackbarMessage(error.response.data || 'Không thể cập nhật hồ sơ');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
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

        console.log('Upload response:', uploadResponse.data);
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
              backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent background
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              textAlign: 'center',
              borderRadius: '50%',
              zIndex: 1,
              cursor: 'pointer', // Ensure the overlay is clickable
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
            if (/^\d{0,11}$/.test(value)) { // Chỉ cho phép số và tối đa 11 ký tự
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
            if (value.length <= 50) { // Giới hạn tối đa 50 ký tự
              setPassword(value);
            }
          }}
          variant="outlined"
          disabled={!isEditing}
          sx={{ border: '1px solid gray', borderRadius: 1 }}
          InputProps={{
            endAdornment: (
              <IconButton
                edge="end"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ẩn' : 'Hiện'}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
        {isEditing && (
          <TextField
            fullWidth
            margin="normal"
            label="Xác nhận mật khẩu"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 50) { // Giới hạn tối đa 50 ký tự
                setConfirmPassword(value);
              }
            }}
            variant="outlined"
            sx={{ border: '1px solid gray', borderRadius: 1 }}
            InputProps={{
              endAdornment: (
                <IconButton
                  edge="end"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Ẩn' : 'Hiện'}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
        )}
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleToggleEdit}>
            {isEditing ? 'Chế độ xem' : 'Chỉnh sửa'}
          </Button>
          {isEditing && (
            <Button variant="contained" color="secondary" onClick={handleUpdateProfile} sx={{ ml: 2 }}>
              Cập nhật hồ sơ
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
  );
};

export default Profile;
