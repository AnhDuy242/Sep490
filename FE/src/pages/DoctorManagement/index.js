// DocDash.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './component/side_bar'; 

function AdminDash() {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ width: '100%', padding: '20px' }}>
                <Outlet />
            </div>
        </div>
    );
}

export default AdminDash;
