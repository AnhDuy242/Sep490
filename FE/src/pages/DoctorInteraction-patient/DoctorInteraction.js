import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Divider,
    List,
    ListItem,
    ListItemText,
    Snackbar,
    Alert,
    Typography,
    Container,
    Grid,
    Paper,
    Button
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Header from '../../layouts/Header';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import ChatBox from './component/ChatboxDialog';

// Styled component for ListItem with border and hover effect
const StyledListItem = styled(ListItem)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
        borderBottom: 'none',
    },
    cursor: 'pointer', // Make the list item look clickable
    '&:hover': {
        backgroundColor: theme.palette.action.hover, // Change background color on hover
    },
}));

// Styled component for ListItemText with hover effect
const StyledListItemText = styled(ListItemText)(({ theme }) => ({
    '& .MuiTypography-root': {
        transition: 'color 0.3s', // Smooth color transition on hover
    },
    '&:hover .MuiTypography-root': {
        color: theme.palette.primary.main, // Change text color on hover
    },
}));

// Flex container for list item content and chat button
const ListItemContent = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
}));

const DoctorAndMedicalNotebooks = () => {
    const [doctors, setDoctors] = useState([]);
    const [medicalNotebooks, setMedicalNotebooks] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [chatBoxOpen, setChatBoxOpen] = useState(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    const patientId = localStorage.getItem('accountId');

    useEffect(() => {
        // Fetch doctors list
        axios.get(`https://localhost:7240/api/DoctorCustomerCare/GetListDoctorByPatientId?pid=${patientId}`)
            .then(response => {
                setDoctors(response.data.$values);
            })
            .catch(error => {
                setSnackbarMessage('Failed to load doctors');
                setSnackbarOpen(true);
            });
    }, [patientId]);

    const handleDoctorClick = (doctorId) => {
        // Fetch medical notebooks for selected doctor
        axios.get(`https://localhost:7240/api/PatientMedicalNoteBook/GetMedicalNotebooksByDoctorAndPatient?doctorId=${doctorId}&patientId=${patientId}`)
            .then(response => {
                setMedicalNotebooks(response.data.$values);
                setSelectedDoctorId(doctorId); // Set selected doctor ID
            })
            .catch(error => {
                setSnackbarMessage('Failed to load medical notebooks');
                setSnackbarOpen(true);
            });
    };

    const handleChatClick = (doctorId, event) => {
        event.stopPropagation(); // Prevent the ListItem click event from firing
        setSelectedDoctorId(doctorId);

        // Fetch conversation ID
        axios.get(`https://localhost:7240/api/Conversations/GetByDoctorIdAndPatientID?doctorId=${doctorId}&patientId=${patientId}`)
            .then(response => {
                const conversation = response.data.$values[0]; // Assuming you need the first conversation
                if (conversation) {
                    setConversationId(conversation.id);
                    setChatBoxOpen(true);
                } else {
                    setSnackbarMessage('No conversation found');
                    setSnackbarOpen(true);
                }
            })
            .catch(error => {
                setSnackbarMessage('Failed to load conversation');
                setSnackbarOpen(true);
            });
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            <Header />
            <Navbar />
            <Container sx={{ marginTop: 5, marginBottom: 5 }}>
                <Grid container spacing={3}>
                    {/* Doctor List Section */}
                    <Grid item xs={12} md={4}>
                        <Card variant="outlined">
                            <CardHeader title="Danh sách bác sĩ đã khám" />
                            <Divider />
                            <CardContent>
                                <List>
                                    {doctors.map(doctor => (
                                        <StyledListItem
                                            key={doctor.docId}
                                            onClick={() => handleDoctorClick(doctor.docId)}
                                        >
                                            <ListItemContent>
                                                <StyledListItemText
                                                    primary={doctor.name}
                                                    secondary={`Tuổi: ${doctor.age}, Giới tính: ${doctor.gender ? 'Nam' : 'Nữ'}`}
                                                    style={{ flex: 1 }}
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<ChatIcon />}
                                                    onClick={(event) => handleChatClick(doctor.docId, event)}
                                                >
                                                    Chat
                                                </Button>
                                            </ListItemContent>
                                        </StyledListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Medical Notebooks Section */}
                    <Grid item xs={12} md={8}>
                        {selectedDoctorId && (
                            <Card variant="outlined">
                                <CardHeader title="Hồ sơ bệnh án" />
                                <Divider />
                                <CardContent>
                                    <Paper elevation={3} style={{ padding: 16 }}>
                                        <List>
                                            {medicalNotebooks.map(notebook => (
                                                <StyledListItem key={notebook.id}>
                                                    <ListItemText
                                                        primary={`Toa thuốc: ${notebook.prescription}`}
                                                        secondary={
                                                            <div>
                                                                <Typography variant="body2">Chẩn đoán: {notebook.diagnostic}</Typography>
                                                                <Typography variant="body2">Bệnh nhân: {notebook.patientName}</Typography>
                                                                <Typography variant="body2">Bác sĩ chỉ định: {notebook.doctorName}</Typography>
                                                                <Typography variant="body2">Ngày tạo: {new Date(notebook.dateCreate).toLocaleDateString()}</Typography>
                                                            </div>
                                                        }
                                                    />
                                                </StyledListItem>
                                            ))}
                                        </List>
                                    </Paper>
                                </CardContent>
                            </Card>
                        )}
                    </Grid>
                </Grid>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert onClose={handleCloseSnackbar} severity="error">
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

                {/* ChatBox Component */}
                <ChatBox
                    open={chatBoxOpen}
                    onClose={() => setChatBoxOpen(false)}
                    conversationId={conversationId}
                    doctorIdSelected={selectedDoctorId} // Pass the selected doctor ID to ChatBox
                />
            </Container>

            <Footer />
        </>
    );
};

export default DoctorAndMedicalNotebooks;
