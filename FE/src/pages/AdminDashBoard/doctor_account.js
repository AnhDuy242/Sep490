import React, { useEffect, useState } from 'react';
import {
    Snackbar, Alert, Typography, Card, CardContent, Container, CircularProgress,
    Grid, Dialog, DialogTitle, DialogContent, TextField, Button, FormControl, InputLabel,
    Select, MenuItem
} from '@mui/material';
import { fetchAllEmployees, addDoctor } from '../../services/EmployeeManagement'; // Adjust the import based on your file structure
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';

const StyledCard = styled(Card)(({ theme, roleId }) => ({
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    transition: '0.3s',
    cursor: 'pointer',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: theme.shadows[5],
    },
    backgroundColor: roleId === 5 ? '#d0f0c0' : '#f8d7da', // Conditional background color
}));

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]); // New state for departments
    const [loading, setLoading] = useState(true);
    const [departmentsLoading, setDepartmentsLoading] = useState(true); // State for departments loading
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Dialog and form state
    const [openAddDoctorDialog, setOpenAddDoctorDialog] = useState(false);
    const [newDoctor, setNewDoctor] = useState({
        name: '',
        email: '',
        phone: '',
        age: '',
        gender: '',
        depId: '', // Add department ID to form state
    });
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const data = await fetchAllEmployees();
                setEmployees(data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load employees.');
                setSnackbarMessage('Failed to load employees.');
                setOpenSnackbar(true);
                setLoading(false);
            }
        };

        const loadDepartments = async () => {
            try {
                const response = await fetch('https://localhost:7240/api/Department/GetDepartments');
                const data = await response.json();
                setDepartments(data.$values); // Adjust if necessary
                setDepartmentsLoading(false);
            } catch (error) {
                console.error('Error fetching departments:', error);
                setDepartmentsLoading(false); // Ensure loading state is turned off even if there is an error
            }
        };

        loadEmployees();
        loadDepartments();
    }, []);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleOpenAddDoctorDialog = () => {
        setOpenAddDoctorDialog(true);
    };

    const handleCloseAddDoctorDialog = () => {
        setOpenAddDoctorDialog(false);
        setNewDoctor({
            name: '',
            email: '',
            phone: '',
            age: '',
            gender: '',
            depId: '', // Reset department ID
        });
        setValidationError('');
    };

    const handleAddDoctor = async () => {
        // Add validation here if necessary
        try {
            await addDoctor(newDoctor);
            handleCloseAddDoctorDialog();
            // Reload employee list after adding a new doctor
            const data = await fetchAllEmployees();
            setEmployees(data);
        } catch (error) {
            setValidationError('Failed to add new doctor');
        }
    };

    const handleAddReceptionist = () => {
        // Implementation similar to handleAddDoctor
        // Add logic to show a dialog for adding receptionist
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Employee List
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddReceptionist} // Open a dialog for adding receptionist
            >
                Add Receptionist
            </Button>
            <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={handleOpenAddDoctorDialog}
                style={{ marginLeft: '10px' }}
            >
                Add Doctor
            </Button>
            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={2}>
                    {employees.map((employee) => (
                        <Grid item xs={12} sm={6} md={4} key={employee.accId}>
                            <StyledCard roleId={employee.roleId}>
                                <CardContent>
                                    <Typography variant="h6">
                                        {employee.name} ({employee.roleId === 5 ? 'Receptionist' : 'Doctor'})
                                    </Typography>
                                    <Typography variant="body2">
                                        Email: {employee.email || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2">
                                        Phone: {employee.phone || 'N/A'}
                                    </Typography>
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
                <Alert onClose={handleCloseSnackbar} severity="error">
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Dialog
                open={openAddDoctorDialog}
                onClose={handleCloseAddDoctorDialog}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle id="form-dialog-title">Thêm bác sĩ</DialogTitle>
                <DialogContent>
                    {validationError && (
                        <Typography color="error" gutterBottom>
                            {validationError}
                        </Typography>
                    )}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Tên bác sĩ"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newDoctor.name}
                        onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={newDoctor.email}
                        onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        id="phone"
                        label="Số điện thoại"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newDoctor.phone}
                        onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        id="age"
                        label="Tuổi"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={newDoctor.age}
                        onChange={(e) => setNewDoctor({ ...newDoctor, age: e.target.value })}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="gender-label">Giới tính</InputLabel>
                        <Select
                            labelId="gender-label"
                            id="gender"
                            value={newDoctor.gender}
                            onChange={(e) => setNewDoctor({ ...newDoctor, gender: e.target.value })}
                            label="Giới tính"
                        >
                            <MenuItem value="Nam">Nam</MenuItem>
                            <MenuItem value="Nữ">Nữ</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="depId-label">Chuyên khoa</InputLabel>
                        <Select
                            labelId="depId-label"
                            id="depId"
                            value={newDoctor.depId || ''}
                            onChange={(e) => setNewDoctor({ ...newDoctor, depId: e.target.value })}
                            label="Chuyên khoa"
                            disabled={departmentsLoading} // Disable select while loading departments
                        >
                            {departments.map((dep) => (
                                <MenuItem key={dep.depId} value={dep.depId}>
                                    {dep.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddDoctor}
                        style={{ marginTop: '20px' }}
                        disabled={departmentsLoading} // Disable button while loading departments
                    >
                        Thêm
                    </Button>
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default EmployeeList;
