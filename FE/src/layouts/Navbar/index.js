import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, InputBase, Button, Menu, MenuItem, Box, Typography } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../../utils/AuthContext'; // Adjust this path as needed
import { fetchDepartments } from '../../services/department_service'; // Adjust this path as needed
import axios from 'axios';

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
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const MenuTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  padding: theme.spacing(1),
}));

const MenuItemStyled = styled(MenuItem)(({ theme }) => ({
  fontSize: '16px',
  color: '#333',
  padding: '10px 15px',
  borderRadius: '4px',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
}));

const Navbar = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const navigate = useNavigate();
  const patientCheck = localStorage.getItem('role') === 'Patient' ? true : false;

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await fetchDepartments();
        setDepartments(data.$values || []); // Adjust based on actual response structure
      } catch (error) {
        console.error('Error loading departments:', error);
      }
    };

    loadDepartments();
  }, []);

  const handleDropdownToggle = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleMenuToggle = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchValue.trim()) {
      navigate(`/searchServicesList?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={handleMenuToggle}>
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-evenly' }}>
          <Button color="inherit" component={NavLink} to="/">Trang chủ</Button>
          <Button
            color="inherit"
            aria-controls="department-menu"
            aria-haspopup="true"
            onClick={handleDropdownToggle}
          >
            Chuyên khoa & Dịch vụ
          </Button>
          <Menu
            id="department-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleDropdownClose}
            sx={{
              '& .MuiMenu-paper': {
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
                padding: '10px',
                width: '400px',
                maxHeight: '600px',
                overflowY: 'auto',
              },
            }}
          >
            <MenuTitle variant="h6">Chuyên khoa</MenuTitle>
            {departments.map((department, index) => (
              <React.Fragment key={index}>
                <MenuTitle variant="h6" sx={{ mt: 2 }}>
                  {department.name}
                </MenuTitle>
                {/* Fetch services for this department */}
                <FetchServicesMenu departmentId={department.depId} />
              </React.Fragment>
            ))}
          </Menu>
          <Menu
            id="main-menu"
            anchorEl={menuAnchorEl}
            keepMounted
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            sx={{
              '& .MuiMenu-paper': {
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
                padding: '10px',
                width: '250px',
              },
            }}
          >
            <MenuItemStyled component={NavLink} to="/about-us">Giới thiệu</MenuItemStyled>
            <MenuItemStyled component={NavLink} to="/listDoctorView">Đội ngũ bác sĩ</MenuItemStyled>
            <MenuItemStyled component={NavLink} to="/viewAllBlogs">Tin tức y khoa</MenuItemStyled>
          </Menu>
          {isLoggedIn && (
            <>
              <Button color="inherit" component={NavLink} to="/getAppointment">Xem lịch khám</Button>
              <Button color="inherit" component={NavLink} to="/getMedicalNotebook">Tra cứu kết quả</Button>
              <Button color="inherit" component={NavLink} to="/getDoctorInteraction">Tư vấn online</Button>
              {patientCheck && (
                <Button color="inherit" component={NavLink} to="/patient-profile">Thông tin cá nhân</Button>
              )}
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

// Component to fetch and display services for a department
const FetchServicesMenu = ({ departmentId }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await axios.get(`https://localhost:7240/api/Department/GetServicesAndDetailsByDepartmentId/GetServicesByDepartment/${departmentId}`);
        setServices(response.data.$values || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    loadServices();
  }, [departmentId]);

  return (
    <>
      {services.map((service) => (
        <MenuItemStyled key={service.serviceId} component={NavLink} to={`/servicesByDepartment/${service.serviceId}`}>
          {service.name}
        </MenuItemStyled>
      ))}
    </>
  );
};

export default Navbar;
