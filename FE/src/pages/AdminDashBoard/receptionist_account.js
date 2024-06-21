import React, { useState, useEffect } from 'react';
import {
  Container, TextField, Button, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Checkbox, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle,Avatar,
  Typography
} from '@mui/material';
import Stack from '@mui/material/Stack';

import { Delete, Edit, Visibility } from '@mui/icons-material';
import { width } from '@fortawesome/free-solid-svg-icons/fa0';
const ReceptionistAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
    const [searchType,setSearchType]=useState('');
    const handleChange = (event) => {
        setSearchType(event.target.value);
      };
    
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    // Fetch accounts from API
    const response = await fetch('https://localhost:7240/api/Receptionist');
    const data = await response.json();
    setAccounts(data);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAccounts = accounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.phone.includes(searchTerm)
  );

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = accounts.map((account) => account.id);
      setSelectedAccounts(newSelecteds);
      return;
    }
    setSelectedAccounts([]);
  };

  const handleSelectClick = (event, id) => {
    const selectedIndex = selectedAccounts.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedAccounts, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedAccounts.slice(1));
    } else if (selectedIndex === selectedAccounts.length - 1) {
      newSelected = newSelected.concat(selectedAccounts.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedAccounts.slice(0, selectedIndex),
        selectedAccounts.slice(selectedIndex + 1),
      );
    }

    setSelectedAccounts(newSelected);
  };

  const handleDelete = async (id) => {
    await fetch(`https://localhost:7240/api/Receptionist/${id}`, { method: 'DELETE' });
    fetchAccounts();
  };

  const handleBulkDelete = async () => {
    await Promise.all(selectedAccounts.map(id => fetch(`https://localhost:7240/api/Receptionist/${id}`, { method: 'DELETE' })));
    setSelectedAccounts([]);
    fetchAccounts();
  };

  const handleDialogOpen = (account) => {
    setCurrentAccount(account);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setCurrentAccount(null);
    setDialogOpen(false);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const url = isEditMode
      ? `https://localhost:7240/api/Receptionist/${currentAccount.id}`
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
        backgroundColor: '#f0f0f0', // Màu nền tạm thời
      }}>
        <Typography fontSize={50} >Receptionist Manager</Typography>
      <TextField
        label="Search by Name or Phone"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={() => { setIsEditMode(false); handleDialogOpen({}) }} style={{ marginBottom: '1rem' }}>
        Add Account
      </Button>
      <Button variant="contained" color="secondary" onClick={handleBulkDelete} disabled={selectedAccounts.length === 0} style={{ marginBottom: '1rem', marginLeft: '1rem' }}>
        Delete Selected
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedAccounts.length > 0 && selectedAccounts.length < accounts.length}
                  checked={accounts.length > 0 && selectedAccounts.length === accounts.length}
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
            {filteredAccounts.map((account) => (
              <TableRow key={account.id} selected={selectedAccounts.indexOf(account.id) !== -1}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAccounts.indexOf(account.id) !== -1}
                    onChange={(event) => handleSelectClick(event, account.id)}
                  />
                </TableCell>
                <TableCell><Avatar {...stringAvatar(account.name)} /></TableCell>
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.gender}</TableCell>
                <TableCell>{account.age}</TableCell>
                <TableCell>{account.phone}</TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell>
                  <IconButton onClick={() => { setIsEditMode(true); handleDialogOpen(account); }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDialogOpen(account)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(account.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{isEditMode ? 'Edit Account' : 'Add Account'}</DialogTitle>
        <form onSubmit={handleFormSubmit}>
          <DialogContent>
            <DialogContentText>
              {isEditMode ? 'Edit the details of the account.' : 'Enter the details of the new account.'}
            </DialogContentText>
            <TextField
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
            <TextField
              margin="dense"
              name="gender"
              label="Gender"
              type="text"
              fullWidth
              variant="standard"
              value={currentAccount?.gender || ''}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="age"
              label="Age"
              type="number"
              fullWidth
              variant="standard"
              value={currentAccount?.age || ''}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="phone"
              label="Phone"
              type="tel"
              fullWidth
              variant="standard"
              value={currentAccount?.phone || ''}
              onChange={handleInputChange}
            />
            <TextField
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
            <Button type="submit">{isEditMode ? 'Save' : 'Add'}</Button>
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
