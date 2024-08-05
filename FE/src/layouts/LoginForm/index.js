// import React, { useState, useContext } from 'react';
// import { Modal, Box, Button, TextField, Typography, Alert, IconButton, Checkbox, FormControlLabel, Snackbar } from '@mui/material';
// import { Visibility, VisibilityOff, Close } from '@mui/icons-material';
// import { useFormik } from 'formik';
// import * as yup from 'yup';
// import google_icon from '../../assets/images/google.png';
// import '../LoginForm/LoginForm.css';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../utils/AuthContext'; // Adjust this path as needed

// const validationSchema = yup.object({
//   identifier: yup
//     .string('Nhập số điện thoại hoặc email')
//     .test('isValidEmailOrPhone', 'Số điện thoại hoặc email không hợp lệ', value => {
//       const phoneRegExp = /^[0-9]{10}$/;
//       const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       return phoneRegExp.test(value) || emailRegExp.test(value);
//     })
//     .required('Số điện thoại hoặc email là bắt buộc'),
//   password: yup
//     .string('Nhập mật khẩu')
//     .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
//     .required('Mật khẩu là bắt buộc')
// });

// const LoginForm = ({ show, handleClose, handleLogin, handleRegister }) => {
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();
//   const { isLoggedIn, token, updateToken, logout, role } = useContext(AuthContext);

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   });

//   const handleSnackbarClose = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setSnackbar({ ...snackbar, open: false });
//   };

//   const formik = useFormik({
//     initialValues: {
//       identifier: '',
//       password: '',
//     },
//     validationSchema: validationSchema,
//     onSubmit: async (values) => {
//       setLoading(true);
//       try {
//         const result = await handleLogin({ username: values.identifier, password: values.password });
//         if (result.success) {
//           formik.resetForm();
//           setSnackbar({ open: true, message: 'Đăng nhập thành công', severity: 'success' });
//           handleClose(); // Close modal after successful login

//           // Perform role-based navigation
//           const role = localStorage.getItem('role');
//           if (role === 'Admin') {
//             navigate('/admin/dashboard/doctor-account', { replace: true });
//           } else if (role === 'ArticleManager') {
//             navigate('/article/dashboard', { replace: true });
//           } else if (role === 'Receptionist') {
//             navigate('/receptionist/dashboard/', { replace: true });
//           } else if (role === 'Doctor') {
//             navigate('/doctor/dasboard/', { replace: true });
//           } else {
//             navigate('/', { replace: true });
//           }
//         } else {
//           setSnackbar({ open: true, message: result.message, severity: 'error' });
//         }
//       } catch (error) {
//         console.error('Login error:', error);
//         setSnackbar({ open: true, message: 'Đăng nhập thất bại: Đã xảy ra lỗi khi đăng nhập', severity: 'error' });
//       } finally {
//         setLoading(false);
//       }
//     }
//   });

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <>
//       <Modal open={show} onClose={handleClose}>
//         <Box sx={{
//           position: 'absolute',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           width: 400,
//           bgcolor: 'background.paper',
//           boxShadow: 24,
//           p: 4,
//           borderRadius: 1,
//         }}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//             <Typography variant="h6" className='login-text-label'>Đăng nhập</Typography>
//             <IconButton onClick={handleClose}>
//               <Close />
//             </IconButton>
//           </Box>
//           <Typography variant="body2" gutterBottom>
//             Bạn chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
//           </Typography>
//           <form onSubmit={formik.handleSubmit}>
//             <TextField
//               label="Nhập số điện thoại hoặc email"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               name="identifier"
//               value={formik.values.identifier}
//               onChange={formik.handleChange}
//               error={formik.touched.identifier && Boolean(formik.errors.identifier)}
//               helperText={formik.touched.identifier && formik.errors.identifier}
//             />
//             <TextField
//               label="Mật khẩu"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               name="password"
//               type={showPassword ? "text" : "password"}
//               value={formik.values.password}
//               onChange={formik.handleChange}
//               error={formik.touched.password && Boolean(formik.errors.password)}
//               helperText={formik.touched.password && formik.errors.password}
//               InputProps={{
//                 endAdornment: (
//                   <IconButton onClick={togglePasswordVisibility}>
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 ),
//               }}
//             />
//             <FormControlLabel
//               control={<Checkbox checked={showPassword} onChange={togglePasswordVisibility} />}
//               label="Hiển thị mật khẩu"
//             />
//             <Box sx={{ textAlign: 'center', my: 2 }}>
//               <Typography variant="body2">Hoặc đăng nhập bằng</Typography>
//             </Box>
//             <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
//               <Button variant="outlined" startIcon={<img src={google_icon} alt="Google" className='google_icon' />} href="/identity/externallogin/?provider=Google">
//                 Google
//               </Button>
//             </Box>
//             <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
//               {loading ? 'Đang xử lý...' : 'Đăng nhập'}
//             </Button>
//           </form>
//         </Box>
//       </Modal>
//       <Snackbar
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleSnackbarClose}
//       >
//         <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// };

// export default LoginForm;
// import React, { useState, useContext, useEffect } from 'react';
// import { Modal, Box, Button, TextField, Typography, Alert, IconButton, Checkbox, FormControlLabel, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// import { Visibility, VisibilityOff, Close } from '@mui/icons-material';
// import { useFormik } from 'formik';
// import * as yup from 'yup';
// import google_icon from '../../assets/images/google.png';
// import '../LoginForm/LoginForm.css';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../utils/AuthContext'; // Adjust this path as needed
// const validationSchema = yup.object({
//   identifier: yup
//     .string('Nhập số điện thoại hoặc email')
//     .test('isValidEmailOrPhone', 'Số điện thoại hoặc email không hợp lệ', value => {
//       const phoneRegExp = /^[0-9]{10}$/;
//       const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       return phoneRegExp.test(value) || emailRegExp.test(value);
//     })
//     .required('Số điện thoại hoặc email là bắt buộc'),
//   password: yup
//     .string('Nhập mật khẩu')
//     .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
//     .required('Mật khẩu là bắt buộc')
// });

// const LoginForm = ({ show, handleClose, handleLogin, handleRegister }) => {
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();
//   const { isLoggedIn, token, updateToken, logout, role } = useContext(AuthContext);

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   });

//   const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
//   const [feedback, setFeedback] = useState({ content: '', star: 0 });

//   const handleSnackbarClose = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setSnackbar({ ...snackbar, open: false });
//   };

//   const formik = useFormik({
//     initialValues: {
//       identifier: '',
//       password: '',
//     },
//     validationSchema: validationSchema,
//     onSubmit: async (values) => {
//       setLoading(true);
//       try {
//         const result = await handleLogin({ username: values.identifier, password: values.password });
//         if (result.success) {
//           formik.resetForm();
//           setSnackbar({ open: true, message: 'Đăng nhập thành công', severity: 'success' });
//           handleClose(); // Close modal after successful login

//           // Perform role-based navigation
//           const role = localStorage.getItem('role');
//           const check = localStorage.getItem('check');
//           if (role === 'Admin') {
//             navigate('/admin/dashboard/doctor-account', { replace: true });
//           } else if (role === 'ArticleManager') {
//             navigate('/article/dashboard', { replace: true });
//           } else if (role === 'Receptionist') {
//             navigate('/receptionist/dashboard/', { replace: true });
//           } else if (role === 'Doctor') {
//             navigate('/doctor/dasboard/', { replace: true });
//           } else {
//             if (role === 'Patient' && check === '3') {
//               setShowFeedbackDialog(true);
//             } else {
//               navigate('/', { replace: true });
//             }
//           }
//         } else {
//           setSnackbar({ open: true, message: result.message, severity: 'error' });
//         }
//       } catch (error) {
//         console.error('Login error:', error);
//         setSnackbar({ open: true, message: 'Đăng nhập thất bại: Đã xảy ra lỗi khi đăng nhập', severity: 'error' });
//       } finally {
//         setLoading(false);
//       }
//     }
//   });

//   useEffect(() => {
//     const role = localStorage.getItem('role');
//     const check = localStorage.getItem('check');
//     if (role === 'Patient' && check === '3') {
//       setShowFeedbackDialog(true);
//     }
//   }, []);

//   const handleFeedbackSubmit = () => {
//     // Thực hiện logic gửi feedback ở đây
//     console.log('Feedback:', feedback);
//     // Đóng dialog sau khi gửi feedback
//     setShowFeedbackDialog(false);
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <>
//       <Modal open={show} onClose={handleClose}>
//         <Box sx={{
//           position: 'absolute',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           width: 400,
//           bgcolor: 'background.paper',
//           boxShadow: 24,
//           p: 4,
//           borderRadius: 1,
//         }}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//             <Typography variant="h6" className='login-text-label'>Đăng nhập</Typography>
//             <IconButton onClick={handleClose}>
//               <Close />
//             </IconButton>
//           </Box>
//           <Typography variant="body2" gutterBottom>
//             Bạn chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
//           </Typography>
//           <form onSubmit={formik.handleSubmit}>
//             <TextField
//               label="Nhập số điện thoại hoặc email"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               name="identifier"
//               value={formik.values.identifier}
//               onChange={formik.handleChange}
//               error={formik.touched.identifier && Boolean(formik.errors.identifier)}
//               helperText={formik.touched.identifier && formik.errors.identifier}
//             />
//             <TextField
//               label="Mật khẩu"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               name="password"
//               type={showPassword ? "text" : "password"}
//               value={formik.values.password}
//               onChange={formik.handleChange}
//               error={formik.touched.password && Boolean(formik.errors.password)}
//               helperText={formik.touched.password && formik.errors.password}
//               InputProps={{
//                 endAdornment: (
//                   <IconButton onClick={togglePasswordVisibility}>
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 ),
//               }}
//             />
//             <FormControlLabel
//               control={<Checkbox checked={showPassword} onChange={togglePasswordVisibility} />}
//               label="Hiển thị mật khẩu"
//             />
//             <Box sx={{ textAlign: 'center', my: 2 }}>
//               <Typography variant="body2">Hoặc đăng nhập bằng</Typography>
//             </Box>
//             <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
//               <Button variant="outlined" startIcon={<img src={google_icon} alt="Google" className='google_icon' />} href="/identity/externallogin/?provider=Google">
//                 Google
//               </Button>
//             </Box>
//             <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
//               {loading ? 'Đang xử lý...' : 'Đăng nhập'}
//             </Button>
//           </form>
//         </Box>
//       </Modal>
//       <Snackbar
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleSnackbarClose}
//       >
//         <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//       <Dialog open={showFeedbackDialog} onClose={() => {}} aria-labelledby="feedback-dialog-title">
//         <DialogTitle id="feedback-dialog-title">Gửi phản hồi</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Nội dung"
//             type="text"
//             fullWidth
//             value={feedback.content}
//             onChange={(e) => setFeedback({ ...feedback, content: e.target.value })}
//           />
//           <TextField
//             margin="dense"
//             label="Số sao"
//             type="number"
//             fullWidth
//             value={feedback.star}
//             onChange={(e) => setFeedback({ ...feedback, star: e.target.value })}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleFeedbackSubmit} color="primary">Lưu</Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default LoginForm;



///////
import React, { useState, useContext, useEffect } from 'react';
import { Modal, Box, Button, TextField, Typography, Alert, IconButton, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Visibility, VisibilityOff, Close } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import google_icon from '../../assets/images/google.png';
import '../LoginForm/LoginForm.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext';
import { createFeedback } from '../../services/Authentication';
import { Rating } from '@mui/material';
import RegisterForm from '../RegisterForm/index'; // Import RegisterForm

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

const LoginForm = ({ show, handleClose, handleLogin }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false); // Add state for RegisterForm visibility
  const navigate = useNavigate();
  const { isLoggedIn, token, updateToken, logout, role } = useContext(AuthContext);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedback, setFeedback] = useState({ content: '', star: 0 });

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const formik = useFormik({
    initialValues: {
      identifier: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const result = await handleLogin({ username: values.identifier, password: values.password });
        if (result.success) {
          formik.resetForm();
          setSnackbar({ open: true, message: 'Đăng nhập thành công', severity: 'success' });
          handleClose(); // Close modal after successful login

          // Perform role-based navigation
          const role = localStorage.getItem('role');
          const check = localStorage.getItem('check');
          if (role === 'Admin') {
            navigate('/admin/dashboard/doctor-account', { replace: true });
          } else if (role === 'ArticleManager') {
            navigate('/article/dashboard', { replace: true });
          } else if (role === 'Receptionist') {
            navigate('/receptionist/dashboard/', { replace: true });
          } else if (role === 'Doctor') {
            navigate('/doctor/dasboard/', { replace: true });
          } else {
            if (role === 'Patient' && check === '3') {
              setShowFeedbackDialog(true);
            } else {
              navigate('/', { replace: true });
            }
          }
        } else {
          setSnackbar({ open: true, message: result.message, severity: 'error' });
        }
      } catch (error) {
        console.error('Login error:', error);
        setSnackbar({ open: true, message: 'Đăng nhập thất bại: Đã xảy ra lỗi khi đăng nhập', severity: 'error' });
      } finally {
        setLoading(false);
      }
    }
  });

  useEffect(() => {
    const role = localStorage.getItem('role');
    const check = localStorage.getItem('check');
    if (role === 'Patient' && check === '3') {
      setShowFeedbackDialog(true);
    }
  }, []);

  const handleFeedbackSubmit = async () => {
    const pid = localStorage.getItem('accountId'); // Lấy pid từ localStorage

    if (!pid) {
      setSnackbar({ open: true, message: 'Không tìm thấy ID bệnh nhân', severity: 'error' });
      return;
    }

    try {
      const result = await createFeedback(feedback, pid);
      setSnackbar({ open: true, message: 'Phản hồi đã được gửi thành công', severity: 'success' });

      // Reset feedback form
      setFeedback({ content: '', star: 0 });

      // Cập nhật giá trị check trong localStorage
      localStorage.setItem('check', '2');

      // Đóng dialog sau khi gửi phản hồi
      setTimeout(() => {
        setShowFeedbackDialog(false);
      }, 500); // Delay nhỏ để đảm bảo trạng thái được cập nhật
    } catch (error) {
      setSnackbar({ open: true, message: 'Gửi phản hồi thất bại: Đã xảy ra lỗi', severity: 'error' });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handler to open RegisterForm dialog
  const handleRegisterClick = () => {
    setShowRegisterForm(true);
    handleClose(); // Close LoginForm when RegisterForm opens
  };

  return (
    <>
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
          <Typography variant="body2" gutterBottom>
            Bạn chưa có tài khoản? <Button onClick={handleRegisterClick} color="primary">Đăng ký ngay</Button>
          </Typography>
          <a variant="body2" style={{textDecoration:'none',textAlign:'center'}} gutterBottom href='/forgotPassword' >
           Quên mật khẩu
          </a>
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

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={showFeedbackDialog} onClose={() => setShowFeedbackDialog(false)}>
        <DialogTitle>Gửi phản hồi</DialogTitle>
        <DialogContent>
          <TextField
            label="Nội dung phản hồi"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={feedback.content}
            onChange={(e) => setFeedback({ ...feedback, content: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Rating
            name="feedback-star"
            value={feedback.star}
            onChange={(e, newValue) => setFeedback({ ...feedback, star: newValue })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFeedbackDialog(false)}>Hủy</Button>
          <Button onClick={handleFeedbackSubmit}>Gửi</Button>
        </DialogActions>
      </Dialog>

      {/* Add RegisterForm component */}
      <RegisterForm show={showRegisterForm} handleClose={() => setShowRegisterForm(false)} />
    </>
  );
};

export default LoginForm;
