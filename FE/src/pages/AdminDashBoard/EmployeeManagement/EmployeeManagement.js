import React, { useEffect, useState } from 'react';
import {
    Snackbar, Alert, Typography, Card, CardContent, Container, CircularProgress,
    Grid, Dialog, DialogTitle, DialogContent, TextField, Button, FormControl, InputLabel,
    Select, MenuItem, IconButton
} from '@mui/material';
import { fetchAllEmployees, addDoctor, addReceptionist } from '../../../services/EmployeeManagement'; // Adjust the import based on your file structure
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // States for dialogs
    const [openAddDoctorDialog, setOpenAddDoctorDialog] = useState(false);
    const [openAddReceptionistDialog, setOpenAddReceptionistDialog] = useState(false);

    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

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

    // States for new doctor and receptionist
    const [newDoctor, setNewDoctor] = useState({
        name: '',
        email: '',
        phone: '',
        age: '',
        gender: '',
        depId:''
    });
    const [newReceptionist, setNewReceptionist] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        roleId: 5,
        isActive: true
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
            depId: ''
        });
        setSelectedDepartment('');
        setValidationError('');
    };

    const handleAddDoctor = async () => {
        try {
            await addDoctor({ ...newDoctor, depId: selectedDepartment });
            handleCloseAddDoctorDialog();
            const data = await fetchAllEmployees();
            setEmployees(data);
            setSnackbarMessage('Doctor added successfully.');
            setSnackbarSeverity('success');
        } catch (error) {
            if (error.response && error.response.status === 500) {
                // Set a success message if status is 500
                setSnackbarMessage('Doctor added successfully, but there was an issue processing the request.');
                setSnackbarSeverity('success');
            } else {
                // Set an error message for other types of errors
                setSnackbarMessage('Failed to add new doctor.');
                setSnackbarSeverity('error');
            }
            setValidationError('Failed to add new doctor');
        } finally {
            setOpenSnackbar(true);
        }
    };

    const handleOpenAddReceptionistDialog = () => {
        setOpenAddReceptionistDialog(true);
    };

    const handleCloseAddReceptionistDialog = () => {
        setOpenAddReceptionistDialog(false);
        setNewReceptionist({
            name: '',
            email: '',
            phone: '',
            dob: '',
            gender: '',
            roleId: 0,
            isActive: true
        });
        setValidationError('');
    };

    const handleAddReceptionist = async () => {
        try {
            await addReceptionist(newReceptionist);
            handleCloseAddReceptionistDialog();
            const data = await fetchAllEmployees();
            setEmployees(data);
            setSnackbarMessage('Receptionist added successfully.');
            setSnackbarSeverity('success');
        } catch (error) {
            if (error.response && error.response.status === 500) {
                // Set a success message if status is 500
                setSnackbarMessage('Receptionist added successfully, but there was an issue processing the request.');
                setSnackbarSeverity('success');
            } else {
                // Set an error message for other types of errors
                setSnackbarMessage('Failed to add new receptionist.');
                setSnackbarSeverity('error');
            }
            setValidationError('Failed to add new receptionist');
        } finally {
            setOpenSnackbar(true);
        }
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
                onClick={handleOpenAddReceptionistDialog}
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
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
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
                <DialogTitle id="form-dialog-title">Add Doctor</DialogTitle>
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
                        label="Doctor Name"
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
                        label="Phone"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newDoctor.phone}
                        onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        id="age"
                        label="Age"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={newDoctor.age}
                        onChange={(e) => setNewDoctor({ ...newDoctor, age: e.target.value })}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="gender-label">Gender</InputLabel>
                        <Select
                            labelId="gender-label"
                            id="gender"
                            value={newDoctor.gender}
                            onChange={(e) => setNewDoctor({ ...newDoctor, gender: e.target.value })}
                            label="Gender"
                        >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="department-label">Department</InputLabel>
                        <Select
                            labelId="department-label"
                            id="department"
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            label="Department"
                        >
                            {departments.map((department) => (
                                <MenuItem key={department.depId} value={department.depId}>
                                    {department.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddDoctor}
                        style={{ marginTop: '20px' }}
                    >
                        Add
                    </Button>
                </DialogContent>
            </Dialog>

            <Dialog
                open={openAddReceptionistDialog}
                onClose={handleCloseAddReceptionistDialog}
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle id="form-dialog-title">Add Receptionist</DialogTitle>
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
                        label="Receptionist Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newReceptionist.name}
                        onChange={(e) => setNewReceptionist({ ...newReceptionist, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={newReceptionist.email}
                        onChange={(e) => setNewReceptionist({ ...newReceptionist, email: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        id="phone"
                        label="Phone"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newReceptionist.phone}
                        onChange={(e) => setNewReceptionist({ ...newReceptionist, phone: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        id="dob"
                        label="Date of Birth"
                        type="date"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={newReceptionist.dob}
                        onChange={(e) => setNewReceptionist({ ...newReceptionist, dob: e.target.value })}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="gender-label">Gender</InputLabel>
                        <Select
                            labelId="gender-label"
                            id="gender"
                            value={newReceptionist.gender}
                            onChange={(e) => setNewReceptionist({ ...newReceptionist, gender: e.target.value })}
                            label="Gender"
                        >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="dense">
                        <InputLabel id="isActive-label">Is Active</InputLabel>
                        <Select
                            labelId="isActive-label"
                            id="isActive"
                            value={newReceptionist.isActive}
                            onChange={(e) => setNewReceptionist({ ...newReceptionist, isActive: e.target.value })}
                            label="Is Active"
                        >
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddReceptionist}
                        style={{ marginTop: '20px' }}
                    >
                        Add
                    </Button>
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default EmployeeList;
