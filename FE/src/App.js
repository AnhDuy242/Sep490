import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminDash from '../src/pages/AdminDashBoard/index'; // Sửa lại đường dẫn nếu cần
import DoctorAccount from './pages/AdminDashBoard/doctor_account'; // Điều chỉnh đường dẫn tùy vào cấu trúc project của bạn
import ReceptionistAccount from './pages/AdminDashBoard/receptionist_account'; // Điều chỉnh đường dẫn tùy vào cấu trúc project của bạn
import ProtectedRoute from './pages/AdminDashBoard/component/protected_route';
import ListArticle from './pages/ArticleManagement/list_article';
import ListBlog from './pages/ArticleManagement/list_blog';
import ArticleDash from './pages/ArticleManagement';
function App() {
  return (

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="Admin"><AdminDash /></ProtectedRoute>}>
      <Route path="/admin/dashboard/doctor-account" element={<DoctorAccount/>} />
        <Route path="/admin/dashboard/receptionist-account" element={<ReceptionistAccount/>} />
      </Route>


      <Route path="/article/dashboard/" element={<ProtectedRoute requiredRole="ArticleManager"><ArticleDash /></ProtectedRoute>}>
      <Route path="/article/dashboard/list_blog" element={<ListBlog/>} />
        <Route path="list_article" element={<ListArticle/>} />
      </Route>
    </Routes>


  );
}

export default App;
