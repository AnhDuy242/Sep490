import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, Typography, List, ListItem, ListItemText, Container, CircularProgress } from '@mui/material';
import { fetchAllEmployees } from '../../../services/EmployeeManagement'; // Adjust the import based on your file structure

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

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

        loadEmployees();
    }, []);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Employee List
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : (
                <List>
                    {employees.map((employee) => (
                        <ListItem key={employee.id}>
                            <ListItemText
                                primary={`${employee.name} (${employee.role})`}
                                secondary={`Email: ${employee.email}, Phone: ${employee.phone}`}
                            />
                        </ListItem>
                    ))}
                </List>
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
        </Container>
    );
};

export default EmployeeList;
