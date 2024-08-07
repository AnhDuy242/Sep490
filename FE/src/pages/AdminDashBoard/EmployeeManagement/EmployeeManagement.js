import React, { useEffect, useState } from 'react';
import {
    Snackbar, Alert, Typography, Card, CardContent, Container, CircularProgress,
    Grid, Dialog, DialogTitle, DialogContent, TextField, Button, FormControl, InputLabel,
    Select, MenuItem, IconButton
} from '@mui/material';
import { fetchAllEmployees, addDoctor, addReceptionist, updateEmployeeStatus, updateDoctorStatus  } from '../../../services/EmployeeManagement'; // Adjust the import based on your file structure
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme, roleId }) => ({
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    transition: '0.3s',
    cursor: 'pointer',
    position: 'relative',
    backgroundColor: roleId === 5 ? '#d0f0c0' : '#f8d7da', // Conditional background color
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: theme.shadows[5],
    },
}));

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate(); // Initialize useNavigate

    // States for dialogs
    const [openAddDoctorDialog, setOpenAddDoctorDialog] = useState(false);
    const [openAddReceptionistDialog, setOpenAddReceptionistDialog] = useState(false);
    const [openStatusDialog, setOpenStatusDialog] = useState(false);

    // States for search and filter
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    // States for new doctor and receptionist
    const [validationError, setValidationError] = useState('');
    const [currentEmployee, setCurrentEmployee] = useState(null);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await fetch('https://localhost:7240/api/Department/GetDepartments'); // Adjust URL if needed
                const data = await response.json();
                setDepartments(data.$values);
            } catch (error) {
                console.error('Failed to fetch departments:', error);
            }
        };

        fetchDepartments();
    }, []);

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const data = await fetchAllEmployees();
                setEmployees(data);
                setLoading(false);
            } catch (error) {
                setError('Không thể tải danh sách nhân viên.');
                setSnackbarMessage('Không thể tải danh sách nhân viên.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                setLoading(false);
            }
        };

        loadEmployees();
    }, []);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleOpenAddDoctorDialog = () => {
        navigate('/admin/dashboard/receptionist-account'); // Navigate to the add doctor page
    };

    const handleOpenAddReceptionistDialog = () => {
        navigate('/admin/dashboard/receptionist-account'); // Navigate to the add receptionist page
    };


    const handleOpenStatusDialog = (employee) => {
        setCurrentEmployee(employee);
        setOpenStatusDialog(true);
    };

    const handleCloseStatusDialog = () => {
        setOpenStatusDialog(false);
        setCurrentEmployee(null);
    };

    const handleStatusChange = async () => {
        try {
            if (currentEmployee) {
                if (currentEmployee.roleId !== 5) {
                    // Update status for doctors
                    await updateDoctorStatus(currentEmployee.accId, !currentEmployee.isActive);
                } else {
                    // Update status for other employees
                    const response = await updateEmployeeStatus(currentEmployee.accId, !currentEmployee.isActive);
                    // Handle the plain text response here if needed
                    console.log(response); // Log the response if needed
                }
                handleCloseStatusDialog();
                const data = await fetchAllEmployees();
                setEmployees(data);
                setSnackbarMessage('Cập nhật trạng thái thành công.');
                setSnackbarSeverity('success');
            }
        } catch (error) {
            setSnackbarMessage('Cập nhật trạng thái thất bại.');
            setSnackbarSeverity('error');
            console.error('Failed to update status:', error);
        } finally {
            setOpenSnackbar(true);
        }
    };
    

    const filteredEmployees = employees.filter(employee => {
        const matchesName = employee.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === '' || (roleFilter === 'Doctor' && employee.roleId !== 5) || (roleFilter === 'Receptionist' && employee.roleId === 5);
        return matchesName && matchesRole;
    });

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Danh sách nhân viên
            </Typography>
            <TextField
                label="Tìm kiếm theo tên"
                variant="outlined"
                fullWidth
                margin="dense"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FormControl fullWidth margin="dense">
                <InputLabel id="role-filter-label">Vai trò</InputLabel>
                <Select
                    labelId="role-filter-label"
                    id="role-filter"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    label="Vai trò"
                >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="Doctor">Bác sĩ</MenuItem>
                    <MenuItem value="Receptionist">Lễ tân</MenuItem>
                </Select>
            </FormControl>

            <Button
                variant="contained"
                color="primary"
                onClick={handleOpenAddDoctorDialog}
                startIcon={<AddIcon />}
            >
                Thêm bác sĩ
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={handleOpenAddReceptionistDialog}
                startIcon={<AddIcon />}
                style={{ marginLeft: '10px' }}
            >
                Thêm lễ tân
            </Button>

            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={2}>
                    {filteredEmployees.map((employee) => (
                        <Grid item xs={12} sm={6} md={4} key={employee.accId}>
                            <StyledCard
                                roleId={employee.roleId}
                                onClick={() => handleOpenStatusDialog(employee)}
                            >
                                <CardContent>
                                    <Typography variant="h6">
                                        {employee.name}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        {employee.email}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        {employee.phone}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        {employee.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                                    </Typography>
                                    <IconButton
                                        edge="end"
                                        color="inherit"
                                        aria-label="edit"
                                        style={{ position: 'absolute', top: '10px', right: '10px' }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </CardContent>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>


            {/* Status Dialog */}
            <Dialog open={openStatusDialog} onClose={handleCloseStatusDialog}>
                <DialogTitle>Cập nhật trạng thái</DialogTitle>
                <DialogContent>
                    <Typography variant="h6">
                        {currentEmployee ? `Bạn có muốn cập nhật trạng thái của ${currentEmployee.name}?` : ''}
                    </Typography>
                </DialogContent>
                <Button onClick={handleStatusChange} color="primary">
                    Cập nhật
                </Button>
                <Button onClick={handleCloseStatusDialog} color="secondary">
                    Hủy
                </Button>
            </Dialog>
        </Container>
    );
};

export default EmployeeList;
