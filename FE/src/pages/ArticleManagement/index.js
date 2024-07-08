// AdminDash.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './component/side_bar'; 

function ArticleDash() {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ width: '100%', padding: '20px' }}>
                <Outlet />
            </div>
            day la man hinh article
        </div>
    );
}

export default ArticleDash;
