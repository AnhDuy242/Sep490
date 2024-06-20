// src/pages/Home/index.js
import React from 'react';
import Header from '../../layouts/Header'
import NavBar from '../../layouts/Navbar'
import CarouselSlider from '../../layouts/CarouselSlider';
import Footer from '../../layouts/Footer'
import DoctorList from '../Home/component/DoctorList'
import Blog from '../Home/component/Blog'
import Article from '../Home/component/Article'
import Service from '../Home/component/PolyServ'
import FeedBack from '../Home/component/Feedback'
function Home() {
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
      <Footer></Footer>
    </div>
  );
}

export default Home;
