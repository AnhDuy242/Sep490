import React from 'react';
import Header from '../../layouts/Header';
import NavBar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import HealthCareServ from '../PolyServ/component/HealthCareServ';



function PolyService() {
    return (
      <div>
        <Header />
        <NavBar />
       <HealthCareServ/>
        <Footer/>
      </div>
    );
  }
  
  export default PolyService;
  