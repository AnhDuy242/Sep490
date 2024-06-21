import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton, Typography, ListItemIcon, Collapse } from '@mui/material';
import { makeStyles } from '@mui/styles';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Mail';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import '../../../assets/css/sidebar_admin.css';
import backgroundImage from '../../../assets/images/background-img.jpg'; // Adjust the path accordingly

import { Link } from 'react-router-dom';

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
});

const Sidebar = () => {
  const classes = useStyles();
  const [openAccount, setOpenAccount] = useState(false);

  const handleAccountClick = () => {
    setOpenAccount(!openAccount);
  };

  const list = (
    <div className={classes.list}>
      <List>
        <ListItem button onClick={handleAccountClick} className={classes.listItem}>
          <ListItemIcon>
            <InboxIcon style={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Tài khoản" />
          {openAccount ? <ExpandLess style={{ color: 'white' }} /> : <ExpandMore style={{ color: 'white' }} />}
        </ListItem>
        {/* Collapse ẩn hiện danh sách con */}
        <Collapse in={openAccount} timeout="auto" unmountOnExit>
        {/* Các mục tài khoản trong tab Tài Khoản */}
          <List component="div" disablePadding>
            <ListItem button className={classes.nested} component={Link} to="/doctor-account">
              <ListItemText primary="Tài khoản bác sĩ" />
            </ListItem>
            <ListItem button className={classes.nested}  component={Link} to="/receptionist-account">
              <ListItemText primary="Tài khoản lễ tân" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem button className={classes.listItem}>
          <ListItemIcon>
            <MailIcon style={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Notification" />
        </ListItem>
        <ListItem button className={classes.listItem}>
          <ListItemIcon>
            <InboxIcon style={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Employee list" />
        </ListItem>
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
        <Typography variant="h6" className={classes.title}>
          <b>Admin screen</b>
        </Typography>
        {list}
      </Drawer>
    </div>
  );
};

export default Sidebar;
// import React, { useState } from 'react';
// import { Drawer, List, ListItem, ListItemText, ListItemIcon, Collapse, Typography } from '@mui/material';
// import { makeStyles } from '@mui/styles';
// import MenuIcon from '@mui/icons-material/Menu';
// import InboxIcon from '@mui/icons-material/Inbox';
// import MailIcon from '@mui/icons-material/Mail';
// import ExpandLess from '@mui/icons-material/ExpandLess';
// import ExpandMore from '@mui/icons-material/ExpandMore';
// import { Link } from 'react-router-dom';

// import backgroundImage from '../../../assets/images/background-img.jpg'; // Adjust the path accordingly

// const drawerWidth = '300px'; // Fixed width for the sidebar

// const useStyles = makeStyles({
//   drawer: {
//     width: drawerWidth,
//     flexShrink: 0,
//   },
//   drawerPaper: {
//     width: drawerWidth,
//     backgroundColor: '#3f51b5', // Background color of the sidebar
//     color: 'white', // Text color of the sidebar
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center', // Center the content vertically
//     backgroundImage: `url(${backgroundImage})`, // Background image for the sidebar
//     backgroundSize: 'cover', // Cover the entire sidebar
//     backgroundRepeat: 'no-repeat', // Prevent the background from repeating
//     backgroundPosition: 'center', // Center the background image
//     overflow: 'hidden', // Prevent horizontal scroll
//   },
//   menuButton: {
//     marginRight: 16, // Space between the icon and content
//   },
//   listItem: {
//     display: 'flex',
//     justifyContent: 'center', // Center the content horizontally within the list item
//     alignItems: 'center', // Center the content vertically within the list item
//     '&:hover': {
//       backgroundColor: '#32408f', // Background color on hover
//     },
//   },
//   list: {
//     width: '100%', // Ensure the list takes the full width of the sidebar
//     color: 'white',
//   },
//   title: {
//     margin: '20px 0', // Space around the title
//     padding: '10px', // Padding inside the title
//     backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for the title
//     width: '100%', // Ensure the title takes the full width of the sidebar
//     textAlign: 'center', // Center the text horizontally
//     color: 'white',
//   },
//   nested: {
//     paddingLeft: '2em', // Indentation for nested items
//     color: 'white',
//     textAlign: 'left', // Align text to the left
//   },
// });

// const Sidebar = () => {
//   const classes = useStyles();
//   const [openAccount, setOpenAccount] = useState(false);

//   const handleAccountClick = () => {
//     setOpenAccount(!openAccount);
//   };

//   return (
//     <div>
//       <Drawer
//         className={classes.drawer}
//         variant="permanent" // The sidebar is always visible
//         anchor="left"
//         open={true}
//         classes={{
//           paper: classes.drawerPaper,
//         }}
//       >
//         <Typography variant="h6" className={classes.title}>
//           <b>Admin screen</b>
//         </Typography>
//         <List>
//           <ListItem button onClick={handleAccountClick} className={classes.listItem}>
//             <ListItemIcon>
//               <InboxIcon style={{ color: 'white' }} />
//             </ListItemIcon>
//             <ListItemText primary="Tài khoản" style={{ color: 'white', textAlign: 'left' }} /> {/* Sửa dòng này */}
//             {openAccount ? <ExpandLess style={{ color: 'white' }} /> : <ExpandMore style={{ color: 'white' }} />}
//           </ListItem>
//           <Collapse in={openAccount} timeout="auto" unmountOnExit>
//             <List component="div" disablePadding>
//               <ListItem button className={`${classes.nested} ${classes.listItem}`} component={Link} to="/doctor-account">
//                 <ListItemText primary="Tài khoản bác sĩ" style={{ color: 'white' }} /> {/* Sửa dòng này */}
//               </ListItem>
//               <ListItem button className={`${classes.nested} ${classes.listItem}`}>
//                 <ListItemText primary="Tài khoản lễ tân" style={{ color: 'white' }} /> {/* Sửa dòng này */}
//               </ListItem>
//             </List>
//           </Collapse>
//           <ListItem button className={classes.listItem} component={Link} to="/notification">
//             <ListItemIcon>
//               <MailIcon style={{ color: 'white' }} />
//             </ListItemIcon>
//             <ListItemText primary="Notification" style={{ color: 'white', textAlign: 'left' }} /> {/* Sửa dòng này */}
//           </ListItem>
//           <ListItem button className={classes.listItem} component={Link} to="/employee-list">
//             <ListItemIcon>
//               <InboxIcon style={{ color: 'white' }} />
//             </ListItemIcon>
//             <ListItemText primary="Employee list" style={{ color: 'white', textAlign: 'left' }} /> {/* Sửa dòng này */}
//           </ListItem>
//         </List>
//       </Drawer>
//     </div>
//   );
// };

// export default Sidebar;
