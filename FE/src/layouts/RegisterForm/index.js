import React, { useState } from 'react';
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Checkbox,
  FormControlLabel,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

const validationSchema = yup.object({
  username: yup
    .string('Nhập số điện thoại')
    .matches(/^\d{10}$/, 'Số điện thoại phải có 10 ký tự')
    .required('Số điện thoại là bắt buộc'),
  password: yup
    .string('Nhập mật khẩu')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .required('Mật khẩu là bắt buộc'),
  confirmPassword: yup
    .string('Nhập lại mật khẩu')
    .oneOf([yup.ref('password'), null], 'Mật khẩu phải trùng khớp')
    .required('Nhập lại mật khẩu là bắt buộc')
});

const RegisterForm = ({ show, handleClose }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      // Simulate successful registration and navigate to OTP page
      setTimeout(() => {
        setLoading(false);
        navigate('/otp', { state: { username: values.username } });
      }, 1000);

      // Commented out fetch request
      // try {
      //   const response = await fetch('http://example.com/register', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       username: values.username,
      //       password: values.password,
      //     }),
      //   });

      //   const data = await response.json();

      //   if (!response.ok) {
      //     throw new Error(data.message || 'Something went wrong');
      //   }

      //   console.log('Registration successful:', data);
      //   navigate('/otp', { state: { username: values.username } });
      // } catch (error) {
      //   setError(error.message || 'Đã xảy ra lỗi khi đăng ký');
      // } finally {
      //   setLoading(false);
      // }
    }
  });

  return (
    <Modal open={show} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Đăng ký</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Nhập số điện thoại"
            fullWidth
            margin="normal"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />

          <TextField
            label="Mật khẩu"
            type={formik.values.showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />

          <TextField
            label="Nhập lại Mật khẩu"
            type={formik.values.showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.showPassword}
                onChange={() => formik.setFieldValue('showPassword', !formik.values.showPassword)}
              />
            }
            label="Hiển thị mật khẩu"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default RegisterForm;
