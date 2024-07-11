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
  Snackbar,
  SnackbarContent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { handleReceiveOTPForEmail, handleRegisterForEmail, handleSentOTPConfirm } from '../../services/Authentication'; // Import the function

// Schema validate cho OTP
const validationSchema = yup.object({
  contact: yup
    .string()
    .required('Thông tin liên hệ là bắt buộc')
    .test(
      'is-phone-or-email',
      'Thông tin liên hệ không hợp lệ',
      value => /^(0\d{9,10})$/.test(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ),
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
  const [otpReceived, setOtpReceived] = useState(null);
  const [otpError, setOtpError] = useState('');
  const [open, setOpen] = useState(false);
  const [timer, setTimer] = useState(0);
  const [contactForDialog, setContactForDialog] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
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
      contact: '',
      otp: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (values.otp !== otpReceived) {
        setOtpError('Mã OTP không chính xác');
        return;
      }
      setOtpError('');
      setOpen(true);
    },
  });

  const handleSendOtp = async () => {
    const isPhoneNumber = /^(0\d{9,10})$/.test(formik.values.contact);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formik.values.contact);
  
    if (!isPhoneNumber && !isEmail) {
      setOtpError('Vui lòng nhập thông tin liên hệ hợp lệ trước khi yêu cầu mã OTP.');
      return;
    }
  
    if (isEmail) {
      const email = formik.values.contact;
      handleRegisterForEmail(email);
      
      try {
        const otp = await handleReceiveOTPForEmail(email); // Gọi hàm xử lý nhận OTP và đợi kết quả trả về
        setOtpReceived(otp); // Cập nhật giá trị otpReceived khi nhận được OTP thành công
        console.log(otp); // Log để kiểm tra giá trị OTP đã nhận được
        setSnackbarMessage('Đã gửi thành công mã OTP');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error receiving OTP:', error);
        setOtpError('Đã xảy ra lỗi khi nhận OTP. Vui lòng thử lại sau.');
      }
    } else {
      console.log('Gửi OTP đến số điện thoại:', formik.values.contact);
    }
  
    setOtpSent(true);
    setOtpError('');
    setTimer(60); // Đặt bộ đếm thời gian là 60 giây
    setContactForDialog(formik.values.contact);
  };
  
  const handleSentOtpConfirm = () =>{
    const otp = formik.values.otp;
    const contact = formik.values.contact;
    handleSentOTPConfirm(formik.values.contact,otp)
    
  }

  const handleCloseDialog = () => {
    setOpen(false);
    handleClose();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
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
      handleSnackbarOpen('Đăng ký thành công!', 'success');
    }
  });

  return (
    <>
      <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <SnackbarContent
            onClose={handleSnackbarClose}
            message={snackbarMessage}
            action={
              <IconButton size="small" color="inherit" onClick={handleSnackbarClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            }
            sx={{ backgroundColor: snackbarSeverity === 'success' ? '#43a047' : '#d32f2f' }}
          />
        </Snackbar>
      
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

        {otpError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {otpError}
          </Alert>
        )}

        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Nhập số điện thoại hoặc email"
            fullWidth
            margin="normal"
            name="contact"
            value={formik.values.contact}
            onChange={formik.handleChange}
            error={formik.touched.contact && Boolean(formik.errors.contact)}
            helperText={formik.touched.contact && formik.errors.contact}
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
                onClick={handleSentOtpConfirm}
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
                margin='normal'
                error={formikPersonalInfo.touched.name && Boolean(formikPersonalInfo.errors.name)}
                helperText={formikPersonalInfo.touched.name && formikPersonalInfo.errors.name}
              />
              <TextField
                label="Email"
                variant="outlined"
                name="email"
                margin='normal'

                value={formikPersonalInfo.values.email}
                onChange={formikPersonalInfo.handleChange}
                fullWidth
                required
                error={formikPersonalInfo.touched.email && Boolean(formikPersonalInfo.errors.email)}
                helperText={formikPersonalInfo.touched.email && formikPersonalInfo.errors.email}
              />
              <TextField
                label="Ngày sinh"
                variant="outlined"
                type="date"
                name="dob"
                margin='normal'

                value={formikPersonalInfo.values.dob}
                onChange={formikPersonalInfo.handleChange}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
                error={formikPersonalInfo.touched.dob && Boolean(formikPersonalInfo.errors.dob)}
                helperText={formikPersonalInfo.touched.dob && formikPersonalInfo.errors.dob}
              />
              <TextField
                label="Giới tính"
                variant="outlined"
                select
                name="gender"
                margin='normal'

                value={formikPersonalInfo.values.gender}
                onChange={formikPersonalInfo.handleChange}
                fullWidth
                required
                error={formikPersonalInfo.touched.gender && Boolean(formikPersonalInfo.errors.gender)}
                helperText={formikPersonalInfo.touched.gender && formikPersonalInfo.errors.gender}
              >
                <MenuItem value="male">Nam</MenuItem>
                <MenuItem value="female">Nữ</MenuItem>
                <MenuItem value="other">Khác</MenuItem>
              </TextField>
              <TextField
                label="Địa chỉ"
                variant="outlined"
                name="address"
                margin='normal'

                value={formikPersonalInfo.values.address}
                onChange={formikPersonalInfo.handleChange}
                fullWidth
                required
                error={formikPersonalInfo.touched.address && Boolean(formikPersonalInfo.errors.address)}
                helperText={formikPersonalInfo.touched.address && formikPersonalInfo.errors.address}
              />
              <TextField
                label="Mật khẩu"
                variant="outlined"
                type="password"
                name="password"
                margin='normal'

                value={formikPersonalInfo.values.password}
                onChange={formikPersonalInfo.handleChange}
                fullWidth
                required
                error={formikPersonalInfo.touched.password && Boolean(formikPersonalInfo.errors.password)}
                helperText={formikPersonalInfo.touched.password && formikPersonalInfo.errors.password}
              />
              <TextField
                label="Nhập lại mật khẩu"
                variant="outlined"
                type="password"
                name="repassword"
                margin='normal'

                value={formikPersonalInfo.values.repassword}
                onChange={formikPersonalInfo.handleChange}
                fullWidth
                required
                error={formikPersonalInfo.touched.repassword && Boolean(formikPersonalInfo.errors.repassword)}
                helperText={formikPersonalInfo.touched.repassword && formikPersonalInfo.errors.repassword}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Hoàn tất đăng ký
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

      
      </Box>
    </Modal>
    </>
  );
};

export default RegisterForm;
