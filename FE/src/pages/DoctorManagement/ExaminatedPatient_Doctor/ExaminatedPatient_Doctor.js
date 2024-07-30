import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import { getPatientsByDoctorId, fetchOrCreateConversation } from '../../../services/doctor_service';
import ChatBoxDialog from '../component/ChatboxDialog';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ExaminatedPatients = () => {
  const [patients, setPatients] = useState([]);
  const [openChat, setOpenChat] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [patientIdSelected, setPatientIdSelected] = useState(null);
  const [notebooks, setNotebooks] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const doctorId = localStorage.getItem('accountId');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsData = await getPatientsByDoctorId(doctorId);
        console.log('Patients Data:', patientsData);
        setPatients(patientsData);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, [doctorId]);

  const handleChatStart = async (patientId) => {
    try {
      const conversation = await fetchOrCreateConversation(doctorId, patientId);
      console.log('Fetched or Created Conversation:', conversation);

      if (conversation.$values && conversation.$values.length > 0) {
        const conversationData = conversation.$values[0];
        if (conversationData.id) {
          setConversationId(conversationData.id);
          setPatientIdSelected(patientId);
          setOpenChat(true);
        } else {
          console.error('No valid conversation id found');
        }
      } else {
        console.error('No valid conversation data received');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const handleFetchNotebooks = async (patientId) => {
    try {
      const response = await fetch(`https://localhost:7240/api/DoctorMedicalNotebook/ViewMedicalNoteBookByPatientId?pid=${patientId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setNotebooks(data.$values || []);
      setExpanded(expanded === patientId ? null : patientId);
    } catch (error) {
      console.error('Error fetching notebooks:', error);
    }
  };

  const handleCloseChat = () => {
    setOpenChat(false);
    setConversationId(null);
  };

  return (
    <Box display="flex" flexDirection="row" p={2} height="100vh">
      <Box flex={1} mr={2} overflow="auto">
        {patients.map((patient) => (
          <Card 
            key={patient.patientId} 
            sx={{ 
              marginBottom: '10px',
              '&:hover': {
                backgroundColor: '#e3f2fd', // Light blue background color
              }
            }}
          >
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="flex-start">
                <Typography
                  variant="h6"
                  sx={{ marginBottom: '10px' }}
                >
                  {patient.name}
                </Typography>
                <Box display="flex" flexDirection="row" gap={2} mb={2}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleFetchNotebooks(patient.patientId)}
                  >
                    Xem hồ sơ bệnh án
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleChatStart(patient.patientId)}
                  >
                    Chat
                  </Button>
                </Box>
              </Box>
              <Typography variant="body2">Gender: {patient.gender}</Typography>
              <Typography variant="body2">Address: {patient.address}</Typography>
              <Typography variant="body2">Date of Birth: {new Date(patient.dob).toLocaleDateString()}</Typography>

              {expanded === patient.patientId && notebooks.length > 0 && (
                <Box mt={2}>
                  {notebooks.map((notebook) => (
                    <Accordion key={notebook.id}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{ bgcolor: 'background.paper' }}
                      >
                        <Typography variant="subtitle1">{notebook.diagnostic}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body2">
                          <strong>Prescription:</strong> {notebook.prescription}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2">
                          <strong>Doctor:</strong> {notebook.doctorName}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Date:</strong> {notebook.dateCreate ? new Date(notebook.dateCreate).toLocaleDateString() : 'Not available'}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
      <ChatBoxDialog
        open={openChat}
        onClose={handleCloseChat}
        conversationId={conversationId}
        patientIdSelected={patientIdSelected}
      />
    </Box>
  );
};

export default ExaminatedPatients;
