import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './component/side_bar'; // Điều chỉnh đường dẫn tùy vào cấu trúc project của bạn
import DoctorAccount from '../AdminDashBoard/doctor_account'; // Điều chỉnh đường dẫn tùy vào cấu trúc project của bạn
import Home from '../Home';

function AdminDash() {
    return (
        <Router>
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ marginLeft: '300px', width: '100%', padding: '20px' }}>
                    <Routes>
                        <Route path="/doctor-account" element={<DoctorAccount />} />
                        {/* Các Route khác nếu có */}
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default AdminDash;
