import React, { useState, useEffect } from 'react';
import { Badge, IconButton, Box, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationSidebar from '../PopupNotification/NotificationSideBar'; 
import notificationSound from '../../assets/sound/notification_sound.mp3';

const NotificationButton = () => {
    const [notifications, setNotifications] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [newNotification, setNewNotification] = useState('');
    const wonAudio = new Audio(notificationSound);
    useEffect(() => {
        // Giả lập gọi API để lấy số lượng thông báo ban đầu
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

    const addNewNotification = () => {
        const newMessage = 'New Notification ' + (notifications.length + 1);
        setNotifications([...notifications, newMessage]);
        setNewNotification(newMessage);
        wonAudio.play();
        setTimeout(() => {
            setNewNotification('');
        }, 3000);
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
            {newNotification && (
                <Box sx={{
                    position: 'fixed',
                    bottom: 70,
                    right: 16,
                    backgroundColor: 'white',
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                    zIndex: 1000,
                }}>
                    {newNotification}
                </Box>
            )}
            {/* Button chỉ để test thêm thông báo */}
            <Box sx={{ position: 'fixed', bottom: 16, right: 80 }}>
                <Button variant="contained" color="primary" onClick={addNewNotification}>
                    Add Notification
                </Button>
            </Box>
        </Box>
    );
};

export default NotificationButton;
