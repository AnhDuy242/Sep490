import React, { useState, useEffect } from 'react';
import {
    Container, Button, Typography, Snackbar, Card, CardContent, Grid, TextField, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { PDFDownloadLink, Font } from '@react-pdf/renderer';
import ArialUnicodeMS from '../../assets/font/arial-unicode-ms.ttf'; // Điều chỉnh đường dẫn nếu cần thiết
import Header from "../../layouts/Header";
import Navbar from "../../layouts/Navbar";
import MyDocument from './ExportPDF'; // Điều chỉnh tên import nếu cần thiết
import { makeStyles } from '@mui/styles';
import { fetchMedicalNotebooksByPatientId } from '../../services/Medicalnotebook';

// Đăng ký font với @react-pdf/renderer
Font.register({
    family: 'ArialUnicodeMS',
    src: ArialUnicodeMS,
});

const useStyles = makeStyles({
    title: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 700,
        marginBottom: '20px',
        textAlign: 'center',
        marginTop: '100px',
    },
    card: {
        marginBottom: '20px',
    },
    button: {
        marginTop: '10px',
    },
    dialogTitle: {
        fontWeight: 700,
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: 'auto',
        maxWidth: '500px',
        maxHeight: '500px',
        marginTop: '10px',
    },
});

const MedicalNotebook = () => {
    const classes = useStyles();
    const [notebooks, setNotebooks] = useState([]);
    const [selectedNotebook, setSelectedNotebook] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchNotebookId, setSearchNotebookId] = useState('');
    const [loading, setLoading] = useState(false); // Trạng thái loading

    useEffect(() => {
        handleGetPatientId();
    }, []);

    const handleGetPatientId = () => {
        const isPatient = localStorage.getItem('role') === 'Patient' ? 'true' : 'false';
        if (isPatient) {
            const getPatientId = localStorage.getItem('accountId');
            fetchData(getPatientId);
        }
    };

    const fetchData = async (patientId) => {
        try {
            setLoading(true); // Bắt đầu loading
            const data = await fetchMedicalNotebooksByPatientId(patientId);
            console.log(data);
            if (data && data.length > 0) {
                setNotebooks(data);
                setSnackbarMessage('Tải dữ liệu thành công!');
                setSnackbarOpen(true);
            } else {
                setNotebooks([]);
                setSnackbarMessage('Không có dữ liệu bệnh án!');
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu: ', error);
            // Xử lý trạng thái lỗi hoặc hiển thị thông báo lỗi
            setSnackbarMessage('Lỗi khi tải dữ liệu!');
            setSnackbarOpen(true);
        } finally {
            setLoading(false); // Dừng loading
        }
    };
    const handleSelectedNotebook = () =>{
        setSelectedNotebook(notebook);
    }
    const handleSearch = () => {
        const foundNotebook = notebooks.find(notebook => notebook.$id === searchNotebookId);
        if (foundNotebook) {
            setSelectedNotebook(foundNotebook);
            setSnackbarMessage('Đã tìm thấy kết quả bệnh án!');
            setSnackbarOpen(true);
        } else {
            setSnackbarMessage('Không tìm thấy kết quả bệnh án!');
            setSnackbarOpen(true);
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedNotebook(null);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleDownloadPDF = () => {
        console.log(selectedNotebook);
    };

    // useEffect để theo dõi sự thay đổi của selectedNotebook và snackbarOpen
    useEffect(() => {
        if (selectedNotebook && snackbarOpen) {
            setDialogOpen(true); // Mở Dialog khi có medical note và snackbar đang mở
        }
    }, [selectedNotebook, snackbarOpen]);

    return (
        <>
            <Header />
            <Navbar />
            <Container>
                <Typography variant="h4" className={classes.title}>
                    Tra cứu kết quả bệnh án
                </Typography>
                <Box my={4}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Tìm kiếm theo mã bệnh án"
                                variant="outlined"
                                value={searchNotebookId}
                                onChange={(e) => setSearchNotebookId(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Button variant="contained" color="primary" fullWidth onClick={handleSearch}>
                                Tìm kiếm
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <Grid container spacing={2}>
                    {loading ? (
                        <Typography variant="body2">Đang tải dữ liệu...</Typography>
                    ) : notebooks.length > 0 ? (
                        notebooks.map((notebook) => (
                            <Grid item xs={12} sm={6} md={4} key={notebook.$id}>
                                <Card className={classes.card}>
                                    <CardContent>
                                        <Typography variant="body" gutterBottom>Tên bệnh nhân: {notebook.patientName}</Typography>
                                        <Typography variant="subtitle1">Bác sĩ chỉ định: {notebook.doctorName}</Typography>
                                        <Typography variant="body2">Chỉ định: {notebook.prescription}</Typography>
                                        <Typography variant="body2">Chẩn đoán: {notebook.diagnostic}</Typography>
                                        {notebook.testResult && <Typography variant="body2">Kết quả: {notebook.testResult}</Typography>}
                                        <Button variant="outlined" color="primary" onClick={handleSelectedNotebook} className={classes.button}>
                                            Xem chi tiết
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="body2">Không tìm thấy kết quả bệnh án.</Typography>
                    )}
                </Grid>
                {selectedNotebook && (
                    <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="md">
                        <DialogTitle className={classes.dialogTitle}>Chi tiết bệnh án</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                    <strong>Tên bệnh nhân:</strong> {selectedNotebook.patientName}
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                    <strong>Tên bác sĩ:</strong> {selectedNotebook.doctorName}
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                    <strong>Chỉ định:</strong> {selectedNotebook.prescription}
                                </Typography>
                                <Typography variant="body1" style={{ marginBottom: '20px' }}>
                                    <strong>Chẩn đoán:</strong> {selectedNotebook.diagnostic}
                                </Typography>
                                {selectedNotebook.testResult && (
                                    <div>
                                        <Typography variant="body1" style={{ marginBottom: '10px' }}>
                                            <strong>Kết quả:</strong>
                                        </Typography>
                                        <img 
                                            src={selectedNotebook.testResult} 
                                            alt="Kết quả xét nghiệm" 
                                            className={classes.image} 
                                        />
                                    </div>
                                )}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions style={{ backgroundColor: '#f5f5f5', padding: '16px' }}>
                            <PDFDownloadLink
                                document={<MyDocument notebook={selectedNotebook} />}
                                fileName="medical_notebook.pdf"
                            >
                                {({ blob, url, loading, error }) => (
                                    <Button onClick={handleDownloadPDF} color="primary" style={{ marginRight: '8px' }}>
                                        {loading ? 'Đang tải tài liệu...' : 'Tải PDF'}
                                    </Button>
                                )}
                            </PDFDownloadLink>
                            <Button onClick={handlePrint} color="primary" style={{ marginRight: '8px' }}>
                                In
                            </Button>
                            <Button onClick={handleDialogClose} color="secondary">
                                Đóng
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    message={snackbarMessage}
                />
            </Container>
        </>
    );
};

export default MedicalNotebook;
