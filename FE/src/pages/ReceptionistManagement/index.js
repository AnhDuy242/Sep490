// AdminDash.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './component/side_bar'; 
import Chatpopup_ForReceptionist from '../../layouts/ChatNotification/ChatPopup_ForReceptionist/ChatPopup_ForReceptionist';

function ReceptionistMana() {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ width: '100%', padding: '20px' }}>
                <Outlet />
            </div>
             <Chatpopup_ForReceptionist /> 

        </div>
    );
}

export default ReceptionistMana;
