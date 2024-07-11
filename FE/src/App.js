import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminDash from '../src/pages/AdminDashBoard/index'; // Sửa lại đường dẫn nếu cần
import DoctorAccount from './pages/AdminDashBoard/doctor_account'; // Điều chỉnh đường dẫn tùy vào cấu trúc project của bạn
import ReceptionistAccount from './pages/AdminDashBoard/receptionist_account'; // Điều chỉnh đường dẫn tùy vào cấu trúc project của bạn
import ProtectedRoute from './pages/AdminDashBoard/component/protected_route';
import Appoinment_Patient from './pages/Appointment-patient/index';
import Navbar from './layouts/Navbar';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
function App() {
  return (

    // <Routes>
    //   <Route path="/" element={<Home />} />
    //   <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="Admin"><AdminDash /></ProtectedRoute>}>
    //   <Route path="/admin/dashboard/doctor-account" element={<DoctorAccount/>} />
    //     <Route path="/admin/dashboard/receptionist-account" element={<ReceptionistAccount/>} />
    //   </Route>
    // </Routes>
    <>
      <Header />
      <Navbar/>
      <Appoinment_Patient />
      <Footer />
    </>
  );
}

export default App;
