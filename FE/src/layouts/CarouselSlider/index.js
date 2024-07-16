import React, { useContext } from 'react';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import img1 from "../../assets/images/carousel_image_1.jpg";
import img2 from "../../assets/images/carousel_image_2.jpg";
import '../CarouselSlider/Carousel.css';
import { AuthContext } from '../../utils/AuthContext'; // Adjust this path as needed

const breakPoints = [
    { width: 80, height: 500, itemsToShow: 1 }
];

function Carousel2() {
    const { isLoggedIn, token, updateToken, logout, role } = useContext(AuthContext);

    return (
        <Box sx={{ position: 'relative', width: '100%', height: '800px', overflow: 'hidden' }}>
            <img src={img2} alt="My Image" style={{ width: '100%', height: '100%' }} />
            <Box sx={{ position: 'absolute', top: '35%', left: '60%', transform: 'translate(-50%, -50%)', display: 'grid', width: '200px' }}>
                {isLoggedIn && (
                    <Link to="/link1" className="button-link" style={{ textDecoration: 'none', margin: '10px 10px' }}>
                        <Button variant="contained" color="primary">
                            Đặt lịch khám
                        </Button>
                    </Link>
                )}
                <Link className="button-link" to="/link2" style={{ textDecoration: 'none', margin: '0 10px' }}>
                    <Button variant="contained" color="secondary">
                        Tư vấn online
                    </Button>
                </Link>
            </Box>
        </Box>
    );
}

export default Carousel2;
