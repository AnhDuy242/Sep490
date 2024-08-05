import React, { useState, useEffect } from 'react';
import {
    TextField, Typography, Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Select, MenuItem, Button, Modal, Container, Snackbar,
    Alert, Tabs, Tab, Card, CardContent, Grid, Dialog, DialogContent, DialogTitle
} from '@mui/material';
import { fetchPatients, createMedicalNotebook } from '../../../services/patient_service';

const PatientManagement = () => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [filter, setFilter] = useState('All');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [formData, setFormData] = useState({
        prescription: '',
        diagnostic: '',
        doctorId: localStorage.getItem('accountId'),
        patientId: '',  // This will be updated when a patient is selected
        name: ''
    });
    const [errors, setErrors] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // State for medical notebooks and tabs
    const [medicalNotebooks, setMedicalNotebooks] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [openImageDialog, setOpenImageDialog] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchPatients();
            setPatients(data);
            console.log(data);
            setFilteredPatients(data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (filter === 'All') {
            setFilteredPatients(patients);
        } else if(filter ==='1') {
            setFilteredPatients(patients.filter(patient => patient.check === parseInt(filter)));
            console.log(patients);
        } else if(filter ==='2') {
            setFilteredPatients(patients.filter(patient => patient.check === parseInt(filter)));
        }
        else if(filter ==='3') {
            setFilteredPatients(patients.filter(patient => patient.check === parseInt(filter)));

        }
    }, [filter, patients]);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleOpenForm = (patient) => {
        setSelectedPatient(patient);
        setFormData({
            ...formData,
            patientId: patient.patientId,  // Ensure this is the correct ID for the patient
            name: patient.name
        });
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setSelectedPatient(null);
        setErrors({});
    };

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.prescription) newErrors.prescription = 'Toa thuốc không được để trống';
        if (!formData.diagnostic) newErrors.diagnostic = 'Chẩn đoán không được để trống';
        if (!formData.patientId) newErrors.patientId = 'Patient ID không được để trống';
        if (!formData.doctorId) newErrors.doctorId = 'Doctor ID không được để trống';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return; // Stop submission if validation fails

        try {
            const response = await createMedicalNotebook(formData);
            setSnackbarMessage(`Medical notebook created successfully: ${response.message || ''}`);
            setSnackbarSeverity('success');
            handleCloseForm();
        } catch (error) {
            setSnackbarMessage(`Error creating medical notebook: ${error.response?.data?.message || 'Unknown error'}`);
            setSnackbarSeverity('error');
        } finally {
            setOpenSnackbar(true);
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const handleOpenViewDialog = async (patientId) => {
        try {
            // Fetch medical notebooks
            const notebooksResponse = await fetch(`https://localhost:7240/api/DoctorMedicalNotebook/ViewMedicalNoteBookByPatientId?pid=${patientId}`);
            const notebooksData = await notebooksResponse.json();
            setMedicalNotebooks(notebooksData.$values || []);
    
            // Fetch test results to get image URLs
            const imgUrlsResponse = await fetch(`https://localhost:7240/api/PatientMedicalNoteBook/GetTestResult?mid=${patientId}`);
            const imgUrlsData = await imgUrlsResponse.json();
            const imgUrls = imgUrlsData.$values.map(result => result.imgUrl);
            
            // Check if there's no data
            if ((notebooksData.$values.length === 0) && (imgUrls.length === 0)) {
                setSnackbarMessage('Không có hồ sơ hoặc kết quả xét nghiệm cho bệnh nhân này.');
                setSnackbarSeverity('warning');
                setOpenSnackbar(true);
                return; // Stop further execution if no data
            }
    
            // Add image URLs to medical notebooks (if needed)
            setMedicalNotebooks(prevNotebooks => prevNotebooks.map(notebook => ({
                ...notebook,
                imgUrls // Attach imgUrls here if needed
            })));
    
            setOpenViewDialog(true);
        } catch (error) {
            console.error('Failed to fetch medical notebooks or test results:', error);
            setSnackbarMessage('Không có hồ kết quả xét nghiệm cho bệnh nhân này.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };
    
    const handleCloseViewDialog = () => {
        setOpenViewDialog(false);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleOpenImageDialog = (imgUrl) => {
        setSelectedImage(imgUrl);
        setOpenImageDialog(true);
    };

    const handleCloseImageDialog = () => {
        setOpenImageDialog(false);
        setSelectedImage('');
    };

    return (
        <Box>
            <Box mb={2}>
                <Typography variant="h6">Lọc theo trạng thái</Typography>
                <Select value={filter} onChange={handleFilterChange}>
                    <MenuItem value="All">Tất cả</MenuItem>
                    <MenuItem value="1">Hoạt động</MenuItem>
                    <MenuItem value="2">Chưa đánh giá</MenuItem>
                    <MenuItem value="3">Đã đánh giá</MenuItem>

                </Select>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tên bệnh nhân</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>SĐT</TableCell>
                            <TableCell>Địa chỉ</TableCell>
                            <TableCell>Ngày sinh</TableCell>
                            <TableCell>Giới tính</TableCell>
                            <TableCell>Trạng thái </TableCell>
                            <TableCell>Tạo bệnh án</TableCell>
                            <TableCell>Xem hồ sơ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPatients.map((patient) => (
                            <TableRow key={patient.accId}>
                                <TableCell>{patient.name}</TableCell>
                                <TableCell>{patient.email}</TableCell>
                                <TableCell>{patient.phone}</TableCell>
                                <TableCell>{patient.address}</TableCell>
                                <TableCell>{patient.dob.split('T')[0]}</TableCell>
                                <TableCell>{patient.gender}</TableCell>
                                <TableCell>
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            width: 12,
                                            height: 12,
                                            borderRadius: '50%',
                                            backgroundColor: patient.check !== null ? 'green' : 'red'
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOpenForm(patient)}
                                    >
                                       Thêm mới
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleOpenViewDialog(patient.patientId)}
                                    >
                                        Xem 
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal
                open={openForm}
                onClose={handleCloseForm}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Container maxWidth="sm" sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    borderRadius: '8px',
                    boxShadow: 24,
                    p: 4
                }}>
                    <Typography variant="h6" gutterBottom>
                        Tạo mới bệnh án cho bệnh nhân {formData.name}
                    </Typography>
                    <Box component="form" onSubmit={handleFormSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="prescription"
                            label="Toa thuốc"
                            name="prescription"
                            value={formData.prescription}
                            onChange={handleFormChange}
                            error={Boolean(errors.prescription)}
                            helperText={errors.prescription}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="diagnostic"
                            label="Chẩn đoán"
                            name="diagnostic"
                            value={formData.diagnostic}
                            onChange={handleFormChange}
                            error={Boolean(errors.diagnostic)}
                            helperText={errors.diagnostic}
                        />
                        <TextField
                            required
                            fullWidth
                            id="doctorId"
                            label="Doctor ID"
                            name="doctorId"
                            value={formData.doctorId}
                            onChange={handleFormChange}
                            sx={{ display: 'none' }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="patientId"
                            label="Patient ID"
                            name="patientId"
                            value={formData.patientId}
                            sx={{ display: 'none' }}
                            onChange={handleFormChange}
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
            </Modal>

            <Modal
                open={openViewDialog}
                onClose={handleCloseViewDialog}
                aria-labelledby="view-dialog-title"
                aria-describedby="view-dialog-description"
            >
                <Container maxWidth="md" sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    borderRadius: '8px',
                    boxShadow: 24,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                }}>
                    <Typography id="view-dialog-title" variant="h6" sx={{ mb: 2 }}>
                        Hồ sơ bệnh án của bệnh nhân {medicalNotebooks[activeTab]?.patientName}
                    </Typography>

                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        aria-label="medical notebooks tabs"
                        sx={{ mb: 2 }}
                    >
                        {medicalNotebooks.map((notebook) => (
                            <Tab key={notebook.$id} label={`Notebook ${notebook.$id}`} />
                        ))}
                    </Tabs>

                    <Box>
                        {medicalNotebooks.map((notebook, index) => (
                            <TabPanel key={notebook.$id} value={activeTab} index={index}>
                                <Card sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                    Toa thuốc:
                                                </Typography>
                                                <Typography variant="body1">
                                                    {notebook.prescription}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                    Chỉ định:
                                                </Typography>
                                                <Typography variant="body1">
                                                    {notebook.diagnostic}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                    Bác sĩ chỉ định:
                                                </Typography>
                                                <Typography variant="body1">
                                                    {notebook.doctorName}
                                                </Typography>
                                            </Grid>
                                            {/* Add a button to display image */}
                                            {notebook.imgUrls && notebook.imgUrls.length > 0 && (
                                                <Grid item xs={12}>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => handleOpenImageDialog(notebook.imgUrls[0])}
                                                    >
                                                        Xem hình ảnh
                                                    </Button>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </TabPanel>
                        ))}
                    </Box>
                </Container>
            </Modal>

            <Dialog
                open={openImageDialog}
                onClose={handleCloseImageDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Hình ảnh</DialogTitle>
                <DialogContent>
                    {selectedImage && (
                        <img src={selectedImage} alt="Medical notebook" style={{ width: '100%', height: 'auto' }} />
                    )}
                </DialogContent>
            </Dialog>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

// Helper component for tab panel
const TabPanel = ({ value, index, children }) => (
    <div role="tabpanel" hidden={value !== index}>
        {value === index && <Box sx={{}}>{children}</Box>}
    </div>
);

export default PatientManagement;
