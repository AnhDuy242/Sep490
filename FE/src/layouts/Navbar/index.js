import React, { useState, useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, InputBase, Button, Menu, MenuItem, Box } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../../utils/AuthContext'; // Adjust this path as needed
import { fetchServices } from '../../services/department_service'; // Adjust this path as needed

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
  const { isLoggedIn } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [services, setServices] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchServices();
        setServices(data.$values || []); // Adjust based on actual response structure
      } catch (error) {
        console.error('Error loading services:', error);
      }
    };

    loadServices();
  }, []);

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
            sx={{
              '& .MuiMenu-paper': {
                borderRadius: '8px', /* Rounded corners */
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', /* Shadow for depth */
                backgroundColor: '#fff', /* Background color */
                padding: '10px', /* Padding inside the menu */
                width: '400px', /* Wider dropdown */
                maxHeight: '600px', /* Longer dropdown */
                overflowY: 'auto', /* Add scrollbar if content exceeds maxHeight */
              },
              '& .MuiMenuItem-root': {
                fontSize: '16px', /* Font size */
                color: '#333', /* Text color */
                padding: '10px 15px', /* Padding for items */
                borderRadius: '4px', /* Rounded corners for items */
                transition: 'background-color 0.3s ease', /* Smooth background color transition */
              },
              '& .MuiMenuItem-root:hover': {
                backgroundColor: '#f5f5f5', /* Hover background color */
              },
            }}
          >
            {services.map((service, index) => (
              <MenuItem key={index} onClick={handleDropdownClose} component={NavLink} to={`/service/${service.serviceId}`}>
                {service.name}
              </MenuItem>
            ))}
          </Menu>
          <Button color="inherit" component={NavLink} to="/about-us">Giới thiệu</Button>
          <Button color="inherit" component={NavLink} to="/listDoctorView">Đội ngũ bác sĩ</Button>
          {isLoggedIn && (
            <>
              <Button color="inherit" component={NavLink} to="/getAppointment">Xem lịch khám</Button>
              <Button color="inherit" component={NavLink} to="/getMedicalNotebook">Tra cứu kết quả</Button>
              <Button color="inherit" component={NavLink} to="/getDoctorInteraction">Tư vấn online</Button>
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
