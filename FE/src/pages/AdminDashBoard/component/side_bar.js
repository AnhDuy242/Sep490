import React from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton, Typography, ListItemIcon } from '@mui/material';
import { makeStyles } from '@mui/styles';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Mail';
import '../../../assets/css/sidebar_admin.css';
import backgroundImage from '../../../assets/images/background-img.jpg'; // Adjust the path accordingly

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
     color:'white'
  },
  title: {
    margin: '20px 0', // Space around the title
    padding: '10px', // Padding inside the title
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for the title
    width: '100%', // Ensure the title takes the full width of the sidebar
    textAlign: 'center', // Center the text horizontally
    color:'white'
  },
});

const Sidebar = () => {
  const classes = useStyles();

  const list = (
    <div className={classes.list}>
      <List>
        {['Account', 'Notification', 'Employee list'].map((text, index) => (
          <ListItem button key={text} className={classes.listItem} >
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon style={{ color: 'white' }} /> : <MailIcon style={{ color: 'white' }} />}
            </ListItemIcon>
            <ListItemText primary={text} color='white' />
          </ListItem>
        ))}
      </List>
    </div>
  );

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
        <Typography variant="h6" className={classes.title} >
          <b>Admin screen</b>
        </Typography>
        {list}
      </Drawer>
    </div>
  );
};

export default Sidebar;
