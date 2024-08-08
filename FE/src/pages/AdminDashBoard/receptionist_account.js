import React, { useState,useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    IconButton,
    InputAdornment,
    Typography,
    Container,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    Snackbar,
    SnackbarContent,
    Avatar,
    DialogActions,
    FormHelperText
} from '@mui/material';
import { Visibility, VisibilityOff, Edit, Visibility as ViewIcon } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as yup from 'yup';

import {
    loadReceptionists,
    addReceptionist,
    updateReceptionist,
    updateReceptionistByActive
} from '../../services/receptionist_service'; // Import API functions
import './component/ReceptionistAccount.css'; // Import CSS
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const ReceptionistAccount = () => {
    const [accounts, setAccounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('name');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [viewEditDialogOpen, setViewEditDialogOpen] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState({});

    //hiển thị thông báo bằng snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // or 'error'


    const [currentAccount, setCurrentAccount] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleTogglePasswordVisibility = (accId) => {
        setPasswordVisible((prev) => ({
            ...prev,
            [accId]: !prev[accId],
        }));
    };
    // Validation schema using yup
    const validationSchema = yup.object().shape({
        name: yup.string()
            .required('Tên là bắt buộc')
            .max(50, 'Tên không được quá 50 ký tự'),
        gender: yup.string()
            .required('Giới tính là bắt buộc')
            .oneOf(['Male', 'Female'], 'Giới tính phải là Male hoặc Female'),
        phone: yup.string()
            .required('Số điện thoại là bắt buộc')
            .matches(/^\d{10,11}$/, 'Số điện thoại không hợp lệ'),
        dob: yup.date()
            .required('Ngày sinh là bắt buộc')
            .nullable(),
        email: yup.string()
            .email('Định dạng email không hợp lệ')
            .required('Email là bắt buộc'),
        // Password: yup.string().required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    });
    const validationSchemaforEdit = yup.object().shape({
        name: yup.string()
            .required('Tên là bắt buộc')
            .max(50, 'Tên không được quá 50 ký tự'),
        gender: yup.string()
            .required('Giới tính là bắt buộc')
            .oneOf(['Male', 'Female'], 'Giới tính phải là Male hoặc Female'),
        phone: yup.string()
            .required('Số điện thoại là bắt buộc')
            .matches(/^\d{10,11}$/, 'Số điện thoại không hợp lệ'),
        dob: yup.date()
            .required('Ngày sinh là bắt buộc')
            .nullable(),
        email: yup.string()
            .email('Định dạng email không hợp lệ')
            .required('Email là bắt buộc'),
        // Password: yup.string().required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    });

    // Function to load receptionists from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await loadReceptionists((data) => {
                    console.log('Fetched data:', data); // Debugging statement
                    setAccounts(Array.isArray(data) ? data : []);
                }, setError);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle opening and closing of snackbar
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Function to handle opening snackbar with message and severity
    const handleOpenSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };
    // Function to handle form submission
    const handleEditFormSubmit = async (values, { setSubmitting }) => {
        try {
            setSubmitting(true); // Start submitting
            // Update receptionist if in edit mode
            const updatedReceptionist = await updateReceptionist(currentAccount.accId, values);

            if (updatedReceptionist) {
                // Handle the case where the response includes data
                console.log('Updated receptionist data:', updatedReceptionist);
            } else {
                // Handle the case where no content was returned
                console.log('Receptionist updated successfully with no content returned');
            }

            handleOpenSnackbar(`Account ${currentAccount ? 'updated' : 'added'} successfully!`, 'success');
            closeDialogs(); // Close dialog after successful submission

            // Load receptionists and ensure setAccounts is called with an array
            await loadReceptionists((receptionists) => {
                console.log('Loaded receptionists:', receptionists); // Debugging statement
                setAccounts(Array.isArray(receptionists) ? receptionists : []);
            }, setLoading, setError); // Reload receptionist data

        } catch (error) {
            console.error('Error submitting form:', error);
            // setError(error.message);
        } finally {
            setSubmitting(false); // Stop submitting
        }
    };



    const handleAddFormSubmit = async (values, { setSubmitting }) => {
        try {
            setSubmitting(true); // Start submitting

            // Call API to add receptionist
            await addReceptionist(values);
            handleOpenSnackbar('Account added successfully!', 'success');

            closeDialogs(); // Close dialog after successful submission
            await loadReceptionists(setAccounts, setLoading, setError); // Reload receptionist data
        } catch (error) {
            console.error('Error submitting form:', error);
            if (error.response && error.response.data && error.response.data.message) {
                handleOpenSnackbar(error.response.data.message, 'error');
            } else {
                handleOpenSnackbar(`Error: ${error.message}`, 'error');
            }
        } finally {
            setSubmitting(false); // Stop submitting
        }
    };

    // Function to handle search input change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Function to handle opening the dialog for add account
    const handleAddDialogOpen = () => {
        setAddDialogOpen(true);
    };

    // Function to handle opening the dialog for view/edit account
    const handleViewEditDialogOpen = (account, editMode) => {
        setCurrentAccount(account);
        setIsEditMode(editMode);
        setViewEditDialogOpen(true);
    };

    // Function to close both dialogs
    const closeDialogs = () => {
        setAddDialogOpen(false);
        setViewEditDialogOpen(false);
        setCurrentAccount(null);
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

    // Function to format date to dd/mm/yyyy
    function formatDate(date) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(date).toLocaleDateString('en-GB', options);
    }

    // Function to handle toggle active/inactive
    const handleToggleChange = (account, newIsActive) => {
        try {
            // Update local state first
            const updatedAccounts = accounts.map((acc) =>
                acc.accId === account.accId ? { ...acc, isActive: newIsActive } : acc
            );
            setAccounts(updatedAccounts);

            // Update on the server
            updateReceptionistByActive(account.accId, { ...account, isActive: newIsActive });
            handleOpenSnackbar(`Account status updated successfully!`, 'success');

        } catch (error) {
            console.error('Error updating active status:', error);
            setError(error.message);
        }
    };

    // Function to handle adding a new account
    const handleAddAccount = () => {
        handleAddDialogOpen();
    };

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

                <Button variant="contained" color="primary" onClick={handleAddAccount} style={{ marginBottom: '1rem' }}>
                    Add Account
                </Button>

                {loading ? (
                    <Typography variant="body1">Loading...</Typography>
                ) : error ? (
                    <Typography variant="body1" color="error">{`Error: ${error}`}</Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Avatar</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Gender</TableCell>
                                    <TableCell>DOB</TableCell>
                                    <TableCell>Password</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredAccounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((account) => (
                                    <TableRow
                                        key={account.accId}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {account.accId}
                                        </TableCell>
                                        <TableCell><Avatar {...stringAvatar(account.name)} /></TableCell>
                                        <TableCell>{account.name}</TableCell>
                                        <TableCell>{account.gender}</TableCell>
                                        <TableCell>{formatDate(account.dob)}</TableCell>
                                        <TableCell>
                                            <TextField type={passwordVisible[account.accId] ? "text" : "password"} value={account.password} InputProps={{
                                                readOnly: true, endAdornment:
                                                    (<InputAdornment position="end">
                                                        <IconButton aria-label="toggle password visibility" onClick={() => handleTogglePasswordVisibility(account.accId)} > {passwordVisible[account.accId] ? <Visibility /> : <VisibilityOff />} </IconButton>
                                                    </InputAdornment>),
                                            }} />
                                        </TableCell>

                                        <TableCell>{account.phone}</TableCell>
                                        <TableCell>{account.email}</TableCell>
                                        <TableCell>
                                            <ToggleButtonGroup
                                                value={account.isActive}
                                                exclusive
                                                onChange={(event, newStatus) => handleToggleChange(account, newStatus)}
                                            >
                                                <ToggleButton value={true} disabled={account.isActive}>Active</ToggleButton>
                                                <ToggleButton value={false} disabled={!account.isActive}>Inactive</ToggleButton>
                                            </ToggleButtonGroup>
                                        </TableCell>

                                        <TableCell>
                                            <IconButton onClick={() => handleViewEditDialogOpen(account, false)}>
                                                <Visibility />
                                            </IconButton>
                                            <IconButton onClick={() => handleViewEditDialogOpen(account, true)}>
                                                <Edit />
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
                {/*hiển thị thông báo bằng snackbar */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={2000} // Duration to show the snackbar (in ms)
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                    <SnackbarContent
                        sx={{ backgroundColor: snackbarSeverity === 'error' ? '#d32f2f' : '#43a047' }} // Custom styles based on severity
                        message={snackbarMessage}
                    />
                </Snackbar>
                {/* Dialog for adding a new account */}
                <Dialog open={addDialogOpen} onClose={closeDialogs}>
                    <DialogTitle>Add Account</DialogTitle>
                    <DialogContent>
                        <Formik
                            initialValues={{
                                name: '',
                                gender: '',
                                age: '',
                                phone: '',
                                dob: '',
                                email: '',
                                Password: '',
                                role: 'Receptionist'
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleAddFormSubmit}
                        >
                            {({
                                setFieldValue,
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                            }) => (
                                <Form onSubmit={handleSubmit}>

                                    <TextField
                                        label="Name"
                                        name="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.name && !!errors.name}
                                        helperText={touched.name && errors.name}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <FormControl
                                        fullWidth
                                        margin="normal"
                                        error={touched.gender && !!errors.gender}
                                    >
                                        <InputLabel>Gender</InputLabel>
                                        <Select
                                            name="gender"
                                            value={values.gender}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        >
                                            <MenuItem value="">
                                                <em>Select gender</em>
                                            </MenuItem>
                                            <MenuItem value="Male">Male</MenuItem>
                                            <MenuItem value="Female">Female</MenuItem>
                                        </Select>
                                        {touched.gender && errors.gender && (
                                            <FormHelperText>{errors.gender}</FormHelperText>
                                        )}
                                    </FormControl>
                                    {/* <TextField
                                        label="Age"
                                        name="age"
                                        type="number"
                                        value={values.age}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.age && !!errors.age}
                                        helperText={touched.age && errors.age}
                                        fullWidth
                                        margin="normal"
                                    /> */}
                                    <TextField
                                        label="Phone"
                                        name="phone"
                                        value={values.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.phone && !!errors.phone}
                                        helperText={touched.phone && errors.phone}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Date of Birth"
                                        name="dob"
                                        type="date"
                                        value={values.dob}
                                        onChange={(e) => {
                                            handleChange(e);
                                            const age = getAge(e.target.value);
                                            setFieldValue('age', age);
                                        }}
                                        onBlur={handleBlur}
                                        error={touched.dob && !!errors.dob}
                                        helperText={touched.dob && errors.dob}
                                        fullWidth
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            inputProps: {
                                                max: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
                                            },
                                        }}
                                    />
                                    <TextField
                                        label="Email"
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.email && !!errors.email}
                                        helperText={touched.email && errors.email}
                                        fullWidth
                                        margin="normal"
                                    />
                                    {/* <TextField
                                        label="Password"
                                        name="Password"
                                        type="password"
                                        value={values.Password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.Password && !!errors.Password}
                                        helperText={touched.Password && errors.Password}
                                        fullWidth
                                        margin="normal"
                                    /> */}

                                    <DialogActions>
                                        <Button onClick={closeDialogs} color="primary">
                                            Cancel
                                        </Button>
                                        <Button type="submit" color="primary" disabled={isSubmitting}>
                                            Save
                                        </Button>
                                    </DialogActions>
                                </Form>
                            )}
                        </Formik>
                    </DialogContent>
                </Dialog>

                <Dialog open={viewEditDialogOpen} onClose={closeDialogs}>
                    <DialogTitle>{isEditMode ? 'Edit Account' : 'View Account'}</DialogTitle>
                    <DialogContent>
                        <Formik
                            initialValues={{
                                accId: currentAccount?.accId || '',
                                name: currentAccount?.name || '',
                                gender: currentAccount?.gender || '',
                                phone: currentAccount?.phone || '',
                                dob: currentAccount?.dob ? new Date(currentAccount.dob).toISOString().split('T')[0] : '',
                                email: currentAccount?.email || '',
                                Password: ''
                            }}
                            validationSchema={validationSchemaforEdit}
                            onSubmit={(values, actions) => {
                                console.log("Edit Formik onSubmit called with values:", values);
                                handleEditFormSubmit(values, actions);
                            }}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                            }) => (
                                <Form onSubmit={handleSubmit}>
                                    <TextField
                                        label="ID"
                                        name="ID"
                                        value={values.accId}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.name && !!errors.name}
                                        helperText={touched.name && errors.name}
                                        fullWidth
                                        margin="normal"
                                        sx={{ display: "none" }}
                                    />
                                    <TextField
                                        label="Name"
                                        name="name"
                                        disabled={!isEditMode}
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.name && !!errors.name}
                                        helperText={touched.name && errors.name}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <FormControl
                                        disabled={!isEditMode}
                                        fullWidth
                                        margin="normal"
                                        error={touched.gender && !!errors.gender}
                                    >
                                        <InputLabel>Gender</InputLabel>
                                        <Select
                                            name="gender"
                                            value={values.gender}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            disabled={!isEditMode}
                                        >
                                            <MenuItem value="">
                                                <em>Select gender</em>
                                            </MenuItem>
                                            <MenuItem value="Male">Male</MenuItem>
                                            <MenuItem value="Female">Female</MenuItem>
                                        </Select>
                                        {touched.gender && errors.gender && (
                                            <FormHelperText>{errors.gender}</FormHelperText>
                                        )}
                                    </FormControl>
                                    <TextField
                                        label="Phone"
                                        name="phone"
                                        value={values.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.phone && !!errors.phone}
                                        helperText={touched.phone && errors.phone}
                                        fullWidth
                                        margin="normal"
                                        disabled={!isEditMode}
                                    />
                                    <TextField
                                        label="Date of Birth"
                                        name="dob"
                                        type="date"
                                        value={values.dob}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.dob && !!errors.dob}
                                        helperText={touched.dob && errors.dob}
                                        fullWidth
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            inputProps: {
                                                max: new Date().toISOString().split('T')[0], // Max date is today
                                            },
                                        }}
                                        disabled={!isEditMode}
                                    />
                                    <TextField
                                        label="Email"
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.email && !!errors.email}
                                        helperText={touched.email && errors.email}
                                        fullWidth
                                        margin="normal"
                                        disabled={!isEditMode}
                                    />
                                    <DialogActions>
                                        <Button onClick={closeDialogs} color="primary">
                                            Close
                                        </Button>
                                        {isEditMode && (
                                            <Button type="submit" color="primary" disabled={isSubmitting}>
                                                Save
                                            </Button>
                                        )}
                                    </DialogActions>
                                </Form>
                            )}
                        </Formik>
                    </DialogContent>
                </Dialog>


            </>
        </div>
    );
};

export default ReceptionistAccount;
