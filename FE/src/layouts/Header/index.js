import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Navigate } from 'react-router-dom';
import '../Header/header.css';
import NavLogo from '../../assets/images/images.png';
import { login, logout, fetchWithAuth } from '../../services/Authentication';
import LoginForm from '../LoginForm'; // Import LoginForm component
import RegisterForm from '../RegisterForm';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Phone, AccessTime, LocationOn, Language } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode instead of jwt-decode
const tokenTimeout = 3600000; // 1 hour in milliseconds

function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedTokenTimestamp = localStorage.getItem('tokenTimestamp');
    if (storedToken && storedTokenTimestamp) {
      const currentTime = new Date().getTime();
      const tokenAge = currentTime - parseInt(storedTokenTimestamp);
      if (tokenAge < tokenTimeout) {
        setToken(storedToken);
        setIsLoggedIn(true);
        const decoded = jwtDecode(storedToken);
        setRole(decoded.role);
        setTimeout(handleTokenExpiration, tokenTimeout - tokenAge);
      } else {
        handleTokenExpiration();
      }
    }

    window.addEventListener('beforeunload', handleTokenExpiration);
    return () => {
      window.removeEventListener('beforeunload', handleTokenExpiration);
    };
  }, []);

  const handleTokenExpiration = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('tokenTimestamp');
    setToken(null);
    setIsLoggedIn(false);
    setRole(null);
    navigate('/');
  };

  const updateToken = (token) => {
    setToken(token);
    setIsLoggedIn(true);
    const decoded = jwtDecode(token);
    setRole(decoded.role);
    localStorage.setItem('token', token);
    localStorage.setItem('tokenTimestamp', new Date().getTime().toString());
    setTimeout(handleTokenExpiration, tokenTimeout);
  };

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  const handleCloseRegister = () => setShowRegister(false);
  const handleShowRegister = () => setShowRegister(true);

  const handleLogin = async ({ username, password }) => {
    try {
      const { token } = await login(username, password);
      updateToken(token);
      handleCloseLogin();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('tokenTimestamp');
    setToken(null);
    setIsLoggedIn(false);
    setRole(null);
    navigate('/');
  };

  const handleRegister = async (credentials) => {
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Register successful', data);
      } else {
        console.log('Register failed');
      }
    } catch (error) {
      console.error('Error registering:', error);
    }

    handleCloseRegister();
  };

  return (
    <>
      {role === 'Admin' && <Navigate to="/admin/dashboard/doctor-account" replace={true} />}
      {role === 'Patient' && <Navigate to="/patient/dashboard/receptionist-account" replace={true} />}
      {role === 'ArticleManager' && <Navigate to="/article/dashboard" replace={true} />}
      
      <AppBar position="static" color="default">
        <Toolbar>
          <NavLink to="/" className="nav__logo">
            <img src={NavLogo} alt="Logo" className="logo-image" />
          </NavLink>
        
          <Box className="info-class" display="flex">
            <Box className="card-header-self" display="flex" alignItems="center">
              <Phone />
              <Typography variant="body2" className="info-text">
                <b>Số điện thoại<br /> xxxxxxxxx </b>
              </Typography>
            </Box>
            <Box className="card-header-self" display="flex" alignItems="center">
              <AccessTime />
              <Typography variant="body2" className="info-text">
                <b>Giờ làm việc <br /> xxx -xxxxx </b>
              </Typography>
            </Box>
            <Box className="card-header-self" display="flex" alignItems="center">
              <LocationOn />
              <Typography variant="body2" className="info-text">
                <b>Địa chỉ <br />68A Hà Đông</b>
              </Typography>
            </Box>
            <Box className="card-header-self" display="flex" alignItems="center">
              <Language />
              <Typography variant="body2" className="info-text">
                <b>Ngôn ngữ <br /> Tiếng việt</b>
              </Typography>
            </Box>
            <Box className="card-header-self card-hehe">
              {isLoggedIn ? (
                <Button onClick={handleLogout} variant="contained" className="login-button" color="secondary">Đăng xuất</Button>
              ) : (
                <>
                  <Button onClick={handleShowLogin} variant="contained" className="login-button" color="primary">Đăng nhập</Button>
                  <div className="card-hehe"></div>
                  <Button onClick={handleShowRegister} variant="contained" className="login-button" color="secondary">Đăng ký</Button>
                </>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <LoginForm show={showLogin} handleLogin={handleLogin} updateToken={updateToken} />
      <RegisterForm show={showRegister} handleRegister={handleRegister} />
    </>
  );
}

export default Header;
