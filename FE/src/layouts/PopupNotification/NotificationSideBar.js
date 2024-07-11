import React from 'react';
import { Drawer, List, ListItem, ListItemText, Box, Typography, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

const NotificationSidebar = ({ open, onClose, notifications }) => {
    return (
        <Drawer anchor="right" open={open} onClose={onClose} transitionDuration={500} >
            <Box
                sx={{ width: 300, padding: 2 }}
                role="presentation"
                onClick={onClose}
                onKeyDown={onClose}
            >
                 <IconButton onClick={onClose} variant="h6" >
                    <Close />
                </IconButton>
                <Typography variant="h6" gutterBottom>
                    Notifications
                </Typography>
               
                <List>
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <ListItem button key={index}>
                                <ListItemText primary={notification} />
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            No new notifications
                        </Typography>
                    )}
                </List>
            </Box>
        </Drawer>
    );
};

export default NotificationSidebar;
