import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton, Typography, ListItemIcon, Collapse } from '@mui/material';
import { makeStyles } from '@mui/styles';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/Inbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import backgroundImage from '../../../assets/images/background-img.jpg'; // Adjust the path accordingly

const drawerWidth = '300px';

const useStyles = makeStyles({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#3f51b5',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    overflow: 'hidden',
  },
  title: {
    margin: '20px 0',
    padding: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    textAlign: 'center',
    color: 'white',
  },
  list: {
    width: '100%',
    color: 'white',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nested: {
    paddingLeft: '2em',
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
          <ListItemText primary="Danh sách" />
          {openAccount ? <ExpandLess style={{ color: 'white' }} /> : <ExpandMore style={{ color: 'white' }} />}
        </ListItem>
        <Collapse in={openAccount} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button className={classes.nested} component={Link} to="/article/dashboard/list_article">
              <ListItemText primary="Danh sách tác giả" />
            </ListItem>
            <ListItem button className={classes.nested} component={Link} to="/article/dashboard/list_blog">
              <ListItemText primary="Danh sách bài viết" />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </div>
  );

  return (
    <div>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        anchor="left"
        open={true}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Typography variant="h6" className={classes.title}>
          <b>Article Management</b>
        </Typography>
        {list}
      </Drawer>
    </div>
  );
};

export default Sidebar;
