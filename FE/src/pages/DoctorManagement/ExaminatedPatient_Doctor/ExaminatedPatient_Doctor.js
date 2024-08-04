import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button, Card, CardContent, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import { getPatientsByDoctorId, fetchOrCreateConversation } from '../../../services/doctor_service';
import ChatBoxDialog from '../component/ChatboxDialog';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Function to mark messages as read
const markMessagesAsRead = async (doctorId, patientId) => {
  try {
    const response = await fetch(`https://localhost:7240/api/Messages/MarkMessagesAsRead/MarkMessagesAsRead?senderid=${patientId}&receiverId=${doctorId}`, {
      method: 'PATCH'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};

const ExaminatedPatients = () => {
  const [patients, setPatients] = useState([]);
  const [openChat, setOpenChat] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [patientIdSelected, setPatientIdSelected] = useState(null);
  const [notebooks, setNotebooks] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [pageTitle, setPageTitle] = useState('');
  const doctorId = localStorage.getItem('accountId');

  // Fetch unread counts
  const fetchUnreadCounts = async (doctorId, patientId) => {
    try {
      const response = await fetch(`https://localhost:7240/api/Messages/GetUnreadCount/GetUnreadCount?receiverId=${doctorId}&senderId=${patientId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const unreadCount = await response.json();
      setUnreadCounts(prevCounts => ({
        ...prevCounts,
        [patientId]: unreadCount
      }));
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsData = await getPatientsByDoctorId(doctorId);
        setPatients(patientsData);
        patientsData.forEach(patient => {
          fetchUnreadCounts(doctorId, patient.patientId);
        });
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, [doctorId]);

  // Update total unread count
  useEffect(() => {
    const total = Object.values(unreadCounts).reduce((acc, count) => acc + count, 0);
    setTotalUnreadCount(total);
  }, [unreadCounts]);

  // Set the initial page title
  useEffect(() => {
    setPageTitle(document.title);
  }, []);

  // Mark messages as read every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      patients.forEach(patient => {
        if (unreadCounts[patient.patientId] > 0) {
          markMessagesAsRead(doctorId, patient.patientId);
        }
      });
    }, 5000); // Adjust the interval as needed (e.g., every 5 seconds)

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [patients, unreadCounts, doctorId]);

  // Fetch unread counts every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      patients.forEach(patient => {
        fetchUnreadCounts(doctorId, patient.patientId);
      });
    }, 3000); // Fetch unread counts every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [patients, doctorId]);

  // Mark messages as read continuously while chat is open
  useEffect(() => {
    let interval;
    if (openChat && conversationId) {
      interval = setInterval(() => {
        if (patientIdSelected) {
          markMessagesAsRead(doctorId, patientIdSelected);
        }
      }, 3000); // Mark as read every 3 seconds
    }

    return () => clearInterval(interval); // Cleanup interval on component unmount or when chat closes
  }, [openChat, conversationId, doctorId, patientIdSelected]);

  const handleChatStart = async (patientId) => {
    try {
      const conversation = await fetchOrCreateConversation(doctorId, patientId);
      if (conversation.$values && conversation.$values.length > 0) {
        const conversationData = conversation.$values[0];
        if (conversationData.id) {
          setConversationId(conversationData.id);
          setPatientIdSelected(patientId);
          setOpenChat(true);
          // Fetch unread count when chat is started
          fetchUnreadCounts(doctorId, patientId);
          // Mark messages as read
          markMessagesAsRead(doctorId, patientId);
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
      <Helmet>
        <title>
          {totalUnreadCount > 0 ? ` ${totalUnreadCount} tin nhắn mới` : pageTitle}
        </title>
      </Helmet>
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
                  {unreadCounts[patient.patientId] > 0 && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'white',
                        fontWeight: 'bold',
                        ml: 1,
                        width: 25,
                        fontSize: 15,
                        borderRadius: '50%',
                        textAlign: 'center',
                        backgroundColor: 'red'
                      }}
                    >
                      {unreadCounts[patient.patientId]}
                    </Typography>
                  )}
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
