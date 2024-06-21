import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as yup from 'yup';

// Schema validate cho OTP
const validationSchema = yup.object({
  phoneNumber: yup
    .string('Nhập số điện thoại')
    .matches(/^(0\d{9,10})$/, 'Số điện thoại phải có 10 ký tự và bắt đầu bằng số 0')
    .required('Số điện thoại là bắt buộc'),
  otp: yup
    .string('Nhập mã OTP')
    .matches(/^\d{6}$/, 'Mã OTP phải có 6 chữ số')
    .required('Mã OTP là bắt buộc'),
});

// Schema validate cho thông tin cá nhân
const personalInfoSchema = yup.object({
  name: yup
    .string('Nhập tên')
    .matches(/^[a-zA-Z\s]+$/, 'Tên chỉ được chứa các ký tự chữ cái.')
    .required('Tên là bắt buộc'),
  email: yup
    .string('Nhập email')
    .email('Vui lòng nhập địa chỉ email hợp lệ.')
    .required('Email là bắt buộc'),
  dob: yup
    .date('Nhập ngày sinh')
    .required('Ngày sinh là bắt buộc'),
  gender: yup
    .string('Chọn giới tính')
    .required('Giới tính là bắt buộc'),
  address: yup
    .string('Nhập địa chỉ')
    .required('Địa chỉ là bắt buộc'),
  password: yup
    .string('Nhập mật khẩu')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự.')
    .required('Mật khẩu là bắt buộc'),
  repassword: yup
    .string('Nhập lại mật khẩu')
    .oneOf([yup.ref('password'), null], 'Mật khẩu không khớp.')
    .required('Xác nhận mật khẩu là bắt buộc'),
});

const RegisterForm = ({ show, handleClose }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [open, setOpen] = useState(false);
  const [timer, setTimer] = useState(0);
  const [phoneNumberForDialog, setPhoneNumberForDialog] = useState('');

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && otpSent) {
      setOtpSent(false);
    }
    return () => clearInterval(interval);
  }, [timer, otpSent]);

  const formik = useFormik({
    initialValues: {
      phoneNumber: '',
      otp: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (values.otp !== '123456') {
        setOtpError('Mã OTP không chính xác');
        return;
      }
      setOtpError('');
      setOpen(true);
    }
  });

  const handleSendOtp = () => {
    if (!validationSchema.fields.phoneNumber.isValidSync(formik.values.phoneNumber)) {
      setOtpError('Vui lòng nhập số điện thoại hợp lệ trước khi yêu cầu mã OTP.');
      return;
    }

    console.log('Gửi OTP đến số điện thoại:', formik.values.phoneNumber);
    setOtpSent(true);
    setOtpError('');
    setTimer(60); // Đặt bộ đếm thời gian là 60 giây

    setPhoneNumberForDialog(formik.values.phoneNumber);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    handleClose();
  };

  // Formik cho form thông tin cá nhân
  const formikPersonalInfo = useFormik({
    initialValues: {
      name: '',
      email: '',
      dob: '',
      gender: '',
      address: '',
      password: '',
      repassword: ''
    },
    validationSchema: personalInfoSchema,
    onSubmit: (values) => {
      console.log('Thông tin cá nhân:', values);
      handleCloseDialog();
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
        <Box display="flex" justifyContent="space-between" alignItems="center" >
          <Typography variant="h6">Đăng ký</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {otpError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {otpError}
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Nhập số điện thoại"
            fullWidth
            margin="normal"
            name="phoneNumber"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSendOtp}
            fullWidth
            sx={{ mt: 2 }}
            disabled={otpSent}
          >
            {otpSent ? `Gửi lại mã OTP sau ${timer} giây` : 'Gửi mã OTP'}
          </Button>

          {otpSent && (
            <>
              <TextField
                label="Nhập mã OTP"
                fullWidth
                margin="normal"
                name="otp"
                value={formik.values.otp}
                onChange={formik.handleChange}
                error={formik.touched.otp && Boolean(formik.errors.otp)}
                helperText={formik.touched.otp && formik.errors.otp}
                sx={{ mt: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Xác nhận đăng ký
              </Button>
            </>
          )}
        </Box>

        <Dialog open={open} onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleCloseDialog(event, reason);
          }
        }} maxWidth="xs" fullWidth>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <DialogTitle>Xác Minh Thành Công</DialogTitle>
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
          <DialogContent>
            <DialogContentText>
              Bạn đã xác minh OTP thành công. Vui lòng nhập thông tin cá nhân để hoàn tất quá trình.
            </DialogContentText>
            <Box component="form" onSubmit={formikPersonalInfo.handleSubmit} sx={{ mt: 2 }}>
              <TextField
                label="Tên"
                variant="outlined"
                name="name"
                value={formikPersonalInfo.values.name}
                onChange={formikPersonalInfo.handleChange}
                fullWidth
                required
                error={formikPersonalInfo.touched.name && Boolean(formikPersonalInfo.errors.name)}
                helperText={formikPersonalInfo.touched.name && formikPersonalInfo.errors.name}
                sx={{ mb: 2 }}
              />
              <Typography variant="subtitle1" sx={{ mt: 2 }} marginBottom={{}}>
                Số điện thoại: {phoneNumberForDialog}
              </Typography>
              <TextField
                label="Email"
                variant="outlined"
                name="email"
                value={formikPersonalInfo.values.email}
                onChange={formikPersonalInfo.handleChange}
                fullWidth
                required
                error={formikPersonalInfo.touched.email && Boolean(formikPersonalInfo.errors.email)}
                helperText={formikPersonalInfo.touched.email && formikPersonalInfo.errors.email}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Ngày sinh"
                type="date"
                variant="outlined"
                name="dob"
                value={formikPersonalInfo.values.dob}
                onChange={formikPersonalInfo.handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                error={formikPersonalInfo.touched.dob && Boolean(formikPersonalInfo.errors.dob)}
                helperText={formikPersonalInfo.touched.dob && formikPersonalInfo.errors.dob}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Giới tính"
                select
                variant="outlined"
                name="gender"
                value={formikPersonalInfo.values.gender}
                onChange={formikPersonalInfo.handleChange}
                fullWidth
                required
                error={formikPersonalInfo.touched.gender && Boolean(formikPersonalInfo.errors.gender)}
                helperText={formikPersonalInfo.touched.gender && formikPersonalInfo.errors.gender}
                sx={{ mb: 2 }}
              >
                <MenuItem value="male">Nam</MenuItem>
                <MenuItem value="female">Nữ</MenuItem>
              </TextField>
              <TextField
                label="Địa chỉ"
                variant="outlined"
                name="address"
                value={formikPersonalInfo.values.address}
                onChange={formikPersonalInfo.handleChange}
                fullWidth
                required
                error={formikPersonalInfo.touched.address && Boolean(formikPersonalInfo.errors.address)}
                helperText={formikPersonalInfo.touched.address && formikPersonalInfo.errors.address}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Mật khẩu"
                variant="outlined"
                type="password"
                name="password"
                value={formikPersonalInfo.values.password}
                onChange={formikPersonalInfo.handleChange}
                fullWidth
                required
                error={formikPersonalInfo.touched.password && Boolean(formikPersonalInfo.errors.password)}
                helperText={formikPersonalInfo.touched.password && formikPersonalInfo.errors.password}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Nhập lại mật khẩu"
                variant="outlined"
                type="password"
                name="repassword"
                value={formikPersonalInfo.values.repassword}
                onChange={formikPersonalInfo.handleChange}
                fullWidth
                required
                error={formikPersonalInfo.touched.repassword && Boolean(formikPersonalInfo.errors.repassword)}
                helperText={formikPersonalInfo.touched.repassword && formikPersonalInfo.errors.repassword}
                sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Hoàn tất đăng ký
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </Modal>
  );
};

export default RegisterForm;
