import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate, Navigate } from 'react-router-dom';
import '../Header/header.css';
import NavLogo from '../../assets/images/images.png';
import { login } from '../../services/Authentication';
import LoginForm from '../LoginForm'; // Import LoginForm component
import RegisterForm from '../RegisterForm';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { AuthContext } from '../../utils/AuthContext'; // Adjust this path as needed
import { jwtDecode } from 'jwt-decode';

const Header = () => {
  const { isLoggedIn, token, updateToken, logout, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    // Check token validity on component mount
    if (token) {
      const currentTime = new Date().getTime();
      const storedTokenTimestamp = localStorage.getItem('tokenTimestamp');
      const tokenAge = currentTime - parseInt(storedTokenTimestamp);
      if (tokenAge >= 3600000) { // Token expiration time (1 hour in milliseconds)
        logout();
      }
    }
  }, [token, logout]);

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  const handleCloseRegister = () => setShowRegister(false);
  const handleShowRegister = () => setShowRegister(true);

  const handleLogin = async ({ username, password }) => {
    try {
      const { token } = await login(username, password);
      updateToken(token);
      
      const decodedToken = jwtDecode(token);
      const accountId = decodedToken.AccId;
      const role = decodedToken.role; // Adjust this according to your token structure
  
      // Lưu trạng thái đăng nhập, token, vai trò và account id vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('accountId', accountId);
  
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    logout();
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
      <AppBar position="static" color="default">
        <Toolbar>
          <NavLink to="/" className="nav__logo">
            <img src={NavLogo} alt="Logo" className="logo-image" />
          </NavLink>

          <Box className="info-class" display="flex">
            {/* Your info boxes */}
          </Box>

          <Box className="card-header-self card-hehe">
            {isLoggedIn ? (
              <Button onClick={handleLogout} variant="contained" className="login-button" color="secondary">Đăng xuất</Button>
            ) : (
              <>
                <Button onClick={handleShowLogin} variant="contained" className="login-button" color="primary">Đăng nhập</Button>
                <Button onClick={handleShowRegister} variant="contained" className="login-button" color="secondary">Đăng ký</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <LoginForm
        show={showLogin}
        handleLogin={handleLogin}
        handleClose={handleCloseLogin}
        handleRegister={handleRegister}
      />
      <RegisterForm show={showRegister} handleRegister={handleRegister} handleClose={handleCloseRegister} />
    </>
  );
};

export default Header;
