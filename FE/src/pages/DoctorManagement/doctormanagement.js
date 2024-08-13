import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';

const MedicalNotebookForm = () => {
  const doctorID = localStorage.getItem('accountId');
  const [formData, setFormData] = useState({
    prescription: '',
    diagnostic: '',
    doctorId: doctorID,
    patientId: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:7240/api/DoctorMedicalNotebook/CreateMedicalNoteBook', formData);
      console.log(response.data);
      alert('Tạo mới bệnh án thành công');
    } catch (error) {
      console.error(error);
      alert('Error creating medical notebook.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Tạo bệnh án      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="prescription"
          label="Toa thuốc"
          name="prescription"
          value={formData.prescription}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="diagnostic"
          label="Chỉ định"
          name="diagnostic"
          value={formData.diagnostic}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="doctorId"
          label="Doctor ID"
          name="doctorId"
          value={formData.doctorId}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="patientId"
          label="Patient ID"
          name="patientId"
          value={formData.patientId}
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default MedicalNotebookForm;
