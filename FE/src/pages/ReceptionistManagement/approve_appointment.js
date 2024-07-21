// src/components/AppointmentApproval.js

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Select, 
  MenuItem 
} from '@mui/material';
import { fetchAppointments, approveAppointment,getListDoctor } from '../../services/receptionist_management'; // Adjust the import path according to your project structure

const AppointmentApproval = () => {
  const [appointments, setAppointments] = useState([]); // Initialize as an empty array

  useEffect(() => {
    getListDoctor()
            .then(data => {
              setAppointments(data.$values);
            })
            .catch(error => {
                console.error('Failed to fetch appointment:', error);
            });
  }, []);
  // useEffect(() => {
  //   const getAppointments = async () => {
  //     const data = await fetchAppointments();
  //     setAppointments(data.$values);
  //   };
  //   getAppointments();
  // }, []);

  useEffect(() => {
    console.log('Appointments state updated:', appointments); // Log state updates
  }, [appointments]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updatedAppointment = await approveAppointment(id, newStatus);
      const updatedAppointments = appointments.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      );
      setAppointments(updatedAppointments);
      console.log('Appointment status updated successfully:', updatedAppointment);
    } catch (error) {
      console.error('Failed to update appointment status:', error);
    }
  };

  return (
    <Container>
      <h1>Approve Appointments</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Appointment ID</TableCell>
              <TableCell>Patient ID</TableCell>
              <TableCell>Doctor ID</TableCell>
              <TableCell>Slot ID</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.id}</TableCell>
                  <TableCell>{appointment.patientId}</TableCell>
                  <TableCell>{appointment.doctorId}</TableCell>
                  <TableCell>{appointment.slotId}</TableCell>
                  <TableCell>
                    <Select
                      value={appointment.status}
                      onChange={(e) => handleStatusChange(appointment.appId, e.target.value)}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Approve">Approve</MenuItem>
                      <MenuItem value="Cancel">Cancel</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))};
          
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AppointmentApproval;


