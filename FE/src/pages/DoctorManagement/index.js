// DocDash.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './component/side_bar'; 
import ChatPopup_ForPatient_Doctor from '../../layouts/ChatNotification/ChatPopup_ForPatient/ChatPopup_ForPatient';
import ChatPopup_ForDoctor from '../../layouts/ChatNotification/ChatPopup_ForDoctor/ChatPopup_ForDoctor';

function DoctorDash() {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ width: '100%', padding: '20px' }}>
                <Outlet />
            </div>
           <ChatPopup_ForDoctor/>
        </div>
    );
}

export default DoctorDash;
