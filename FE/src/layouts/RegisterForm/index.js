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
import { handleReceiveOTPForEmail, handleRegisterForEmail, handleSentOTPConfirmForEmail, RegisterCompleteForm } from '../../services/Authentication';

// Schema validation for OTP form
const otpValidationSchema = yup.object({
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

// Schema validation for personal information form
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
  phone: yup.string('Nhập số điện thoại').required('Số điện thoại là bắt buộc'),
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
  const [registrationData, setRegistrationData] = useState(null);
  const [email, setEmail] = useState('');
  const [savedEmail, setSavedEmail] = useState('');
  const [savedPhone, setSavedPhone] = useState('');

  // Start the timer and update it every second
  const startTimer = () => {
    setTimer(60);
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    console.log('Saved Email:', savedEmail);
    console.log('Saved Phone:', savedPhone);
    formikPersonalInfo.setValues({
      ...formikPersonalInfo.values,
      email: savedEmail,
      phone: savedPhone,
    });
  }, [savedEmail, savedPhone]);
  
  const formikOTP = useFormik({
    initialValues: {
      contact: '',
      otp: '',
    },
    validationSchema: otpValidationSchema,
    onSubmit: async (values) => {
      if (values.otp !== otpReceived) {
        setOtpError('Mã OTP không chính xác');
        return;
      }
      setOtpError('');
      setOpen(true);
    },
  });
  const handleSendOtp = async () => {
    const contact = formikOTP.values.contact;
    const isPhoneNumber = /^(0\d{9,10})$/.test(contact);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  
    if (!isPhoneNumber && !isEmail) {
      setOtpError('Vui lòng nhập thông tin liên hệ hợp lệ trước khi yêu cầu mã OTP.');
      return;
    }
  
    try {
      const response = await fetch(`https://localhost:7240/api/Authentication/Check/check/${encodeURIComponent(contact)}`);
      const result = await response.json();
  
      if (result.exists) {
        setSnackbarMessage(`Thông tin liên hệ ${contact} đã tồn tại`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
  
      if (isEmail) {
        setSavedEmail(contact); // Set savedEmail
        console.log("La email")
        const otp = await handleReceiveOTPForEmail(contact);
        setOtpReceived(otp);
        setEmail(contact);
        setSnackbarMessage('Đã gửi thành công mã OTP');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        console.log("La email111")

        setSavedPhone(contact); // Set savedPhone
        console.log('Gửi OTP đến số điện thoại:', contact);
      }
  
      setOtpSent(true);
      setOtpError('');
      startTimer();  // Start the timer when OTP is sent
      setContactForDialog(contact);
  
    } catch (error) {
      console.error('Error receiving OTP:', error);
      setOtpError('Đã xảy ra lỗi khi nhận OTP. Vui lòng thử lại sau.');
    }
  };
  


  const handleSentOtpConfirm = () => {
    const otp = formikOTP.values.otp;
    const contact = formikOTP.values.contact;
    handleSentOTPConfirmForEmail(contact, otp);
  };

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

  const formikPersonalInfo = useFormik({
    initialValues: {
      name: '',
      email: '',  // These will be set by useEffect
      dob: '',
      gender: '',
      address: '',
      phone: '',  // These will be set by useEffect
      password: '',
      repassword: '',
    },
    validationSchema: personalInfoSchema,
    onSubmit: (values) => {
      const registrationDetails = {
        Name: values.name,
        email: values.email,
        dob: values.dob,
        Gender: values.gender,
        address: values.address,
      phone: values.phone,
        password: values.password,
      };
      const getPhone=values.phone;

      console.log('Thông tin đăng ký hoàn tất:', registrationDetails);
      setRegistrationData(registrationDetails);
      RegisterCompleteForm(registrationDetails,getPhone)
        .then(() => {
          handleCloseDialog();
          handleSnackbarOpen('Đăng ký thành công!', 'success');
        })
        .catch((error) => {
          console.log(error + " day la error");
          handleSnackbarOpen(`Đăng ký thất bại: ${error.message}`, 'error');
        });
    },
  });
  


  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer(prevTimer => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [timer]);

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

          <Box component="form" onSubmit={formikOTP.handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label="Nhập số điện thoại hoặc email"
              fullWidth
              margin="normal"
              name="contact"
              value={formikOTP.values.contact}
              onChange={formikOTP.handleChange}
              error={formikOTP.touched.contact && Boolean(formikOTP.errors.contact)}
              helperText={formikOTP.touched.contact && formikOTP.errors.contact}
            />
            {otpSent ? (
              <>
                <TextField
                  label="Nhập mã OTP"
                  fullWidth
                  margin="normal"
                  name="otp"
                  value={formikOTP.values.otp}
                  onChange={formikOTP.handleChange}
                  error={formikOTP.touched.otp && Boolean(formikOTP.errors.otp)}
                  helperText={formikOTP.touched.otp && formikOTP.errors.otp}
                />
                <Typography variant="caption" color="textSecondary">
                  Thời gian còn lại: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleSentOtpConfirm}
                  disabled={timer === 0}  // Disable if timer is 0
                >
                  Xác nhận OTP
                </Button>
                {timer === 0 && (
                  <Button
                    variant="text"
                    onClick={handleSendOtp}
                    sx={{ mt: 2 }}
                  >
                    Gửi lại mã OTP
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                type="button"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleSendOtp}
              >
                Gửi mã OTP
              </Button>
            )}
          </Box>
        </Box>
      </Modal>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Xác nhận thông tin</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Vui lòng xác nhận thông tin cá nhân của bạn.
          </DialogContentText>
          <Box component="form" onSubmit={formikPersonalInfo.handleSubmit}>
            <TextField
              label="Tên"
              fullWidth
              margin="normal"
              name="name"
              value={formikPersonalInfo.values.name}
              onChange={formikPersonalInfo.handleChange}
              error={formikPersonalInfo.touched.name && Boolean(formikPersonalInfo.errors.name)}
              helperText={formikPersonalInfo.touched.name && formikPersonalInfo.errors.name}
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              name="email"
              value={formikPersonalInfo.values.email}
              onChange={formikPersonalInfo.handleChange}
              error={formikPersonalInfo.touched.email && Boolean(formikPersonalInfo.errors.email)}
              helperText={formikPersonalInfo.touched.email && formikPersonalInfo.errors.email}
              disabled={Boolean(savedEmail)}  // Disable if savedEmail is not empty
            />
            <TextField
              label="Số điện thoại"
              fullWidth
              margin="normal"
              name="phone"
              value={formikPersonalInfo.values.phone}
              onChange={formikPersonalInfo.handleChange}
              error={formikPersonalInfo.touched.phone && Boolean(formikPersonalInfo.errors.phone)}
              helperText={formikPersonalInfo.touched.phone && formikPersonalInfo.errors.phone}
              disabled={Boolean(savedPhone)}  // Disable if savedPhone is not empty
            />

            <TextField
              label="Ngày sinh"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              name="dob"
              value={formikPersonalInfo.values.dob}
              onChange={formikPersonalInfo.handleChange}
              error={formikPersonalInfo.touched.dob && Boolean(formikPersonalInfo.errors.dob)}
              helperText={formikPersonalInfo.touched.dob && formikPersonalInfo.errors.dob}
            />
            <TextField
              label="Giới tính"
              select
              fullWidth
              margin="normal"
              name="gender"
              value={formikPersonalInfo.values.gender}
              onChange={formikPersonalInfo.handleChange}
              error={formikPersonalInfo.touched.gender && Boolean(formikPersonalInfo.errors.gender)}
              helperText={formikPersonalInfo.touched.gender && formikPersonalInfo.errors.gender}
            >
              <MenuItem value="Male">Nam</MenuItem>
              <MenuItem value="Female">Nữ</MenuItem>
              <MenuItem value="Other">Khác</MenuItem>
            </TextField>
            <TextField
              label="Địa chỉ"
              fullWidth
              margin="normal"
              name="address"
              value={formikPersonalInfo.values.address}
              onChange={formikPersonalInfo.handleChange}
              error={formikPersonalInfo.touched.address && Boolean(formikPersonalInfo.errors.address)}
              helperText={formikPersonalInfo.touched.address && formikPersonalInfo.errors.address}
            />

            <TextField
              label="Mật khẩu"
              type="password"
              fullWidth
              margin="normal"
              name="password"
              value={formikPersonalInfo.values.password}
              onChange={formikPersonalInfo.handleChange}
              error={formikPersonalInfo.touched.password && Boolean(formikPersonalInfo.errors.password)}
              helperText={formikPersonalInfo.touched.password && formikPersonalInfo.errors.password}
            />
            <TextField
              label="Xác nhận mật khẩu"
              type="password"
              fullWidth
              margin="normal"
              name="repassword"
              value={formikPersonalInfo.values.repassword}
              onChange={formikPersonalInfo.handleChange}
              error={formikPersonalInfo.touched.repassword && Boolean(formikPersonalInfo.errors.repassword)}
              helperText={formikPersonalInfo.touched.repassword && formikPersonalInfo.errors.repassword}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: 2 }}
            >
              Đăng ký
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegisterForm;
