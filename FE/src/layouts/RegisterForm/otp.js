import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Box, Typography, Dialog, DialogContent, DialogContentText, DialogTitle,
    MenuItem, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import '../../assets/css/otp.css';

const OTPForm = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [open, setOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        gender: '',
        address: '',
        email: ''
    });
    const [phoneNumberEditable, setPhoneNumberEditable] = useState(true); // State để quản lý tính editable của số điện thoại
    const [otpTimeRemaining, setOtpTimeRemaining] = useState(15); // Thêm state mới để đếm ngược thời gian
    let timeoutRef = null; // Biến tham chiếu để lưu trữ timeoutId
    const validatePhoneNumber = (phoneNumber) => {
        return /^(0\d{9,10})$/.test(phoneNumber);
    };
    const validateName = (name) => {
        // Biểu thức chính quy cho phép chữ cái tiếng Việt, khoảng trắng và dấu gạch ngang
        return /^[a-zA-ZÀ-ỹ ]+$/.test(name);
    };
    const validateEmail = (email) => {
        // Biểu thức chính quy cho phép địa chỉ email hợp lệ
        return /^\S+@\S+\.\S+$/.test(email);
    };
    const handleSendOtp = () => {
        if (!validatePhoneNumber(phoneNumber)) {
            alert('Vui lòng nhập số điện thoại hợp lệ của Việt Nam.');
            return;
        }
        // Giả sử OTP luôn được gửi thành công mà không kiểm tra số điện thoại
        console.log('Gửi OTP đến số điện thoại:', phoneNumber);
        setOtpSent(true);
        setPhoneNumberEditable(false); // Sau khi nhận OTP thành công, disable phần nhập số điện thoại
        // Khởi tạo đếm ngược thời gian
        setOtpTimeRemaining(15); // Reset thời gian còn lại về 60 giây
        // Xoá timeout trước đó nếu tồn tại
        if (timeoutRef) {
            clearTimeout(timeoutRef);
        }
        // Bắt đầu đếm ngược
        timeoutRef = setTimeout(() => {
            handleOtpExpired();
        }, 15000); // 60 giây = 60000 mili giây
    };
    const handleOtpExpired = () => {
        setOtpSent(false);
        setOtp('');
        setPhoneNumberEditable(true);
        alert('Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.');
    };
    const handleVerifyOtp = () => {
        if (!/^\d{6}$/.test(otp)) {
            setOtpError('Mã OTP không hợp lệ. Vui lòng nhập đúng định dạng (6 chữ số).');
            return;
        }
        console.log('Xác minh OTP:', otp);
        setOtpError('');
        setIsFormOpen(true);
        setOpen(true);
        setOtpTimeRemaining(15); // Reset thời gian còn lại của OTP về 15 giây
    };
    const handleClose = () => {
        setOpen(false);
        setIsFormOpen(false);
        setOtpTimeRemaining(15);
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
        console.log('Dữ liệu form:', formData);
        // Đóng popup sau khi gửi thông tin
        handleClose();
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phoneNumber') {
            // Kiểm tra và set lỗi cho số điện thoại
            setPhoneNumber(value);
        } else {
            // Các trường dữ liệu khác không cần kiểm tra lỗi
            setFormData({ ...formData, [name]: value });
        }
    };
    useEffect(() => {
        let interval = null;
        if (otpSent && otpTimeRemaining > 0 && !isFormOpen) {
            interval = setInterval(() => {
                setOtpTimeRemaining((prevTime) => prevTime - 1);
            }, 1000); // Cập nhật mỗi giây
        } else if (otpTimeRemaining === 0 && !isFormOpen) {
            handleOtpExpired();
        }
        return () => {
            clearInterval(interval);
        };
    }, [otpSent, otpTimeRemaining, isFormOpen]);
    document.title = "Đăng ký" //set title
    return (
        <Box className="otp-form-container">
            <Typography variant="h6" gutterBottom>
                Nhập OTP
            </Typography>
            <Box className="phone-number-section">
                <TextField
                    label="Số điện thoại"
                    type="tel"
                    variant="outlined"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={handleChange}
                    fullWidth
                    error={phoneNumber && !validatePhoneNumber(phoneNumber)}
                    helperText={phoneNumber && !validatePhoneNumber(phoneNumber) ? 'Vui lòng nhập số điện thoại hợp lệ của Việt Nam.' : ''}
                    disabled={!phoneNumberEditable}
                />
                {!otpSent && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendOtp}
                        className="send-otp-btn"
                    >
                        Nhận OTP
                    </Button>
                )}
            </Box>
            {otpSent && (
                <Box className="otp-section">
                    <Typography variant="body2" className="time-remaining">
                        Thời gian còn lại: {otpTimeRemaining} giây
                    </Typography>
                    <TextField
                        label="Mã OTP"
                        variant="outlined"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        error={!!otpError}
                        helperText={otpError}
                        fullWidth
                        className="otp-input"
                    />
                    <Button variant="contained" color="primary" onClick={handleVerifyOtp} className="verify-otp-btn">
                        Gửi mã OTP
                    </Button>
                </Box>
            )}
            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                <Box className="dialog-close-btn">
                    <IconButton onClick={handleClose} color="inherit">
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
    );
};
export default OTPForm;