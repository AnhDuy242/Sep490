import React, { useContext, useState } from 'react';
import { Modal, Box, Button, TextField, Typography, Alert, IconButton, Checkbox, FormControlLabel } from '@mui/material';
import { Visibility, VisibilityOff, Close } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import google_icon from '../../assets/images/google.png';
import '../LoginForm/LoginForm.css';
import { AuthContext } from '../../pages/Home/AuthContext';

const validationSchema = yup.object({
  identifier: yup
    .string('Nhập số điện thoại hoặc email')
    .test('isValidEmailOrPhone', 'Số điện thoại hoặc email không hợp lệ', value => {
      const phoneRegExp = /^[0-9]{10}$/;
      const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return phoneRegExp.test(value) || emailRegExp.test(value);
    })
    .required('Số điện thoại hoặc email là bắt buộc'),
  password: yup
    .string('Nhập mật khẩu')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .required('Mật khẩu là bắt buộc')
});

const LoginForm = ({ show, handleClose, handleLogin, setToken }) => { // Ensure setToken is received as a prop
  const [error, setError] = useState(null);
  const { updateToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      identifier: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Call handleLogin passed from props
        await handleLogin({ username: values.identifier, password: values.password });
        formik.resetForm();
        setError(null);
      } catch (error) {
        setError(error.message || 'Đã xảy ra lỗi khi đăng nhập');
      } finally {
        setLoading(false);
      }
    }
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Modal open={show} onClose={handleClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 1,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" className='login-text-label'>Đăng nhập</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
        <Box className={`error-container ${error ? 'show' : ''}`}>
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
        <Typography variant="body2" gutterBottom>
          Bạn chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Nhập số điện thoại hoặc email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="identifier"
            value={formik.values.identifier}
            onChange={formik.handleChange}
            error={formik.touched.identifier && Boolean(formik.errors.identifier)}
            helperText={formik.touched.identifier && formik.errors.identifier}
          />
          <TextField
            label="Mật khẩu"
            variant="outlined"
            fullWidth
            margin="normal"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <IconButton onClick={togglePasswordVisibility}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <FormControlLabel
            control={<Checkbox checked={showPassword} onChange={togglePasswordVisibility} />}
            label="Hiển thị mật khẩu"
          />
          <Box sx={{ textAlign: 'center', my: 2 }}>
            <Typography variant="body2">Hoặc đăng nhập bằng</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Button variant="outlined" startIcon={<img src={google_icon} alt="Google" className='google_icon' />} href="/identity/externallogin/?provider=Google">
              Google
            </Button>
          </Box>
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default LoginForm;
