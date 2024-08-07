import React, { useState, useEffect,useCallback } from 'react';
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
    const [unreadCounts, setUnreadCounts] = useState({});
    const [totalUnreadCount, setTotalUnreadCount] = useState(0);
    const patientId = localStorage.getItem('accountId');
    const [pageTitle, setPageTitle] = useState('');

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const fetchUnreadCounts = useCallback((doctorList) => {
        const promises = doctorList.map(doctor =>
            axios.get(`https://localhost:7240/api/Messages/GetUnreadCount/GetUnreadCount?senderId=${doctor.docId}&receiverId=${patientId}`)
        );

        Promise.all(promises)
            .then(responses => {
                let newTotalUnread = 0;
                const newCounts = {};
                responses.forEach((response, index) => {
                    const unreadCount = response.data;
                    newCounts[doctorList[index].docId] = unreadCount;
                    newTotalUnread += unreadCount;
                });
                setUnreadCounts(newCounts);
                setTotalUnreadCount(newTotalUnread);
            })
            .catch(() => showSnackbar('Failed to load unread counts'));
    }, [patientId]);

    useEffect(() => {
        setPageTitle(document.title);

        axios.get(`https://localhost:7240/api/DoctorCustomerCare/GetListDoctorByPatientId?pid=${patientId}`)
            .then(response => {
                const doctorList = response.data.$values;
                setDoctors(doctorList);
                fetchUnreadCounts(doctorList);
            })
            .catch(() => showSnackbar('Failed to load doctors'));

        const intervalId = setInterval(() => {
            if (doctors.length > 0) {
                fetchUnreadCounts(doctors);
            }
        }, 8000);

        return () => clearInterval(intervalId);
    }, [patientId, fetchUnreadCounts]);

    const handleDoctorClick = (doctorId) => {
        axios.get(`https://localhost:7240/api/PatientMedicalNoteBook/GetMedicalNotebooksByDoctorAndPatient?doctorId=${doctorId}&patientId=${patientId}`)
            .then(response => {
                setMedicalNotebooks(response.data.$values);
                setSelectedDoctorId(doctorId);
            })
            .catch(() => showSnackbar('Failed to load medical notebooks'));
    };

    const handleChatClick = (doctorId, event) => {
        event.stopPropagation();
        setSelectedDoctorId(doctorId);

        axios.patch(`https://localhost:7240/api/Messages/MarkMessagesAsRead/MarkMessagesAsRead?senderid=${doctorId}&receiverId=${patientId}`)
            .then(() => {
                const conversationData = {
                    doctorId: doctorId,
                    patientId: patientId,
                    createdAt: new Date().toISOString(),
                    conversation_Name: `Cuộc hội thoại của bác sĩ và bệnh nhân`
                };

                axios.post('https://localhost:7240/api/Conversations/CreateIfNotExist', conversationData)
                    .then(response => {
                        setConversationId(response.data.id);
                        setChatBoxOpen(true);
                    })
                    .catch(() => {
                        axios.get(`https://localhost:7240/api/Conversations/GetByDoctorIdAndPatientID?doctorId=${doctorId}&patientId=${patientId}`)
                            .then(response => {
                                const conversation = response.data.$values[0];
                                if (conversation) {
                                    setConversationId(conversation.id);
                                    setChatBoxOpen(true);
                                } else {
                                    showSnackbar('No conversation found and unable to create one');
                                }
                            })
                            .catch(() => showSnackbar('Failed to load or create conversation'));
                    });
            })
            .catch(() => showSnackbar('Failed to mark messages as read'));
    };

    return (
        <MainContainer>
            <Header />
            <Navbar />
            <Content>
                <Helmet>
                    <title>
                        {totalUnreadCount > 0 ? `${totalUnreadCount} tin nhắn mới` : pageTitle}
                    </title>
                </Helmet>
                <Breadcrumbs aria-label="breadcrumb" style={{ margin: '20px 0' }}>
                    <Link color="inherit" href="/">
                        Trang chủ
                    </Link>
                    <Typography color="textPrimary">Dịch vụ hậu mãi</Typography>
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
                    onClose={() => setSnackbarOpen(false)}
                >
                    <Alert onClose={() => setSnackbarOpen(false)} severity="error">
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

                <ChatBox
                    open={chatBoxOpen}
                    onClose={() => setChatBoxOpen(false)}
                    conversationId={conversationId}
                    doctorIdSelected={selectedDoctorId}
                />
            </Content>
            <Footer />
        </MainContainer>
    );
};

export default DoctorAndMedicalNotebooks;