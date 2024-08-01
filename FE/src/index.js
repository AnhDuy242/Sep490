import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom'; // Sử dụng BrowserRouter
import App from './App';
import reportWebVitals from './reportWebVitals';
import Sidebar from './pages/AdminDashBoard/component/side_bar';
import AdminDash from './pages/AdminDashBoard';
import View_schedule from './pages/AdminDashBoard/schedule_doctor_admin';
import ChatPopup from './layouts/ChatNotification';
import ConsultantChat from './layouts/ChatNotification/ConsultantChat';
import { AuthProvider } from './utils/AuthContext'
import Create_CustomerFeedack from '../src/pages/Feedback/Create_CustomerFeedback';
import ScrollToTopButton from './layouts/ScrolltoTop/ScrolltoTop';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <Router>
    <AuthProvider> */}
    {/* <App /> */}
    {/* <Sidebar /> */}
    {/* <View_appointment /> */}
    {/* <AdminDash /> */}
    {/* <MedicalNotebookForPatient/>
      </AuthProvider>

    </Router> */}

    <Router>
      <AuthProvider>
        <App />
        {/* <Create_CustomerFeedack/> */}
        <ScrollToTopButton/>
      </AuthProvider>
    </Router>

  </React.StrictMode>
);

// Nếu bạn muốn bắt đầu đo hiệu suất trong ứng dụng của mình, hãy chuyển một hàm
// để ghi lại kết quả (ví dụ: reportWebVitals(console.log))
// hoặc gửi đến một endpoint phân tích. Tìm hiểu thêm: https://bit.ly/CRA-vitals
reportWebVitals();
