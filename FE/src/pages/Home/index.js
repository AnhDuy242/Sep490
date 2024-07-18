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
import ChatPopup_ForReceptionist from '../../layouts/ChatNotification/ChatPopup_ForReceptionist/ChatPopup_ForRecepptionist';
import { AuthContext } from '../../utils/AuthContext';
function Home() {
  const { user } = useContext(AuthContext);
  const role=localStorage.getItem('role');
  console.log(role);
  return (
    <div>
      <Header />
      <NavBar />
      <CarouselSlider></CarouselSlider>
      <DoctorList/>
      <Blog/>
      <Article/>
      <Service/>
      <FeedBack/>
      {role === 'Receptionist' ? <ChatPopup_ForReceptionist /> :''}
      {role === 'Doctor' ? <ChatPopup_ForReceptionist /> :''}
      {role === 'Patient' ? <ChatPopup /> :''}

      <Footer></Footer>

    </div>
  );
}

export default Home;
