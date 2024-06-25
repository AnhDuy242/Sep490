import React from 'react';
import { TextField, Button, Box } from '@mui/material';

const SearchForm = ({ onSearch }) => {
  const [phone, setPhone] = React.useState('');
  const [name, setName] = React.useState('');

  const handleSearch = () => {
    onSearch({ phone, name });
  };

  return (
    <Box display="flex" alignItems="center" mb={2}>
      <TextField
        label="Số điện thoại"
        variant="outlined"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ marginRight: '1rem' }}
      />
      <TextField
        label="Tên"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginRight: '1rem' }}
      />
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Tìm kiếm
      </Button>
    </Box>
  );
};

export default SearchForm;
