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
  MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  phoneNumber: yup
    .string('Nhập số điện thoại')
    .matches(/^(0\d{9,10})$/, 'Số điện thoại phải có 10 ký tự và bắt đầu bằng số 0')
    .required('Số điện thoại là bắt buộc'),
  otp: yup
    .string('Nhập mã OTP')
    .matches(/^\d{6}$/, 'Mã OTP phải có 6 chữ số')
    .required('Mã OTP là bắt buộc')
});

const RegisterForm = ({ show, handleClose }) => {
  const [otpError, setOtpError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [open, setOpen] = useState(false);
  const [otpExpired, setOtpExpired] = useState(true);
  const [personalOtpSent, setPersonalOtpSent] = useState(false);
  const [personalOtpExpired, setPersonalOtpExpired] = useState(true);
  const [personalOtpError, setPersonalOtpError] = useState('');
  const [personalOtp, setPersonalOtp] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    address: '',
    email: '',
    emailOtp: ''
  });

  useEffect(() => {
    let timer;
    if (!otpExpired) {
      timer = setTimeout(() => {
        setOtpExpired(true);
      }, 60000); // 60,000 milliseconds = 1 minute
    }
    return () => clearTimeout(timer);
  }, [otpExpired]);

  useEffect(() => {
    let timer;
    if (!personalOtpExpired) {
      timer = setTimeout(() => {
        setPersonalOtpExpired(true);
      }, 60000); // 60,000 milliseconds = 1 minute
    }
    return () => clearTimeout(timer);
  }, [personalOtpExpired]);

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      phoneNumber: '',
      otp: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Giả sử OTP chính xác nếu mã là '123456'
      if (values.otp !== '123456') {
        setOtpError('Mã OTP không chính xác');
        return;
      }
      setOtpError('');
      setOpen(true);
      setOtpExpired(false);
    }
  });

  const handleSendOtp = () => {
    if (!validationSchema.fields.phoneNumber.isValidSync(formik.values.phoneNumber)) {
      setOtpError('Vui lòng nhập số điện thoại hợp lệ trước khi yêu cầu mã OTP.');
      return;
    }

    console.log('Gửi OTP đến số điện thoại:', formik.values.phoneNumber);
    setOtpSent(true);
    setOtpError(''); // Xóa lỗi OTP trước đó nếu có
  };

  const handleResendOtp = () => {
    setOtpSent(false);
    setOtpExpired(true);
    formik.resetForm();
  };

  const handleSendPersonalOtp = () => {
    if (!validateEmail(formData.email)) {
      setPersonalOtpError('Vui lòng nhập địa chỉ email hợp lệ trước khi yêu cầu mã OTP.');
      return;
    }

    console.log('Gửi OTP đến email:', formData.email);
    setPersonalOtpSent(true);
    setPersonalOtpError(''); // Xóa lỗi OTP trước đó nếu có
    setPersonalOtpExpired(false);
  };

  const handleResendPersonalOtp = () => {
    setPersonalOtpSent(false);
    setPersonalOtpExpired(true);
    setFormData({ ...formData, emailOtp: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateName = (name) => {
    return /^[a-zA-ZÀ-ỹ ]+$/.test(name);
  };

  const validateEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Kiểm tra tên có chứa chữ cái và không rỗng
    if (!validateName(formData.name)) {
      alert('Vui lòng nhập tên hợp lệ.');
      return;
    }
    // Kiểm tra email hợp lệ
    if (!validateEmail(formData.email)) {
      alert('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    // Kiểm tra OTP email
    if (formData.emailOtp !== '654321') {
      alert('Mã OTP không chính xác.');
      return;
    }
    console.log('Dữ liệu form:', formData);
    // Đóng popup sau khi gửi thông tin
    handleCloseDialog();
  };

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

          {!otpSent && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendOtp}
              fullWidth
              sx={{ mt: 2 }}
            >
              Gửi mã OTP
            </Button>
          )}

          {otpSent && otpExpired && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleResendOtp}
              fullWidth
              sx={{ mt: 2 }}
            >
              Gửi lại OTP
            </Button>
          )}

          {formik.dirty && formik.isValid && !otpExpired && (
            <React.Fragment>
              <TextField
                label="Mã OTP"
                fullWidth
                margin="normal"
                name="otp"
                value={formik.values.otp}
                onChange={formik.handleChange}
                error={formik.touched.otp && Boolean(formik.errors.otp)}
                helperText={formik.touched.otp && formik.errors.otp}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Xác nhận
              </Button>
            </React.Fragment>
          )}
        </Box>

        <Dialog open={open} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
          <Box className="dialog-close-btn">
            <IconButton onClick={handleCloseDialog} color="inherit">
              <CloseIcon />
            </IconButton>
          </Box>
          <DialogTitle>Xác Minh Thành Công</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn đã xác minh OTP thành công. Vui lòng nhập thông tin cá nhân để hoàn tất quá trình.
            </DialogContentText>
            <Box component="form" onSubmit={handleFormSubmit} className="form-container">
              <TextField
                label="Tên"
                variant="outlined"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                error={formData.name && !validateName(formData.name)}
                helperText={formData.name && !validateName(formData.name) ? 'Tên chỉ được chứa các ký tự chữ cái.' : ''}
                sx={{ mb: 2 }}
              />
                            <TextField
                label="Email"
                variant="outlined"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                error={formData.email && !validateEmail(formData.email)}
                helperText={formData.email && !validateEmail(formData.email) ? 'Vui lòng nhập địa chỉ email hợp lệ.' : ''}
                sx={{ mb: 2 }}
              />

              {personalOtpError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {personalOtpError}
                </Alert>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  label="Mã OTP Email"
                  variant="outlined"
                  name="emailOtp"
                  value={formData.emailOtp}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{ mr: 1 }}
                  error={formData.emailOtp && formData.emailOtp !== '654321'}
                  helperText={formData.emailOtp && formData.emailOtp !== '654321' ? 'Mã OTP không chính xác.' : ''}
                />
                {!personalOtpSent && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendPersonalOtp}
                    sx={{ minWidth: '120px' }}
                  >
                    Gửi mã OTP
                  </Button>
                )}
                {personalOtpSent && personalOtpExpired && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleResendPersonalOtp}
                    sx={{ minWidth: '120px' }}
                  >
                    Gửi lại OTP
                  </Button>
                )}
              </Box>

              <TextField
                label="Ngày sinh"
                type="date"
                variant="outlined"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Giới tính"
                select
                variant="outlined"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              >
                <MenuItem value="male">Nam</MenuItem>
                <MenuItem value="female">Nữ</MenuItem>
              </TextField>
              <TextField
                label="Địa chỉ"
                variant="outlined"
                name="address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Gửi
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </Modal>
  );
};

export default RegisterForm;

