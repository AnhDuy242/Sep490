import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom'; // Sử dụng BrowserRouter
import App from './App';
import reportWebVitals from './reportWebVitals';
import Sidebar from './pages/AdminDashBoard/component/side_bar';
import AdminDash from './pages/AdminDashBoard';
import View_appointment from './pages/AdminDashBoard/view_appoiment_admin';
import { AuthProvider } from './utils/AuthContext';
import MedicalNotebookForPatient from './pages/MedicalNotebook-patient'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
    <AuthProvider>
      {/* <App /> */}
      {/* <Sidebar /> */}
      {/* <View_appointment /> */}
      {/* <AdminDash /> */}
      <MedicalNotebookForPatient/>
      </AuthProvider>

    </Router>
  </React.StrictMode>
);

// Nếu bạn muốn bắt đầu đo hiệu suất trong ứng dụng của mình, hãy chuyển một hàm
// để ghi lại kết quả (ví dụ: reportWebVitals(console.log))
// hoặc gửi đến một endpoint phân tích. Tìm hiểu thêm: https://bit.ly/CRA-vitals
reportWebVitals();
