import React, { useState, useContext } from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Collapse, Typography, Box, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Mail';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../../../assets/images/background-img.jpg'; // Adjust the path accordingly
// import { logout } from '../../../services/Authentication';
import { AuthContext } from '../../../utils/AuthContext'; // Adjust this path as needed

const drawerWidth = '300px'; // Fixed width for the sidebar

const useStyles = makeStyles({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#3f51b5', // Background color of the sidebar
    color: 'white', // Text color of the sidebar
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center the content vertically
    backgroundImage: `url(${backgroundImage})`, // Background image for the sidebar
    backgroundSize: 'cover', // Cover the entire sidebar
    backgroundRepeat: 'no-repeat', // Prevent the background from repeating
    backgroundPosition: 'center', // Center the background image
    overflow: 'hidden', // Prevent horizontal scroll
  },
  menuButton: {
    marginRight: 16, // Space between the icon and content
  },
  listItem: {
    display: 'flex',
    justifyContent: 'center', // Center the content horizontally within the list item
    alignItems: 'center', // Center the content vertically within the list item
  },
  list: {
    width: '100%', // Ensure the list takes the full width of the sidebar
    color: 'white',
  },
  title: {
    margin: '20px 0', // Space around the title
    padding: '10px', // Padding inside the title
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for the title
    width: '100%', // Ensure the title takes the full width of the sidebar
    textAlign: 'center', // Center the text horizontally
    color: 'white',
  },
  nested: {
    paddingLeft: '2em', // Indentation for nested items
    color: 'white',
  },
  logoutButton: {
    marginTop: 'auto', // Push the button to the bottom
    marginBottom: '20px',
    backgroundColor: 'rgba(255, 0, 0, 0.7)', // Red background for the logout button
    color: 'white', // White text color for the logout button
    '&:hover': {
      backgroundColor: 'rgba(255, 0, 0, 1)', // Darker red on hover
    },
  },
});

const Sidebar = () => {
  const classes = useStyles();
  const navigate = useNavigate(); // Hook for navigation
  const [openAccount, setOpenAccount] = useState(false);

  const handleAccountClick = () => {
    setOpenAccount(!openAccount);
  };
  const { isLoggedIn, token, updateToken, logout, role } = useContext(AuthContext);

  const handleLogoutClick = () => {
    logout();
    navigate('/'); // Redirect to home after logout
  };

  return (
    <div>
      <Drawer
        className={classes.drawer}
        variant="permanent" // The sidebar is always visible
        anchor="left"
        open={true}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Typography variant="h6" className={classes.title}>
          <b>Quản lý</b>
        </Typography>
        <List className={classes.list}>

          {/* <ListItem button className={classes.listItem} component={Link} to="/doctor/dasboard/create-mdeical-notebook"> 
            <ListItemIcon>
              <InboxIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Tạo sổ tay khám bệnh" />
          </ListItem> */}
            <ListItem button className={classes.listItem} component={Link} to="/doctor/dasboard/doctor-profile"> 
            <ListItemIcon>
              <InboxIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Thông tin cá nhân" />
          </ListItem>
          <ListItem button className={classes.listItem} component={Link} to="/doctor/dasboard/viewweeklyschedule"> 
            <ListItemIcon>
              <InboxIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Xem lịch làm việc hàng tuần" />
          </ListItem>
          <ListItem button className={classes.listItem} component={Link} to="/doctor/dasboard/getAppointment-doctor"> 
            <ListItemIcon>
              <InboxIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Xem các cuộc hẹn" />
          </ListItem>
          <ListItem button className={classes.listItem} component={Link} to="/doctor/dasboard/doctor-answer-question"> 
            <ListItemIcon>
              <InboxIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Trả lời câu hỏi bệnh nhân" />
          </ListItem>
          <ListItem button className={classes.listItem} component={Link} to="/doctor/dasboard/view-online-patient"> 
            <ListItemIcon>
              <InboxIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Xem bệnh nhân đang hoạt động" />
          </ListItem>
          <ListItem button className={classes.listItem} component={Link} to="/doctor/dasboard/examinatedpatients"> 
            <ListItemIcon>
              <InboxIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Tương tác với các bệnh nhân đã khám" />
          </ListItem>
          <ListItem button className={classes.listItem} component={Link} to="/doctor/dasboard/medical-notebook-save"> 
            <ListItemIcon>
              <InboxIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Kho lưu trữ bệnh án" />
          </ListItem>
        
        </List>
        <Box width="100%" display="flex" justifyContent="center">
          <Button variant="contained" className={classes.logoutButton} onClick={handleLogoutClick}>
            Logout
          </Button>
        </Box>
      </Drawer>
    </div>
  );
};

export default Sidebar;
