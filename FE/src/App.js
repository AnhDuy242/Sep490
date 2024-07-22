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
import Add_blog from './pages/ArticleManagement/add_blog';
import CreateAppointment from './pages/Appointment-patient/CreateAppointment';
import GetAppointment from '../src/pages/Appointment-patient/ViewInforAppoint';
import ReceptionistDash from '../src/pages/ReceptionistManagement';
import CreatePatientAccount from '../src/pages/ReceptionistManagement/create_patient_account';
import ApproveAppointment from '../src/pages/ReceptionistManagement/approve_appointment';
import ListDoctorView from './pages/DoctorList'
function App() {
  return (
    <Routes>
      {/**Route hướng home */}
      <Route path="/" element={<Home />} >
      </Route>
      {/**Route admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="Admin"><AdminDash /></ProtectedRoute>}>
        <Route path="doctor-account" element={<DoctorAccount />} />
        <Route path="receptionist-account" element={<ReceptionistAccount />} />
      </Route>
      {/*Article*/}
      <Route path="/article/dashboard/" element={<ProtectedRoute requiredRole="ArticleManager"><ArticleDash /></ProtectedRoute>}>
        <Route path="/article/dashboard/list_blog" element={<ListBlog />} />
        <Route path="list_article" element={<ListArticle />} />
        <Route path="/article/dashboard/add_blog" element={<Add_blog />} />
      </Route>
      {/*Receptionist*/}
      <Route path="/receptionist/dashboard/" element={<ProtectedRoute requiredRole="Receptionist"><ReceptionistDash /></ProtectedRoute>}>
        <Route path="create_patient_account" element={<CreatePatientAccount />} />
        <Route path="Approve_appointment" element={<ApproveAppointment />} />
      </Route>
      {/**Route article */}
      <Route path="/article/dashboard/" element={<ProtectedRoute requiredRole="ArticleManager"><ArticleDash /></ProtectedRoute>}>
        <Route path="/article/dashboard/list_blog" element={<ListBlog />} />
        <Route path="list_article" element={<ListArticle />} />
        <Route path="/article/dashboard/add_blog" element={<Add_blog />} />
      </Route>

      {/**Route patient view update delete appointment*/}
      <Route path="/getAppointment" element={<ProtectedRoute requiredRole="Patient"><GetAppointment /></ProtectedRoute>}>
      </Route>
      {/**Điều hướng navbar */}
      <Route path="/listDoctorView" element={<ListDoctorView />} />


     
    </Routes>
  );
}

export default App;
