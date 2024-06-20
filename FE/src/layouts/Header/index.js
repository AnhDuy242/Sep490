import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../Header/header.css';
import NavLogo from '../../assets/images/images.png';

import LoginForm from '../LoginForm'; // Import LoginForm component
import RegisterForm from '../RegisterForm';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Modal,
  Paper,
} from '@mui/material';
import { Phone, AccessTime, LocationOn, Language } from '@mui/icons-material';



function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  const handleCloseRegister = () => setShowRegister(false);
  const handleShowRegister = () => setShowRegister(true);

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful', data);
        // Handle successful login
      } else {
        console.log('Login failed');
        // Handle failed login
      }
    } catch (error) {
      console.error('Error during login:', error);
    }

    handleCloseLogin();
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
        // Handle successful login
      } else {
        console.log('Register failed');
        // Handle failed login
      }
    } catch (error) {
      console.error('Error registering:', error);
    }

    handleCloseRegister();
  };

  return (
    <>
      
      <AppBar position="static" color="default">
        <Toolbar>
          <NavLink to="/" className="nav__logo">
            <img src={NavLogo} alt="Logo" className="logo-image" />
          </NavLink>
          <Box sx={{ flexGrow: 1 }} />
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
            <Box className="card-header-self">
              <Button onClick={handleShowLogin} variant="contained" className='login-button' color="primary">Đăng nhập</Button>
              <Button onClick={handleShowRegister} variant="contained" color="secondary">Đăng ký</Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <LoginForm show={showLogin} handleClose={handleCloseLogin} handleLogin={handleLogin} />
      <RegisterForm show={showRegister} handleClose={handleCloseRegister} handleRegister={handleRegister} />
    </>
  );
}

export default Header;
