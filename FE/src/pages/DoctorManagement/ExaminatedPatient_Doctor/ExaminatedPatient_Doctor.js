import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Box } from '@mui/material';
import { getPatientsByDoctorId, fetchOrCreateConversation } from '../../../services/doctor_service';
import ChatBoxDialog from '../component/ChatboxDialog';

const ExaminatedPatients = () => {
  const [patients, setPatients] = useState([]);
  const [openChat, setOpenChat] = useState(false);
  const [conversationId, setConversationId] = useState(null); // Add state for conversationId
  const doctorId = localStorage.getItem('accountId');
   const [patientIdSelected,setPatientIdSelected]=useState(null); 
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsData = await getPatientsByDoctorId(doctorId);
        console.log('Patients Data:', patientsData); // Debug log
        setPatients(patientsData);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, [doctorId]);

  const handleChatStart = async (patientId) => {
    try {
      // Fetch or create a conversation
      const conversation = await fetchOrCreateConversation(doctorId, patientId);
  
      console.log('Fetched or Created Conversation:', conversation); // Debug log
  
      // Ensure conversation has $values and it's not empty
      if (conversation.$values && conversation.$values.length > 0) {
        // Get the first item from $values
        const conversationData = conversation.$values[0];
  
        // Ensure conversationData has an id
        if (conversationData.id) {
          setConversationId(conversationData.id); // Set conversationId from conversationData
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
  
  const handleCloseChat = () => {
    setOpenChat(false);
    setConversationId(null); // Clear conversationId when closing chat
  };

  return (
    <Box display="flex" flexDirection="row" p={2} height="100vh">
      <Box flex={1} mr={2} overflow="auto">
        {patients.map((patient) => (
          <Card key={patient.patientId} style={{ marginBottom: '10px' }}>
            <CardContent>
              <Typography variant="h6">{patient.name}</Typography>
              <Typography variant="body2">Gender: {patient.gender}</Typography>
              <Typography variant="body2">Address: {patient.address}</Typography>
              <Typography variant="body2">Date of Birth: {new Date(patient.dob).toLocaleDateString()}</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => handleChatStart(patient.patientId)}
                style={{ marginTop: '10px' }}
              >
                Start Chat
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
      <ChatBoxDialog
        open={openChat}
        onClose={handleCloseChat}
        conversationId={conversationId} // Pass conversationId to ChatBoxDialog
        patientIdSelected={patientIdSelected}
      />
    </Box>
  );
};

export default ExaminatedPatients;
