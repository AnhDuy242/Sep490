import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate, Navigate } from 'react-router-dom';
import '../Header/header.css';
import NavLogo from '../../assets/images/images.png';
import { login } from '../../services/Authentication';
import LoginForm from '../LoginForm';
import RegisterForm from '../RegisterForm';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { AuthContext } from '../../utils/AuthContext'; // Import AuthContext

const tokenTimeout = 3600000; // 1 hour in milliseconds

function Header() {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const { isLoggedIn, updateToken, logout, role } = useContext(AuthContext); // Use useContext to access AuthContext
    const navigate = useNavigate();

    useEffect(() => {
        const checkTokenValidity = () => {
            const storedToken = localStorage.getItem('token');
            const storedTokenTimestamp = localStorage.getItem('tokenTimestamp');
            if (storedToken && storedTokenTimestamp) {
                const currentTime = new Date().getTime();
                const tokenAge = currentTime - parseInt(storedTokenTimestamp);
                if (tokenAge < tokenTimeout) {
                    updateToken(storedToken); // Use updateToken function from context
                    setTimeout(logout, tokenTimeout - tokenAge); // Use logout function from context
                } else {
                    logout(); // Use logout function from context
                }
            }
        };

        checkTokenValidity();
    }, [updateToken, logout]);

    const handleCloseLogin = () => setShowLogin(false);
    const handleShowLogin = () => setShowLogin(true);

    const handleCloseRegister = () => setShowRegister(false);
    const handleShowRegister = () => setShowRegister(true);

    const handleLogin = async ({ username, password }) => {
        try {
            const { token } = await login(username, password);
            updateToken(token); // Call the updateToken function from context
            localStorage.setItem('token', token);
            localStorage.setItem('tokenTimestamp', new Date().getTime().toString());
            handleCloseLogin();
            navigate('/'); // Use navigate from react-router-dom to redirect
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleLogout = () => {
        logout(); // Use logout function from context
        localStorage.removeItem('token');
        localStorage.removeItem('tokenTimestamp');
        navigate('/'); // Redirect to home page
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
            {role === 'ArticleManager' && <Navigate to="/article/dashboard" replace={true} />}
            {role === 'Receptionist' && <Navigate to="/receptionist-account" replace={true} />}

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

            {/* Render Login and Register forms */}
            <LoginForm show={showLogin} handleLogin={handleLogin} />
            <RegisterForm show={showRegister} handleRegister={handleRegister} />
        </>
    );
}

export default Header;
