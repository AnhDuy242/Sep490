import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = '25%'; // Độ rộng của sidebar là 25% của màn hình

const useStyles = makeStyles({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#3f51b5', // Màu nền của sidebar
    color: 'white', // Màu chữ của sidebar
  },
  menuButton: {
    marginRight: 16, // Khoảng cách giữa icon và nội dung
  },
});

const Sidebar = () => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(true); // Sidebar luôn mở khi vào ứng dụng

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  const list = (
    <div
      className={classes.drawerPaper}
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {['Item 1', 'Item 2', 'Item 3'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={toggleDrawer(true)}
        className={classes.menuButton}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        className={classes.drawer}
        variant="persistent" // Hiển thị sidebar luôn hiển thị
        anchor="left"
        open={isOpen}
        onClose={toggleDrawer(false)}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        {list}
      </Drawer>
    </div>
  );
};

export default Sidebar;
