import React, { useState, useEffect } from 'react';
import {
    Container, Button, Typography, Snackbar, Card, CardContent, Grid, Dialog, DialogTitle, DialogContent, DialogActions,CardActions
} from '@mui/material';
import { Font } from '@react-pdf/renderer';
import ArialUnicodeMS from '../../assets/font/arial-unicode-ms.ttf'; // Điều chỉnh đường dẫn nếu cần thiết
import Header from "../../layouts/Header";
import Navbar from "../../layouts/Navbar";
import { makeStyles } from '@mui/styles';
import { fetchMedicalNotebooksByPatientId } from '../../services/Medicalnotebook';
import Footer from '../../layouts/Footer';
import { Helmet } from 'react-helmet';

// Đăng ký font với @react-pdf/renderer
Font.register({
    family: 'ArialUnicodeMS',
    src: ArialUnicodeMS,
});
const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Chiều cao tối thiểu của toàn bộ trang
    },
    container: {
        flex: 1,
        paddingBottom: '60px', // Để tránh nội dung bị che bởi Footer
    },
    footer: {
        position: 'relative',
        width: '100%',
        backgroundColor: '#f5f5f5',
        textAlign: 'center',
        padding: '10px',
    },
    title: {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 700,
        marginBottom: '20px',
        textAlign: 'center',
        marginTop: '100px',
    },
    card: {
        marginBottom: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Thêm bóng cho card
        borderRadius: '8px', // Bo tròn góc
        overflow: 'hidden', // Để hình ảnh không bị tràn ra ngoài
    },
    button: {
        marginTop: '10px',
    },
    image: {
        width: '1500px', // Kích thước mặc định
        height: '1200px', // Kích thước mặc định
        objectFit: 'cover', // Giữ tỷ lệ hình ảnh
        marginBottom: '20px',
    },
    imagesContainer: {
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    dialogContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0',
        overflowY: 'hidden', // Ẩn overflow-y
    },
    dialogPaper: {
        minWidth: '1500px', // Đảm bảo dialog đủ rộng
        minHeight: '1200px', // Đảm bảo dialog đủ cao
    },
    closeButton: {
        position: 'absolute',
        top: '8px',
        right: '8px',
        color: 'white',
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
            setSnackbarMessage('Lỗi khi tải dữ liệu!');
            setSnackbarOpen(true);
        } finally {
            setLoading(false); // Dừng loading
        }
    };

    const fetchTestResults = async (medicalNotebookId) => {
        try {
            const response = await fetch(`https://localhost:7240/api/PatientMedicalNoteBook/GetTestResult?mid=${medicalNotebookId}`);
            const data = await response.json();
            return data.$values || []; // Trả về dữ liệu từ trường $values
        } catch (error) {
            console.error('Lỗi khi tải kết quả xét nghiệm:', error);
            return [];
        }
    };

    const handleSelectedNotebook = async (notebook) => {
        setSelectedNotebook(notebook);
        console.log('Selected Notebook:', selectedNotebook);
        console.log('Test Results:', selectedNotebook?.testResults);

        // Giả sử `notebook.id` là `mid` mà bạn sử dụng để gọi API lấy kết quả xét nghiệm
        const results = await fetchTestResults(notebook.id);

        setSelectedNotebook((prev) => ({
            ...prev,
            testResults: results, // Cập nhật trường testResults trong notebook
        }));

        setSnackbarMessage('Đã tìm thấy kết quả bệnh án!');
        setSnackbarOpen(true);
    };

    const handleSearch = () => {
        const foundNotebook = notebooks.find(notebook => notebook.$id === searchNotebookId);
        if (foundNotebook) {
            handleSelectedNotebook(foundNotebook);
        } else {
            setSnackbarMessage('Không tìm thấy kết quả bệnh án!');
            setSnackbarOpen(true);
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedNotebook(null);
    };

    const handlePrintImages = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Print Images</title></head><body>');
            selectedNotebook.testResults.forEach(result => {
                printWindow.document.write(`<img src="${result.imgUrl}" style="width: 1500px; height: 1200px; object-fit: cover; margin-bottom: 20px;">`);
            });
            printWindow.document.write('</body></html>');
            printWindow.document.close(); // Necessary for IE >= 10
            printWindow.focus(); // Necessary for IE >= 10
            printWindow.print(); // Trigger the print dialog
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        if (selectedNotebook && snackbarOpen) {
            setDialogOpen(true); // Mở Dialog khi có medical note và snackbar đang mở
        }
    }, [selectedNotebook, snackbarOpen]);

    return (
        <div className={classes.root}>
            <Helmet>
                <title>
                    Tra cứu kết quả bệnh án
                </title>
            </Helmet>
            <Header />
            <Navbar />
            <Container className={classes.container}>
                <Typography variant="h4" className={classes.title}>
                    Tra cứu kết quả bệnh án
                </Typography>

                <Grid container spacing={2}>
                    {loading ? (
                        <Typography variant="body2">Đang tải dữ liệu...</Typography>
                    ) : notebooks.length > 0 ? (
                        notebooks.map((notebook) => (
                            <Grid item xs={12} sm={6} md={4} key={notebook.$id}>
                                <Card className={classes.card}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Tên bệnh nhân: {notebook.patientName}
                                        </Typography>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Bác sĩ chỉ định: {notebook.doctorName}
                                        </Typography>
                                        <Typography variant="body2" gutterBottom>
                                            Chỉ định: {notebook.prescription}
                                        </Typography>
                                        <Typography variant="body2" gutterBottom>
                                            Chẩn đoán: {notebook.diagnostic}
                                        </Typography>
                                        {notebook.testResult && (
                                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                                Kết quả: {notebook.testResult}
                                            </Typography>
                                        )}
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleSelectedNotebook(notebook)}
                                            className={classes.button}
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="body2">Không có dữ liệu bệnh án</Typography>
                    )}
                </Grid>

                {dialogOpen && (
                    <Dialog
                        open={dialogOpen}
                        onClose={handleDialogClose}
                        maxWidth="lg" // Hoặc 'xl', tuỳ theo kích thước mong muốn
                        PaperProps={{ className: classes.dialogPaper }}
                        fullWidth
                    >
                        <DialogTitle>Chi tiết bệnh án</DialogTitle>
                        <DialogContent className={classes.dialogContent}>
                            {selectedNotebook && selectedNotebook.testResults && selectedNotebook.testResults.length > 0 && (
                                <div className={classes.imagesContainer}>
                                    <Typography variant="body1" style={{ marginBottom: '10px' }}>
                                        <strong>Kết quả xét nghiệm:</strong>
                                    </Typography>
                                    {selectedNotebook.testResults.map((result) => (
                                        <img
                                            key={result.imgId} // Hoặc một thuộc tính khác nếu không có imgId
                                            src={result.imgUrl}
                                            alt={`Kết quả xét nghiệm ${result.imgId}`}
                                            className={classes.image}
                                        />
                                    ))}
                                </div>
                            )}
                        </DialogContent>
                        <DialogActions style={{ backgroundColor: '#f5f5f5', padding: '16px' }}>
                            <Button onClick={handlePrintImages} color="primary" style={{ marginRight: '8px' }}>
                                In hình ảnh
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
            <div className={classes.footer}>
                <Footer />
            </div>
        </div>
    );
};

export default MedicalNotebook;
