import React, { useState, useEffect } from 'react';
import {
    Container, TextField, Button, IconButton, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Checkbox, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle, Avatar, Typography, TablePagination, FormControl, InputLabel, Select, MenuItem, FormHelperText
} from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import {
    fetchReceptionists,
    loadReceptionists,
    deleteReceptionist,
    addReceptionist,
    deleteMultipleReceptionists,
} from '../../services/receptionist_service'; // Import API functions
import './component/ReceptionistAccount.css'; // Import CSS

const ReceptionistAccount = () => {
    const [accounts, setAccounts] = useState([]);
    const [selected, setSelected] = useState([]);
    const [selected2,setSelected2] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('name');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false); // State to manage confirmation dialog
    const [confirmOpen2, setConfirmOpen2] = useState(false); // State to manage confirmation dialog

    const [currentAccount, setCurrentAccount] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Validation schema using yup
    const validationSchema = yup.object({
        name: yup.string().required('Name is required'),
        gender: yup.string().required('Gender is required').notOneOf(['Select gender'], 'Gender is required'),
        age: yup.number().required('Age is required').min(1, 'Age must be greater than zero'),
        phone: yup.string().required('Phone is required').matches(/^\d{10,11}$/, 'Invalid phone number'),
        email: yup.string().email('Invalid email format').required('Email is required'),
    });

    // Function to load receptionists from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await loadReceptionists((data) => {
                    setAccounts(Array.isArray(data) ? data : []);
                    setLoading(false);
                }, setError);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Function to handle form submission
    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
            setSubmitting(true); // Start submitting
            setDialogOpen(false); // Close dialog after successful submission
    
            // Gọi hàm addReceptionist từ service
            const newReceptionist = await addReceptionist(values);
    
            await loadReceptionists(setAccounts, setLoading, setError); // Reload receptionist data
        } catch (error) {
            console.error('Error submitting form:', error);
            setError(error.message);
        } finally {
            setSubmitting(false); // Stop submitting
        }
    };

    // Function to handle search input change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Function to handle opening the dialog
    const handleDialogOpen = (account) => {
        setCurrentAccount(account);
        setDialogOpen(true);
    };

    // Function to handle bulk deletion
    const handleBulkDelete = async () => {
        try {
            setConfirmOpen(false); // Close confirmation dialog
            await deleteMultipleReceptionists(selected);
            setSelected([]);
            await loadReceptionists(setAccounts, setLoading, setError); // Reload receptionist data
        } catch (error) {
            setError(error.message);
        }
    };

    // Function to handle selecting all checkboxes
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = accounts.map((n) => n.phone);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    // Function to handle selecting individual checkboxes
    const handleSelectClick = (event, phone) => {
        const selectedIndex = selected.indexOf(phone);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, phone);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleDelete2 = async (account) => {
        try {
            setSelected2(account); // Store current receptionist in state for confirmation
            console.log(account);
            setConfirmOpen2(true); // Open confirmation dialog
            
        } catch (error) {
            setError(error.message);
        }
    };
    const handleConfirmDelete2 = async () => {
        try {
            console.log(selected2.phone);
            await deleteReceptionist(selected2.phone); // Delete receptionist using stored phone number
            await loadReceptionists((data) => {
                setAccounts(Array.isArray(data) ? data : []);
                setLoading(false);
            }, setError); // Reload receptionist data
            setConfirmOpen2(false); // Close confirmation dialog
           setSelected2(null);
        } catch (error) {
            setError(error.message);
        }
    };
    // Function to handle closing the dialog
    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    // Function to handle closing the confirmation dialog
    const handleConfirmClose = () => {
        setConfirmOpen(false);
    };

    // Function to handle confirming deletion after dialog
    const handleConfirmDelete = async () => {
        try {
            if (!selected || selected.length === 0) {
                throw new Error("No receptionists selected for deletion.");
            }
            
            if(selected.length>=2){
                console.log('Delete more than 1');
            await deleteMultipleReceptionists(selected); // Assuming deleteMultipleReceptionists handles an array of IDs or objects correctly
            }else if(selected.length===1){
                await deleteReceptionist(selected);
            }
            setSelected([]);
            setConfirmOpen(false); // Close confirmation dialog
            
            await loadReceptionists(setAccounts, setLoading, setError); // Reload receptionist data
        } catch (error) {
            console.error("Error deleting receptionist(s):", error);
            setError(error.message); // Set error state to display to the user
        }
    };
    
    const handleConfirmDelete22 = async () => {
        try {
            if (!currentAccount || currentAccount.length === 0) {
                throw new Error("No receptionists selected for deletion.");
            }
                await deleteReceptionist(selected);
            setAccounts([]);
            setConfirmOpen(false); // Close confirmation dialog
            
            await loadReceptionists(setAccounts, setLoading, setError); // Reload receptionist data
        } catch (error) {
            console.error("Error deleting receptionist(s):", error);
            setError(error.message); // Set error state to display to the user
        }
    };
    
    


    // Function to handle changing the current page in pagination
    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    // Function to handle changing the rows per page
    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Function to generate color from name for avatar background
    function stringToColor(string) {
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        return color;
    }

    // Function to generate avatar based on name
    function stringAvatar(name) {
        if (!name || typeof name !== 'string') {
            return {
                children: '',
            };
        }
        const splitName = name.split(' ');
        if (splitName.length < 2) {
            return {
                sx: {
                    bgcolor: stringToColor(name),
                },
                children: `${name[0]}${name[1]}`,
            };
        }
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${splitName[0][0]}${splitName[1][0]}`,
        };
    }

    const filteredAccounts = accounts.filter((account) => {
        if (searchType === 'name') {
            return account.name.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchType === 'phone') {
            return account.phone.includes(searchTerm);
        }
        return true;
    });
    return (
        <div className="full-height-container">
            <>
                <Typography variant="h4" style={{ marginBottom: '1rem' }}>Receptionist Manager</Typography>
                <Container style={{ display: 'flex', marginBottom: '1rem' }}>
                    <TextField
                        label={`Searching by ${searchType === 'name' ? 'name' : 'phone number'}`}
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        fullWidth
                        margin="normal"
                    />
                    <Select
                        style={{ width: 200, height: 56, marginTop: 17, marginLeft: '1rem' }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        inputProps={{
                            name: 'searchType',
                            id: 'search-type',
                        }}
                    >
                        <MenuItem value={'name'}>Name</MenuItem>
                        <MenuItem value={'phone'}>Phone Number</MenuItem>
                    </Select>
                </Container>

                <Button variant="contained" color="primary" onClick={() => { setIsEditMode(true); handleDialogOpen({}) }} style={{ marginBottom: '1rem' }}>
                    Add Account
                </Button>
                <Button variant="contained" color="secondary" onClick={()=> {;setConfirmOpen(true)}} disabled={selected.length === 0} style={{ marginBottom: '1rem', marginLeft: '1rem' }}>
                    Delete Selected
                </Button>

                {loading ? (
                    <Typography variant="h6">Loading...</Typography>
                ) : error ? (
                    <Typography variant="h6" color="error">{error}</Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={selected.length > 0 && selected.length < accounts

                                                .length}
                                            checked={accounts.length > 0 && selected.length === accounts.length}
                                            onChange={handleSelectAllClick}
                                        />
                                    </TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Gender</TableCell>
                                    <TableCell>Age</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredAccounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((account) => (
                                    <TableRow key={account.phone} selected={selected.indexOf(account.phone) !== -1}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selected.indexOf(account.phone) !== -1}
                                                onChange={(event) => handleSelectClick(event, account.phone)}
                                            />
                                        </TableCell>
                                        <TableCell><Avatar {...stringAvatar(account.name)} /></TableCell>
                                        <TableCell>{account.name}</TableCell>
                                        <TableCell>{account.gender}</TableCell>
                                        <TableCell>{account.age}</TableCell>
                                        <TableCell>{account.phone}</TableCell>
                                        <TableCell>{account.email}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => { handleDialogOpen(account); setIsEditMode(false); }}>
                                                <Visibility />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete2(account)}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={filteredAccounts.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                        />
                    </TableContainer>
                )}
                   {/* Confirmation Dialog for Delete  button*/}
                   <Dialog
                    open={confirmOpen}
                    onClose={handleConfirmClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this receptionist?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleConfirmClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
                 {/* Confirmation Dialog for Delete icon */}
                 <Dialog
                    open={confirmOpen2}
                    onClose={handleConfirmClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this receptionist?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleConfirmClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmDelete2} color="primary" autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
                                {/* Edit/Add Dialog */}

                <Dialog open={dialogOpen} onClose={handleDialogClose}>
                    <DialogTitle>{!isEditMode ? 'Edit Account' : 'Add Account'}</DialogTitle>
                    <DialogContent>
                        <Formik
                            initialValues={{
                                name: currentAccount ? currentAccount.name : '',
                                gender: currentAccount ? currentAccount.gender : 'Select gender',
                                age: currentAccount ? currentAccount.age : '',
                                phone: currentAccount ? currentAccount.phone : '',
                                email: currentAccount ? currentAccount.email : '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleFormSubmit}
                        >
                            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                                <Form onSubmit={handleSubmit}>
                                    <TextField
                                        name="name"
                                        label="Name"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.name && Boolean(errors.name)}
                                        helperText={touched.name && errors.name}
                                    />
                                    <FormControl
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        error={touched.gender && Boolean(errors.gender)}
                                    >
                                        <InputLabel htmlFor="gender">Gender</InputLabel>
                                        <Select
                                            name="gender"
                                            value={values.gender}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            label="Gender"
                                            inputProps={{
                                                name: 'gender',
                                                id: 'gender',
                                            }}
                                        >
                                            
                                            <MenuItem value="Male">Male</MenuItem>
                                            <MenuItem value="Female">Female</MenuItem>
                                        </Select>
                                        {touched.gender && errors.gender && (
                                            <FormHelperText>{errors.gender}</FormHelperText>
                                        )}
                                    </FormControl>

                                    <TextField
                                        name="age"
                                        label="Age"
                                        variant="outlined"
                                        type="number"
                                        fullWidth
                                        margin="normal"
                                        value={values.age}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.age && Boolean(errors.age)}
                                        helperText={touched.age && errors.age}
                                    />

                                    <TextField
                                        name="phone"
                                        label="Phone"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={values.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.phone && Boolean(errors.phone)}
                                        helperText={touched.phone && errors.phone}
                                    />

                                    <TextField
                                        name="email"
                                        label="Email"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.email && Boolean(errors.email)}
                                        helperText={touched.email && errors.email}
                                    />

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={isSubmitting}
                                        style={{ marginTop: '1rem' }}
                                    >
                                        {!isEditMode ? 'Save Changes' : 'Add Account'}
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </DialogContent>
                </Dialog>
            </>
        </div>
    );
}
export default ReceptionistAccount;
function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name) {
    if (!name || typeof name !== 'string') {
        return {
            children: '',
        };
    }

    const splitName = name.split(' ');

    if (splitName.length < 2) {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name[0]}${name[1]}`, // Handle cases where splitName does not have enough elements
        };
    }

    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${splitName[0][0]}${splitName[1][0]}`, // Using splitName to access first characters
    };
}


