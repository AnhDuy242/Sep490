import React, { useState, useEffect } from 'react';
import {
    Container, TextField, Button, IconButton, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Checkbox, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle, Avatar, Typography, TablePagination
} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Delete, Edit, Visibility } from '@mui/icons-material';

const ReceptionistAccount = () => {
    const [accounts, setAccounts] = useState([]);
    const [selected, setSelected] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentAccount, setCurrentAccount] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [searchType, setSearchType] = useState('name'); // Default value for select
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            // Fetch accounts from API
            const response = await fetch('https://localhost:7240/api/Receptionist');
            const data = await response.json();
            setAccounts(data);
        } catch (error) {
            console.log("Failed fetch");
        }
    };

    const filteredAccounts = accounts.filter(account => {
        if (searchType === 'name') {
            return account.name.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchType === 'phone') {
            return account.phone.includes(searchTerm);
        }
        return true; // Default: show all if searchType is not 'name' or 'phone'
    });

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = accounts.map((account) => account.phone);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleSelectClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
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

    const handleDelete = async (id) => {
        await fetch(`https://localhost:7240/api/Receptionist/${id}`, { method: 'DELETE' });
        fetchAccounts();
    };

    const handleBulkDelete = async () => {
        await Promise.all(selected.map(id => fetch(`https://localhost:7240/api/Receptionist/${id}`, { method: 'DELETE' })));
        setSelected([]);
        fetchAccounts();
    };

    const handleDialogOpen = (account) => {
        setCurrentAccount(account);
        setDialogOpen(true);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0); // Reset to first page on search
    };

    const handleDialogClose = () => {
        setCurrentAccount(null);
        setDialogOpen(false);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const url = isEditMode
            ? `https://localhost:7240/api/Receptionist/${currentAccount.phone}`
            : 'https://localhost:7240/api/Receptionist';
        const method = isEditMode ? 'PUT' : 'POST';
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentAccount)
        });
        if (response.ok) {
            fetchAccounts();
            handleDialogClose();
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCurrentAccount({ ...currentAccount, [name]: value });
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Container
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f0f0f0', // Temporary background color
            }}>
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

            <Button variant="contained" color="primary" onClick={() => { setIsEditMode(false); handleDialogOpen({}) }} style={{ marginBottom: '1rem' }}>
                Add Account
            </Button>
            <Button variant="contained" color="secondary" onClick={handleBulkDelete} disabled={selected.length === 0} style={{ marginBottom: '1rem', marginLeft: '1rem' }}>
                Delete Selected
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selected.length > 0 && selected.length < accounts.length}
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
                            
                                    <IconButton onClick={() => handleDialogOpen(account)}>
                                        <Visibility />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(account.phone)}>
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

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{isEditMode ? 'View Account' : 'Add Account'}</DialogTitle>
                <form onSubmit={handleFormSubmit}>
                    <DialogContent>
                        <DialogContentText>
                            {isEditMode ? 'View the details of the account.' : 'Enter the details of the new account.'}
                        </DialogContentText>
                        <TextField disabled
                            autoFocus
                            margin="dense"
                            name="name"
                            label="Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={currentAccount?.name || ''}
                            onChange={handleInputChange}
                        />
                        <TextField disabled
                            margin="dense"
                            name="gender"
                            label="Gender"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={currentAccount?.gender || ''}
                            onChange={handleInputChange}
                        />
                        <TextField disabled
                            margin="dense"
                            name="age"
                            label="Age"
                            type="number"
                            fullWidth
                            variant="standard"
                            value={currentAccount?.age || ''}
                            onChange={handleInputChange}
                        />
                        <TextField disabled
                            margin="dense"
                            name="phone"
                            label="Phone"
                            type="tel"
                            fullWidth
                            variant="standard"
                            value={currentAccount?.phone || ''}
                            onChange={handleInputChange}
                        />
                        <TextField disabled
                            margin="dense"
                            name="email"
                            label="Email"
                            type="email"
                            fullWidth
                            variant="standard"
                            value={currentAccount?.email || ''}
                            onChange={handleInputChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Cancel</Button>
                        {/* <Button type="submit">{isEditMode ? 'Save' : 'Add'}</Button> */}
                    </DialogActions>
                </form>
            </Dialog>

        </Container>
    );
};

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

export default ReceptionistAccount;
