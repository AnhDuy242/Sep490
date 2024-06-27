import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminDash from '../src/pages/AdminDashBoard/index'; // Sửa lại đường dẫn nếu cần
import DoctorAccount from './pages/AdminDashBoard/doctor_account'; // Điều chỉnh đường dẫn tùy vào cấu trúc project của bạn
import ReceptionistAccount from './pages/AdminDashBoard/receptionist_account'; // Điều chỉnh đường dẫn tùy vào cấu trúc project của bạn

function App() {
  return (

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/dashboard" element={<AdminDash/>}>
        <Route path="doctor-account" element={<DoctorAccount/>} />
        <Route path="receptionist-account" element={<ReceptionistAccount/>} />
      </Route>
    </Routes>

  );
}

export default App;
