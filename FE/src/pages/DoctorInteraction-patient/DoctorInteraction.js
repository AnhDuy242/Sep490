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
    Button,
    Breadcrumbs,
    Link
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Header from '../../layouts/Header';
import Navbar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import ChatBox from './component/ChatboxDialog';
import { Helmet } from 'react-helmet';

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

// Flex container for the main content and footer
const MainContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
});

const Content = styled(Container)({
    flex: 1,
});

const DoctorAndMedicalNotebooks = () => {
    const [doctors, setDoctors] = useState([]);
    const [medicalNotebooks, setMedicalNotebooks] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [chatBoxOpen, setChatBoxOpen] = useState(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    const [unreadCounts, setUnreadCounts] = useState({}); // State for unread message counts
    const [totalUnreadCount, setTotalUnreadCount] = useState(0); // State for total unread messages count
    const patientId = localStorage.getItem('accountId');
    const [intervalId, setIntervalId] = useState(null); // State to keep track of the interval
    const [pageTitle, setPageTitle] = useState('');

    useEffect(() => {
        // Fetch doctors list
        axios.get(`https://localhost:7240/api/DoctorCustomerCare/GetListDoctorByPatientId?pid=${patientId}`)
            .then(response => {
                setDoctors(response.data.$values);

                // Fetch unread counts for each doctor
                let totalUnread = 0;
                response.data.$values.forEach(doctor => {
                    axios.get(`https://localhost:7240/api/Messages/GetUnreadCount/GetUnreadCount?senderId=${doctor.docId}&receiverId=${patientId}`)
                        .then(response => {
                            const unreadCount = response.data;
                            setUnreadCounts(prevCounts => ({
                                ...prevCounts,
                                [doctor.docId]: unreadCount // Store unread count for this doctor
                            }));
                            totalUnread += unreadCount;
                            setTotalUnreadCount(totalUnread); // Update total unread count
                        })
                        .catch(error => {
                            setSnackbarMessage('Failed to load unread counts');
                            setSnackbarOpen(true);
                        });
                });
            })
            .catch(error => {
                setSnackbarMessage('Failed to load doctors');
                setSnackbarOpen(true);
            });

        // Cleanup interval on unmount
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [patientId, intervalId]);

    useEffect(() => {
        setPageTitle(document.title);
    }, []);

    useEffect(() => {
        // Set up interval to fetch unread message counts every 4 seconds
        const id = setInterval(() => {
            // Fetch unread counts for each doctor
            doctors.forEach(doctor => {
                axios.get(`https://localhost:7240/api/Messages/GetUnreadCount/GetUnreadCount?senderId=${doctor.docId}&receiverId=${patientId}`)
                    .then(response => {
                        const unreadCount = response.data;
                        setUnreadCounts(prevCounts => ({
                            ...prevCounts,
                            [doctor.docId]: unreadCount // Store unread count for this doctor
                        }));
                        // Calculate total unread messages count
                        const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
                        setTotalUnreadCount(totalUnread);
                    })
                    .catch(error => {
                        setSnackbarMessage('Failed to fetch unread message counts');
                        setSnackbarOpen(true);
                    });
            });
        }, 4000);

        setIntervalId(id);

        // Cleanup interval on unmount
        return () => {
            if (id) {
                clearInterval(id);
            }
        };
    }, [doctors, patientId, unreadCounts]);

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

        // Mark messages as read
        axios.patch(`https://localhost:7240/api/Messages/MarkMessagesAsRead/MarkMessagesAsRead?senderid=${doctorId}&receiverId=${patientId}`)
            .then(() => {
                // Fetch conversation ID after marking messages as read
                axios.get(`https://localhost:7240/api/Conversations/GetByDoctorIdAndPatientID?doctorId=${doctorId}&patientId=${patientId}`)
                    .then(response => {
                        const conversation = response.data.$values[0]; // Assuming you need the first conversation
                        if (conversation) {
                            setConversationId(conversation.id);
                            setChatBoxOpen(true);

                            // Start interval to mark messages as read every 3 seconds
                            const id = setInterval(() => {
                                axios.patch(`https://localhost:7240/api/Messages/MarkMessagesAsRead/MarkMessagesAsRead?senderid=${doctorId}&receiverId=${patientId}`)
                                    .catch(() => {
                                        setSnackbarMessage('Failed to mark messages as read');
                                        setSnackbarOpen(true);
                                    });
                            }, 3000);
                            setIntervalId(id);
                        } else {
                            setSnackbarMessage('No conversation found');
                            setSnackbarOpen(true);
                        }
                    })
                    .catch(error => {
                        setSnackbarMessage('Failed to load conversation');
                        setSnackbarOpen(true);
                    });
            })
            .catch(error => {
                setSnackbarMessage('Failed to mark messages as read');
                setSnackbarOpen(true);
            });
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleCloseChatBox = () => {
        setChatBoxOpen(false);
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    };

    return (
        <MainContainer>
            <Header />
            <Navbar />
            <Content>
                <Helmet>
                    <title>
                        {totalUnreadCount > 0 ? ` ${totalUnreadCount} tin nhắn mới` : pageTitle}
                    </title>
                </Helmet>
                <Breadcrumbs aria-label="breadcrumb" style={{ margin: '20px 0' }}>
                    <Link color="inherit" href="/">
                        Home
                    </Link>
                    <Typography color="textPrimary">Tư vấn online</Typography>
                </Breadcrumbs>

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
                                                {unreadCounts[doctor.docId] > 0 && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: 'white',
                                                            fontWeight: 'bold',
                                                            ml: 1,
                                                            ml: 5,
                                                            width: 25,
                                                            fontSize: 15,
                                                            borderRadius: '50%',
                                                            textAlign: 'center',
                                                            backgroundColor: 'red'
                                                        }}
                                                    >
                                                        {unreadCounts[doctor.docId]}
                                                    </Typography>
                                                )}
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    sx={{ ml: 5 }}
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
                    onClose={handleCloseChatBox}
                    conversationId={conversationId}
                    doctorIdSelected={selectedDoctorId} // Pass the selected doctor ID to ChatBox
                />
            </Content>
            <Footer />
        </MainContainer>
    );
};

export default DoctorAndMedicalNotebooks;
