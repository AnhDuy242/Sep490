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
import Add_blog from'./pages/ArticleManagement/add_blog';
import GetAppointment from '../src/pages/Appointment-patient/ViewInforAppoint';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="Admin"><AdminDash /></ProtectedRoute>}>
        <Route path="doctor-account" element={<DoctorAccount />} />
        <Route path="receptionist-account" element={<ReceptionistAccount />} />
      </Route>


      <Route path="/article/dashboard/" element={<ProtectedRoute requiredRole="ArticleManager"><ArticleDash /></ProtectedRoute>}>
        <Route path="/article/dashboard/list_blog" element={<ListBlog/>} />
        <Route path="list_article" element={<ListArticle/>} />
        <Route path="/article/dashboard/add_blog" element={<Add_blog/>} />
        
      </Route>

      <Route path="/getAppointment" element={<ProtectedRoute requiredRole="Patient"><GetAppointment/></ProtectedRoute>}>
        
      </Route>
    </Routes>
  );
}

export default App;
