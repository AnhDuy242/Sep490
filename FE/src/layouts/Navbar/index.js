import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, InputBase, Button, Menu, MenuItem, Box } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import '../Navbar/navbar.css';
import { AuthContext } from '../../utils/AuthContext'; // Adjust this path as needed
import getAppointment from './../../pages/Appointment-patient/ViewInforAppoint';
import { Link, useNavigate } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Navbar = () => {
  const { isLoggedIn, token, updateToken, logout, role } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const handleDropdownToggle = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchClick = () => {
    console.log('Search clicked with value:', searchValue);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Button color="inherit" component={NavLink} to="/">Trang chủ</Button>
          <Button
            color="inherit"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleDropdownToggle}
          >
            Chuyên khoa & Dịch vụ
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleDropdownClose}
          >
            <MenuItem onClick={handleDropdownClose} component={NavLink} to="/category1">Category 1</MenuItem>
            <MenuItem onClick={handleDropdownClose} component={NavLink} to="/category2">Category 2</MenuItem>
          </Menu>
          <Button color="inherit" component={NavLink} to="/about-us">Giới thiệu</Button>
          <Button color="inherit" component={NavLink} to="/doctor">Đội ngũ bác sĩ</Button>
          <Button color="inherit" component={NavLink} to="/contact">Liên hệ</Button>
          <Button color="inherit" component={NavLink} to="/get-started" >Bạn có biết?</Button>
          {isLoggedIn && (
            <>
              <Button color="inherit" component={Link} to="/getAppointment">Xem lịch khám</Button>

              <Button color="inherit" component={Link} to="/getMedicalNotebook">Tra cứu kết quả</Button>
            </>
          )}
        </Box>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search..."
            value={searchValue}
            onChange={handleSearchChange}
          />
        </Search>
        <Button color="inherit" onClick={handleSearchClick}>
          <SearchIcon />
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
