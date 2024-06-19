    import { useState } from 'react'; // Import useState hook
    import { NavLink } from "react-router-dom";
    import '../Header/header.css';
    import NavLogo from '../../assets/images/images.png';
    import vietnam_icon from '../../assets/images/vietnam_icon.png';
    import phone_icon from '../../assets/images/Phone_icon.png';
    import working_time from '../../assets/images/work_time.png';
    import address_icon from '../../assets/images/address_icon.png'
    import styled, { createGlobalStyle } from 'styled-components';
    import { Link } from 'react-router-dom';
    import LoginForm from '../LoginForm'; // Import LoginForm component
    const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

    body {
        margin: 0;
        font-family: 'Montserrat', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    `;

    function Header() {
        const [show, setShow] = useState(false);

        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
    
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
    
            handleClose();
        };







        return (
            <>
        <GlobalStyle />
          <header>
            <div className="header-container">
            <div className="logo-class">
            <NavLink to="/" className="nav__logo">
            <img src={NavLogo} alt="L321321321" className="logo-image" />
            </NavLink>
            </div>
            <div className="info-class">
                <div className='card-header-self'>
                    <div className='info-logo'>
                        <img src={phone_icon}></img>
                    </div>
                    <div className='info-text'><b>Số điện thoại<br /> xxxxxxxxx </b></div>
                </div>
                <div className='card-header-self'>
                    <div className='info-logo'>
                        <img src={working_time} alt='worktime'></img>
                    </div>
                    <div className='info-text'><b>Giờ làm việc <br/> xxx -xxxxx </b></div>
                </div>
                <div className='card-header-self'>
                    <div className='info-logo'>
                        <img src={address_icon} alt='address'></img>
                    </div>
                    <div className='info-text'><b>Địa chỉ <br/>68A Hà Đông</b></div>
                </div>
                <div className='card-header-self'>
                    <div className='info-logo language' >
                        <img src={vietnam_icon}></img>
                    </div>
                    <div className='info-text'><b>Ngôn ngữ <br/> Tiếng việt</b></div>
                </div>
                <div className='card-header-self'>
                    <div className="card-button">
                        <div className='card-button-num'>      <button onClick={handleShow}>Đăng nhập</button></div>
                        <div className='card-button-num'>  <button> <Link to="/***********"> Đăng ký </Link></button></div>
                    </div>
                   
                </div>
            </div>
            </div>
          </header>
          <LoginForm show={show} handleClose={handleClose} handleLogin={handleLogin} />
          </>
        );
      }
      



      export default Header;