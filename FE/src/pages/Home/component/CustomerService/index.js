// // import React, { useContext, useState, useEffect } from 'react';
// // import { Box, Button } from '@mui/material';
// // import { Link } from 'react-router-dom';
// // import { AuthContext } from '../../../../utils/AuthContext'; // Adjust this path as needed
// // import { login } from '../../../../services/Authentication';
// // import { jwtDecode } from 'jwt-decode'; // Thay đổi từ default import sang named import
// // import LoginForm from '../../../../layouts/LoginForm'; // Import LoginForm component

// // const breakPoints = [
// //     { width: 80, height: 500, itemsToShow: 1 }
// // ];

// // function CustomerService() {
// //     const { isLoggedIn, token, updateToken, logout, role } = useContext(AuthContext);
// //     const [showLogin, setShowLogin] = useState(false);

// //     useEffect(() => {
// //         // Check token validity on component mount
// //         if (token) {
// //             const currentTime = new Date().getTime();
// //             const storedTokenTimestamp = localStorage.getItem('tokenTimestamp');
// //             const tokenAge = currentTime - parseInt(storedTokenTimestamp, 10);
// //             if (tokenAge >= 3600000) { // Token expiration time (1 hour in milliseconds)
// //                 logout();
// //             }
// //         }
// //     }, [token, logout]);

// //     const handleCloseLogin = () => setShowLogin(false);
// //     const handleShowLogin = () => setShowLogin(true);

// //     const handleLogin = async ({ username, password }) => {
// //         try {
// //             const { token } = await login(username, password);
// //             updateToken(token);

// //             const decodedToken = jwtDecode(token);
// //             const accountId = decodedToken.AccId;
// //             const role = decodedToken.role; // Adjust this according to your token structure

// //             // Lưu trạng thái đăng nhập, token, vai trò và account id vào localStorage
// //             localStorage.setItem('token', token);
// //             localStorage.setItem('role', role);
// //             localStorage.setItem('accountId', accountId);

// //         } catch (error) {
// //             console.error('Login failed:', error);
// //         }
// //     };

// //     return (
// //         <Box sx={{ position: 'relative', width: '100%', height: '800px', overflow: 'hidden' }}>
// //             <Box className="boxcarousel" sx={{ position: 'absolute', top: '35%', left: '10%', transform: 'translate(-50%, -50%)', display: 'grid', width: '200px' }}>
// //                 {isLoggedIn ? (
// //                     <Link to="/CreateAppointment" className="button-link" style={{ textDecoration: 'none', margin: '10px 10px' }}>
// //                         <Button variant="contained" color="primary">
// //                             Đặt lịch khám
// //                         </Button>
// //                     </Link>
// //                 ) : (
// //                     <>
// //                         <Button variant="contained" color="primary" onClick={handleShowLogin} className="buttonCreate" style={{ textDecoration: 'none', margin: '10px 10px' }}>
// //                             Đặt lịch khám
// //                         </Button>
// //                         <LoginForm
// //                             show={showLogin}
// //                             handleLogin={handleLogin}
// //                             handleClose={handleCloseLogin}
// //                         />
// //                     </>
// //                 )}
// //                 {isLoggedIn ? (
// //                     <Link to="/GetListQuestion" className="button-link" style={{ textDecoration: 'none', margin: '10px 10px' }}>
// //                         <Button variant="contained" color="primary">
// //                             Hỏi đáp chuyên gia
// //                         </Button>
// //                     </Link>
// //                 ) : (
// //                     <>
// //                         <Button variant="contained" color="primary" onClick={handleShowLogin} className="buttonCreate" style={{ textDecoration: 'none', margin: '10px 10px' }}>
// //                             Hỏi đáp chuyên gia
// //                         </Button>
// //                         <LoginForm
// //                             show={showLogin}
// //                             handleLogin={handleLogin}
// //                             handleClose={handleCloseLogin}
// //                         />
// //                     </>
// //                 )}

// //                 <Link to="/link2" className="button-link" style={{ textDecoration: 'none', margin: '0 10px' }}>
// //                     <Button variant="contained" color="secondary">
// //                         Tư vấn online
// //                     </Button>
// //                 </Link>
// //             </Box>
// //         </Box>
// //     );
// // }

// // export default CustomerService;

// ///////////////
// import React, { useContext, useState, useEffect } from 'react';
// import { Box, Button, Grid, Paper, Typography } from '@mui/material';
// import { Link } from 'react-router-dom';
// import { AuthContext } from '../../../../utils/AuthContext';
// import { login } from '../../../../services/Authentication';
// import { jwtDecode } from 'jwt-decode';
// import LoginForm from '../../../../layouts/LoginForm';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import SearchIcon from '@mui/icons-material/Search';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
// import { Margin } from '@mui/icons-material';

// function CustomerService() {
//     const { isLoggedIn, token, updateToken, logout } = useContext(AuthContext);
//     const [showLogin, setShowLogin] = useState(false);

//     useEffect(() => {
//         // Check token validity on component mount
//         if (token) {
//             const currentTime = new Date().getTime();
//             const storedTokenTimestamp = localStorage.getItem('tokenTimestamp');
//             const tokenAge = currentTime - parseInt(storedTokenTimestamp, 10);
//             if (tokenAge >= 3600000) { // Token expiration time (1 hour in milliseconds)
//                 logout();
//             }
//         }
//     }, [token, logout]);

//     const handleCloseLogin = () => setShowLogin(false);
//     const handleShowLogin = () => setShowLogin(true);

//     const handleLogin = async ({ username, password }) => {
//         try {
//             const { token } = await login(username, password);
//             updateToken(token);

//             const decodedToken = jwtDecode(token);
//             const accountId = decodedToken.AccId;
//             const role = decodedToken.role; // Adjust this according to your token structure

//             // Lưu trạng thái đăng nhập, token, vai trò và account id vào localStorage
//             localStorage.setItem('token', token);
//             localStorage.setItem('role', role);
//             localStorage.setItem('accountId', accountId);

//         } catch (error) {
//             console.error('Login failed:', error);
//         }
//     };
//     const ServiceButton = ({ icon, title, description, onClick, to }) => (
//         <Grid
//             item xs={12} sm={6}
//             sx={{ marginBottom: '20px' }}
//         >
//             <Paper
//                 elevation={3}
//                 sx={{
//                     p: 2,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'flex-start',
//                     height: '100%',
//                     // cursor: 'pointer',
//                     '&:hover': {
//                         backgroundColor: '#6495ED',
//                         '& .MuiTypography-root': {
//                             color: 'white',
//                         },
//                         '& .MuiButton-root': {
//                             color: 'white',
//                         },
//                     },
//                 }}
//                 onClick={onClick}
//             >
//                 {icon}
//                 <Typography variant="h6" component="h2" mt={2}>
//                     {title}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" mt={1}>
//                     {description}
//                 </Typography>
//                 <Box sx={{ flexGrow: 1 }} />
//                 <Button
//                     component={to ? Link : 'button'}
//                     to={to}
//                     variant="text"
//                     color="primary"
//                     sx={{ alignSelf: 'flex-end', mt: 2 }}
//                 >
//                     {to ? 'Đi đến' : 'Đặt lịch'}
//                 </Button>
//             </Paper>
//         </Grid>
//     );


//     return (
//         <Box sx={{ flexGrow: 1, p: 3 }}>
//             <Grid container spacing={3}>
//                 <ServiceButton
//                     icon={<CalendarTodayIcon fontSize="large" color="primary" />}
//                     title="Đặt lịch khám, lấy mẫu tại nhà"
//                     description="Quý khách hàng sử dụng tiện ích này để đặt lịch khám online tại phòng khám Đa khoa 68A"
//                     onClick={isLoggedIn ? null : handleShowLogin}
//                     to={isLoggedIn ? "/CreateAppointment" : null}

//                 />
//                 <ServiceButton
//                     icon={<SearchIcon fontSize="large" color="primary" />}
//                     title="Tra cứu kết quả"
//                     description="Quý khách hàng sử dụng tiện ích này để tra cứu kết quả sau khi sử dụng dịch vụ y tế tại phòng khám Đa khoa 68A"
//                     onClick={isLoggedIn ? null : handleShowLogin}
//                     to={isLoggedIn ? "/getMedicalNotebook" : null}  // Adjust this route as needed
//                 />
//                 <ServiceButton
//                     icon={<AttachMoneyIcon fontSize="large" color="primary" />}
//                     title="Bảng giá dịch vụ"
//                     description="Quý khách hàng sử dụng tiện ích này để tra cứu giá dịch vụ y tế tại phòng khám Đa khoa 68A"
//                     to="/price-list"  // Adjust this route as needed
//                 />
//                 <ServiceButton
//                     icon={<HelpOutlineIcon fontSize="large" color="primary" />}
//                     title="Hỏi đáp chuyên gia"
//                     description="Quý khách hàng sử dụng tiện ích này để đặt câu hỏi và nhận hướng dẫn, giải đáp thắc mắc từ chuyên gia y tế của phòng khám Đa khoa 68A"
//                     onClick={isLoggedIn ? null : handleShowLogin}
//                     to={isLoggedIn ? "/GetListQuestion" : null}
//                 />
//             </Grid>
//             <LoginForm
//                 show={showLogin}
//                 handleLogin={handleLogin}
//                 handleClose={handleCloseLogin}
//             />
//         </Box>
//     );
// }
// export default CustomerService;

import React, { useContext, useState, useEffect } from 'react';
import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../../utils/AuthContext';
import { login } from '../../../../services/Authentication';
import { jwtDecode } from 'jwt-decode';
import LoginForm from '../../../../layouts/LoginForm';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@mui/icons-material/Search';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

function CustomerService() {
    const { isLoggedIn, token, updateToken, logout } = useContext(AuthContext);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        // Check token validity on component mount
        if (token) {
            const currentTime = new Date().getTime();
            const storedTokenTimestamp = localStorage.getItem('tokenTimestamp');
            const tokenAge = currentTime - parseInt(storedTokenTimestamp, 10);
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

    const ServiceButton = ({ icon, title, description, onClick, to, buttonText }) => (
        <Grid
            item xs={12} sm={6}
            sx={{ marginBottom: '20px' }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    height: '100%',
                    // cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: '#6495ED',
                        '& .MuiTypography-root': {
                            color: 'white',
                        },
                        '& .MuiButton-root': {
                            color: 'white',
                        },
                    },
                }}
                onClick={onClick}
            >
                {icon}
                <Typography variant="h6" component="h2" mt={2}>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                    {description}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    component={to ? Link : 'button'}
                    to={to}
                    variant="text"
                    color="primary"
                    sx={{ alignSelf: 'flex-end', mt: 2 }}
                >
                    {buttonText}
                </Button>
            </Paper>
        </Grid>
    );

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                CÁC DỊCH VỤ TẠI <b style={{ color: '#1d93e3' }}>68A</b>
            </Typography>
            <Grid container spacing={3}>
                <ServiceButton
                    icon={<CalendarTodayIcon fontSize="large" color="primary" />}
                    title="Đặt lịch khám, lấy mẫu tại nhà"
                    description="Quý khách hàng sử dụng tiện ích này để đặt lịch khám online tại phòng khám Đa khoa 68A"
                    onClick={isLoggedIn ? null : handleShowLogin}
                    to={isLoggedIn ? "/CreateAppointment" : null}
                    buttonText={isLoggedIn ? "Đi đến" : "Đặt lịch"}
                />
                <ServiceButton
                    icon={<SearchIcon fontSize="large" color="primary" />}
                    title="Tra cứu kết quả"
                    description="Quý khách hàng sử dụng tiện ích này để tra cứu kết quả sau khi sử dụng dịch vụ y tế tại phòng khám Đa khoa 68A"
                    onClick={isLoggedIn ? null : handleShowLogin}
                    to={isLoggedIn ? "/getMedicalNotebook" : null}  // Adjust this route as needed
                    buttonText="Đi đến"
                />
                <ServiceButton
                    icon={<AttachMoneyIcon fontSize="large" color="primary" />}
                    title="Bảng giá dịch vụ"
                    description="Quý khách hàng sử dụng tiện ích này để tra cứu giá dịch vụ y tế tại phòng khám Đa khoa 68A"
                    to="/departmentsList"  // Adjust this route as needed
                    buttonText="Đi đến"
                />
                <ServiceButton
                    icon={<HelpOutlineIcon fontSize="large" color="primary" />}
                    title="Hỏi đáp chuyên gia"
                    description="Quý khách hàng sử dụng tiện ích này để đặt câu hỏi và nhận hướng dẫn, giải đáp thắc mắc từ chuyên gia y tế của phòng khám Đa khoa 68A"
                    onClick={isLoggedIn ? null : handleShowLogin}
                    to={isLoggedIn ? "/GetListQuestion" : null}
                    buttonText="Đi đến"
                />
            </Grid>
            <LoginForm
                show={showLogin}
                handleLogin={handleLogin}
                handleClose={handleCloseLogin}
            />
        </Box>
    );
}

export default CustomerService;
