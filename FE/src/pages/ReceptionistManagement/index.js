import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './component/side_bar'; 
import Chatpopup_ForReceptionist from '../../layouts/ChatNotification/ChatPopup_ForReceptionist/ChatPopup_ForReceptionist';
import Footer from '../../layouts/Footer'; // Import Footer

function ReceptionistMana() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
            <Sidebar style={{ zIndex: 1000 }} />
            <div style={{ width: '100%', padding: '20px', position: 'relative', zIndex: 1 }}>
                <Outlet />
            </div>
            <Chatpopup_ForReceptionist />
        </div>
    );
}

export default ReceptionistMana;
