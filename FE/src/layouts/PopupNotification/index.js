import React, { useState, useEffect } from 'react';
import { Badge, IconButton, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationButton = () => {
    const [notifications, setNotifications] = useState(0);

    useEffect(() => {
        // Giả lập gọi API để lấy số lượng thông báo
        const fetchNotifications = () => {
            setTimeout(() => {
                // Giả sử API trả về 3 thông báo mới
                setNotifications(3);
            }, 2000); // Giả lập thời gian chờ 2 giây
        };

        fetchNotifications();
    }, []);

    return (
        <Box sx={{ position: 'fixed', bottom: 16}}>
            <IconButton color="primary">
                <Badge badgeContent={notifications} color="error">
                    <NotificationsIcon fontSize="large" />
                </Badge>
            </IconButton>
        </Box>
    );
};

export default NotificationButton;
