// src/pages/Home/index.js
import React, { useContext, useState, useEffect } from 'react';
import Header from '../../layouts/Header';
import NavBar from '../../layouts/Navbar';
import CarouselSlider from '../../layouts/CarouselSlider';
import Footer from '../../layouts/Footer';
import DoctorList from '../Home/component/DoctorList';
import Blog from '../Home/component/Blog';
import Article from '../Home/component/Article';
import Service from '../Home/component/PolyServ';
import FeedBack from '../Home/component/Feedback';
import ChatPopup from '../../layouts/ChatNotification';
import { AuthContext } from '../../utils/AuthContext';
import CustomerService from './component/CustomerService';
import { Helmet } from 'react-helmet';
import Chatpopup_ForReceptionist from '../../layouts/ChatNotification/ChatPopup_ForReceptionist/ChatPopup_ForReceptionist';
import ChatPopup_ForPatient from '../../layouts/ChatNotification';
import ScrollToTopButton from '../../layouts/ScrolltoTop/ScrolltoTop';

function Home() {
  const { user } = useContext(AuthContext);
  const role = localStorage.getItem('role');
  const [unreadCount, setUnreadCount] = useState(0);
  const accountId=localStorage.getItem('accountId');
  useEffect(() => {
    if (role === 'Patient') {
      const fetchUnreadCount = async () => {
        try {
          const response = await fetch(`https://localhost:7240/api/Messages/GetAllUnreadCount/GetUnreadCount?receiverId=${accountId}`);
          const data = await response.json();
          setUnreadCount(data);
        } catch (error) {
          console.error('Failed to fetch unread message count', error);
        }
      };

      fetchUnreadCount();
      
      // Optionally, you can set an interval to fetch the unread count periodically
      // const intervalId = setInterval(fetchUnreadCount, 4000);
      // return () => clearInterval(intervalId);
    }
  }, [role]);

  return (
    <div>
      <Helmet>
        <title>
          {role === 'Patient' && unreadCount > 0  ? ` (${unreadCount}) tin nhắn mới ` : 'Phòng khám Đa khoa 68A'}
        </title>
      </Helmet>
      <Header />
      <NavBar />
      <CarouselSlider />
      <CustomerService />
      <DoctorList />
      {/* <Blog /> */}
      <Article />
      <Service />
      <FeedBack />
      {role === 'Patient' ? <ChatPopup_ForPatient /> : ''}
      {role === 'Receptionist' ? <Chatpopup_ForReceptionist /> : ''}
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

export default Home;
