// src/pages/Home/index.js
import React, { useContext } from 'react';
import Header from '../../layouts/Header'
import NavBar from '../../layouts/Navbar'
import CarouselSlider from '../../layouts/CarouselSlider';
import Footer from '../../layouts/Footer'
import DoctorList from '../Home/component/DoctorList'
import Blog from '../Home/component/Blog'
import Article from '../Home/component/Article'
import Service from '../Home/component/PolyServ'
import FeedBack from '../Home/component/Feedback'
import ChatPopup from '../../layouts/ChatNotification';
import { AuthContext } from '../../utils/AuthContext';
import CustomerServiec from './component/CustomerService'
import { Helmet } from 'react-helmet';
import Chatpopup_ForReceptionist from '../../layouts/ChatNotification/ChatPopup_ForReceptionist/ChatPopup_ForReceptionist';
import ChatPopup_ForPatient from '../../layouts/ChatNotification';
import ChatPopup_ForPatient_Doctor from '../../layouts/ChatNotification/ChatPopup_ForPatient/ChatPopup_ForPatient';

function Home() {
  const { user } = useContext(AuthContext);
  const role=localStorage.getItem('role');
  console.log(role);
  return (
    <div>
      <Helmet>
        <title>
          Phòng khám Đa khoa 68A
        </title>
      </Helmet>
      <Header />
      <NavBar />
      <CarouselSlider></CarouselSlider>
      <CustomerServiec></CustomerServiec>
      <DoctorList/>
      {/* <Blog/> */}
      <Article/>
      <Service/>
      <FeedBack/>
      {role === 'Patient' ? <ChatPopup_ForPatient_Doctor /> :''}
      {role === 'Receptionist' ? <Chatpopup_ForReceptionist /> :''}

      <Footer></Footer>

    </div>
  );
}

export default Home;
