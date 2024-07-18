import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminDash from './pages/AdminDashBoard/index';
import DoctorAccount from './pages/AdminDashBoard/doctor_account';
import ReceptionistAccount from './pages/AdminDashBoard/receptionist_account';
import ProtectedRoute from './pages/AdminDashBoard/component/protected_route';
import ListArticle from './pages/ArticleManagement/list_article';
import ListBlog from './pages/ArticleManagement/list_blog';
import ArticleDash from './pages/ArticleManagement';
import Receptionist from '../src/pages/Receptionist'
// import ViewInforAppoint from './pages/Appointment-patient/ViewInforAppoint';
import ScheduleAdmin from './pages/AdminDashBoard/schedule_admin'
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="Admin"><AdminDash /></ProtectedRoute>}>
        <Route path="doctor-account" element={<DoctorAccount />} />
        <Route path="schedule" element={<ScheduleAdmin/>} />
      </Route>
      <Route path="/receptionist-account" element={<ProtectedRoute requiredRole="Receptionist">< Receptionist /></ProtectedRoute>} />

      <Route path="/article/dashboard" element={<ProtectedRoute requiredRole="ArticleManager"><ArticleDash /></ProtectedRoute>}>
        <Route path="list_blog" element={<ListBlog />} />
        <Route path="list_article" element={<ListArticle />} />
      </Route>

    </Routes>
  );
}

export default App;
