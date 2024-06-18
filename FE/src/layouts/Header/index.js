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
                <div className='card-header'>
                    <div className='info-logo'>
                        <img src={phone_icon}></img>
                    </div>
                    <div className='info-text'><b>Số điện thoại<br /> xxxxxxxxx </b></div>
                </div>
                <div className='card-header'>
                    <div className='info-logo'>
                        <img src={working_time} alt='worktime'></img>
                    </div>
                    <div className='info-text'><b>Giờ làm việc <br/> xxx -xxxxx </b></div>
                </div>
                <div className='card-header'>
                    <div className='info-logo'>
                        <img src={address_icon} alt='address'></img>
                    </div>
                    <div className='info-text'><b>Địa chỉ <br/>68A Hà Đông</b></div>
                </div>
                <div className='card-header'>
                    <div className='info-logo language' >
                        <img src={vietnam_icon}></img>
                    </div>
                    <div className='info-text'><b>Ngôn ngữ <br/> Tiếng việt</b></div>
                </div>
                <div className=' card-header'>
                    <div className="card-button">
                        <div className='card-button-num'>  <button ><Link to="/***********"> Đăng nhập </Link></button></div>
                        <div className='card-button-num'>  <button> <Link to="/***********"> Đăng ký </Link></button></div>
                    </div>
                   
                </div>
            </div>
            </div>
          </header>
          </>
        );
      }
      



      export default Header;