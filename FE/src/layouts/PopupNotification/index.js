import React, { useState, useEffect } from 'react';
import { Badge, IconButton, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationSidebar from '../PopupNotification/NotificationSideBar'; // Đảm bảo đường dẫn chính xác

const NotificationButton = () => {
    const [notifications, setNotifications] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        // Giả lập gọi API để lấy số lượng thông báo
        const fetchNotifications = () => {
            setTimeout(() => {
                // Giả sử API trả về một danh sách thông báo
                setNotifications(['Notification 1', 'Notification 2', 'Notification 3']);
            }, 2000); // Giả lập thời gian chờ 2 giây
        };

        fetchNotifications();
    }, []);

    const handleNotificationClick = () => {
        setSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
            <IconButton color="primary" onClick={handleNotificationClick}>
                <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon fontSize="large" />
                </Badge>
            </IconButton>
            <NotificationSidebar
                open={sidebarOpen}
                onClose={handleCloseSidebar}
                notifications={notifications}
            />
        </Box>
    );
};

export default NotificationButton;
