// AdminDash.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './component/side_bar'; 

function ReceptionistMana() {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ width: '100%', padding: '20px' }}>
                <Outlet />
            </div>
        </div>
    );
}

export default ReceptionistMana;
