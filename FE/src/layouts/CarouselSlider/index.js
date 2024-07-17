import React, { useContext, useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import img1 from "../../assets/images/carousel_image_1.jpg";
import img2 from "../../assets/images/carousel_image_2.jpg";
import '../CarouselSlider/Carousel.css';
import { AuthContext } from '../../utils/AuthContext'; // Adjust this path as needed
import { login } from '../../services/Authentication';
import { jwtDecode } from 'jwt-decode';
import LoginForm from '../LoginForm'; // Import LoginForm component

const breakPoints = [
    { width: 80, height: 500, itemsToShow: 1 }
];

function Carousel2() {
    const { isLoggedIn, token, updateToken, logout, role } = useContext(AuthContext);
    const [showLogin, setShowLogin] = useState(false);


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


    // return (
    //     <Box sx={{ position: 'relative', width: '100%', height: '800px', overflow: 'hidden' }}>
    //         <img src={img2} alt="My Image" style={{ width: '100%', height: '100%' }} />
    //         <Box sx={{ position: 'absolute', top: '35%', left: '60%', transform: 'translate(-50%, -50%)', display: 'grid', width: '200px' }}>
    //             {isLoggedIn && (
    //                 <Link component={Link} to="/CreateAppointment" className="button-link" style={{ textDecoration: 'none', margin: '10px 10px' }}>
    //                     <Button variant="contained" color="primary">
    //                         Đặt lịch khám
    //                     </Button>
    //                 </Link>
    //             )}
    //             <Link className="button-link" to="/link2" style={{ textDecoration: 'none', margin: '0 10px' }}>
    //                 <Button variant="contained" color="secondary">
    //                     Tư vấn online
    //                 </Button>
    //             </Link>
    //         </Box>
    //     </Box>
    // );
    return (
        <Box sx={{ position: 'relative', width: '100%', height: '800px', overflow: 'hidden' }}>
            <img src={img2} alt="My Image" style={{ width: '100%', height: '100%' }} />
            <Box sx={{ position: 'absolute', top: '35%', left: '60%', transform: 'translate(-50%, -50%)', display: 'grid', width: '200px' }}>
                {isLoggedIn ? (
                    <Link to="/CreateAppointment" className="button-link" style={{ textDecoration: 'none', margin: '10px 10px' }}>
                        <Button variant="contained" color="primary">
                            Đặt lịch khám
                        </Button>
                    </Link>
                ) : (
                    <>
                        <Button variant="contained" color="primary" onClick={handleShowLogin} className="button-link" style={{ textDecoration: 'none', margin: '10px 10px' }}>
                            Đặt lịch khám
                        </Button>
                        <LoginForm
                            show={showLogin}
                            handleLogin={handleLogin}
                            handleClose={handleCloseLogin}
                        />
                    </>
                )}
                <Link to="/link2" className="button-link" style={{ textDecoration: 'none', margin: '0 10px' }}>
                    <Button variant="contained" color="secondary">
                        Tư vấn online
                    </Button>
                </Link>
            </Box>
        </Box>
    );
}

export default Carousel2;
