import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './component/side_bar';
import { Helmet } from 'react-helmet';

const DoctorDash = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const doctorId = localStorage.getItem('accountId');

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch(`https://localhost:7240/api/Messages/GetAllUnreadCount/GetUnreadCount?receiverId=${doctorId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUnreadCount(data); // Assuming the API returns a single number
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();
  }, [doctorId]);

  return (
    <div style={{ display: 'flex' }}>
      <Helmet>
        <title>{unreadCount > 0 ? `Có ${unreadCount} tin nhắn mới` : 'Phòng khám 68A'}</title>
      </Helmet>
      <Sidebar />
      <div style={{ width: '100%', padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default DoctorDash;
