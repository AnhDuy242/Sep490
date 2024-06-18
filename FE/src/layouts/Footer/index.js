

import React from "react";
import { SocialIcon } from 'react-social-icons'

import "../Footer/Footer.css";
import 'font-awesome/css/font-awesome.min.css';
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
function Footer() {
    return (
        <>
          <GlobalStyle />
            <div className="footer">
                <div className="footer-h">
                    <div className="upper">
                        <div className="name-title-s">
                            <div className="name-s">
                                <span> Phòng khám đa khoa 68A Hà Đông</span>
                            </div>
                            <div className="desc">
                                Nơi bệnh nhân có thể đặt niềm tin bởi dịch vụ khám chữa
                            </div>
                        </div>
                        <div className="important">
                            <div className="name-title">
                                Dịch vụ
                            </div>
                            <div className="footer-blog">
                                <div className="footer-content">
                                    Các gói khám sức khoẻ và tầm soát ung thư
                                </div>
                                <div className="footer-content">
                                    Các dịch vụ khác
                                </div>
                                <div className="footer-content">
                                    Tư vấn sức khoẻ từ xa
                                </div >
                                <div className="footer-content">
                                    Ship thuốc tận nhà
                                </div>
                                <div className="footer-content">
                                    BÁC SĨ GIA ĐÌNH – KHÁM VÀ CHĂM SÓC SỨC KHỎE ĐỊNH KỲ CHO 3 THẾ HỆ
                                </div>
                            </div>
                        </div>
                        <div className="contact">
                            <div className="name-title">
                                Liên hệ
                            </div>
                            <div className="footer blog">
                                Hotline: 1900.636.115
                            </div>
                        </div>
                        <div className="newsletter">
                            <div className="     contactting">
                                Liên lạc với chúng tôi thông qua email
                            </div>
                            <div className="search-area">  
                                <input className="button-input-text" type="text" placeholder="Liên lạc với chúng tôi.." name="search" />
                                <button className="button-input-sent" type="submit"><i class="fa fa-send"></i></button></div>

                            <div className="name-title-social">
                                <SocialIcon url="https:/facebook.com" />
                                <SocialIcon url="https:/Twitter.com" />
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}
export default Footer;