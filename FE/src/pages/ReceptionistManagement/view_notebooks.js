import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Snackbar, Alert, TablePagination, TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import { getMedicalNotebooks, setOfflinePatientByMid } from '../../services/receptionist_management';

const ViewAllNoteBooks = () => {
    const [notebooks, setNotebooks] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedNotebook, setSelectedNotebook] = useState(null);
    const [file, setFile] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [currentImages, setCurrentImages] = useState([]);


    // Pagination and search state for both tables
    const [page1, setPage1] = useState(0);
    const [rowsPerPage1, setRowsPerPage1] = useState(5);
    const [searchQuery1, setSearchQuery1] = useState('');
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

    const [page2, setPage2] = useState(0);
    const [rowsPerPage2, setRowsPerPage2] = useState(5);
    const [searchQuery2, setSearchQuery2] = useState('');

    const handleOpenSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    useEffect(() => {
        getMedicalNotebooks()
            .then(data => {
                console.log('Dữ liệu đã lấy:', data);
                setNotebooks(data);
            })
            .catch(error => {
                console.error('Lỗi khi lấy dữ liệu sổ tay y tế:', error);
            });
    }, []);

    const handleClose = () => {
        setOpen(false);
        setFile(null);
    };
    const handleClickOpen = async (notebook) => {
        setSelectedNotebook(notebook);
        setOpen(true);
        // Fetch images for the selected notebook

    };
    const handleOpenImageDialog = async (notebook) => {
        setSelectedNotebook(notebook);
        setImageDialogOpen(true);
        try {
            const response = await fetch(`https://localhost:7240/api/PatientMedicalNoteBook/GetTestResult?mid=${notebook.id}`);
            const data = await response.json();
            setCurrentImages(data.$values);
        } catch (error) {
            console.error('Error fetching images:', error);
            handleOpenSnackbar('Error fetching images', 'error');
        }
    };

    const handleCloseImageDialog = () => {
        setImageDialogOpen(false);
    };
    const handleSave = async () => {
        if (file && selectedNotebook) {
            // Check if the file is an image
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validImageTypes.includes(file.type)) {
                handleOpenSnackbar('Chỉ cho phép tải lên hình ảnh', 'error');
                return;
            }

            try {
                const fileName = file.name;
                await uploadFile(selectedNotebook.id, file);
                handleOpenSnackbar('Tải lên hình ảnh thành công', 'success');

                // Update the notebook state to show the file title instead of the icon
                setNotebooks(prevNotebooks =>
                    prevNotebooks.map(nb =>
                        nb.id === selectedNotebook.id ? { ...nb, fileTitle: fileName } : nb
                    )
                );
            } catch (error) {
                console.error('Lỗi khi tải lên file:', error);
                handleOpenSnackbar('Lỗi khi tải lên file', 'error');
            }
        }
        handleClose();
    };
    const markAppointmentAsCompleted = async (patientId, doctorId, date) => {
        try {
            // Chuyển đổi ngày giờ thành định dạng yyyy-MM-dd
            const localDate = new Date(date);
            const year = localDate.getFullYear();
            const month = String(localDate.getMonth() + 1).padStart(2, '0');
            const day = String(localDate.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;

            // Kiểm tra kết quả của ngày giờ trước khi gửi API
            console.log(`Sending date: ${formattedDate}`);

            const response = await fetch(`https://localhost:7240/api/ReceptionistMedicalNotebook/MarkAppointmentAsCompleted?patientId=${patientId}&doctorId=${doctorId}&date=${encodeURIComponent(formattedDate)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                handleOpenSnackbar('Appointment has been marked as completed', 'success');
            } else {
                handleOpenSnackbar('Failed to update appointment status', 'error');
            }
        } catch (error) {
            console.error('Error updating appointment status:', error);
            handleOpenSnackbar('Error updating appointment status', 'error');
        }
    };



    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const uploadFile = async (mid, file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const url = `https://localhost:7240/api/ReceptionistMedicalNotebook/CreateMedicalNoteBook?mid=${mid}`;
            console.log('Gửi yêu cầu đến URL:', url);

            const response = await fetch(url, {
                method: 'PUT',
                body: formData,
                // Không thêm header Content-Type, vì fetch sẽ tự động xử lý với FormData
            });

            console.log('Mã trạng thái phản hồi:', response.status);

            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                const result = await response.json();
                console.log('Tải lên file thành công:', result);
            } else {
                const text = await response.text();
                console.log('Phản hồi không phải JSON:', text);
            }

            if (!response.ok) {
                throw new Error(`Lỗi khi tải lên file: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Lỗi khi tải lên file:', error);
            throw error;
        }
    };

    const handleSaveBut = async (patientId, doctorId) => {
        try {
            // Assuming `getMedicalNotebooks` returns the data structure you provided
            const notebooks = await getMedicalNotebooks();

            // Find the relevant dateCreate based on patientId and doctorId
            const notebook = notebooks.find(
                (item) => item.patientId === patientId && item.doctorId === doctorId
            );

            if (!notebook) {
                throw new Error('Không tìm thấy hồ sơ y tế phù hợp');
            }

            const appointmentDate = notebook.dateCreate;

            console.log('Calling setOfflinePatientByMid with:', patientId);
            await setOfflinePatientByMid(patientId);

            console.log('Calling markAppointmentAsCompleted with:', patientId, doctorId, appointmentDate);
            await markAppointmentAsCompleted(patientId, doctorId, appointmentDate);

            handleOpenSnackbar('Cập nhật trạng thái bệnh nhân thành công', 'success');

            // Refresh notebooks data
            const data = await getMedicalNotebooks();
            setNotebooks(data);
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái bệnh nhân:', error);
            handleOpenSnackbar('Lỗi khi cập nhật trạng thái bệnh nhân', 'error');
        }
    };



    // Separate notebooks based on check value
    const check1Notebooks = notebooks.filter(nb => nb.check === 1 && nb.diagnostic.toLowerCase().includes(searchQuery1.toLowerCase()));
    const check2And3Notebooks = notebooks.filter(nb => (nb.check === 2 || nb.check === 3) && nb.diagnostic.toLowerCase().includes(searchQuery2.toLowerCase()));

    return (
        <>
            <h1>Danh sách sổ tay y tế</h1>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <h2>Sổ tay y tế cần xử lý</h2>
                    <TextField
                        label="Tìm kiếm theo chẩn đoán"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => setSearchQuery1(e.target.value)}
                        sx={{ marginBottom: '20px' }}
                    />
                    <TableContainer component={Paper} sx={{ border: '1px solid #ddd', marginBottom: '20px' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Kê đơn</TableCell>
                                    <TableCell>Chẩn đoán</TableCell>
                                    <TableCell>Tên bệnh nhân</TableCell>
                                    <TableCell>Bác sĩ khám</TableCell>
                                    <TableCell>Thêm ảnh</TableCell>
                                    <TableCell>Lưu</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {check1Notebooks.slice(page1 * rowsPerPage1, page1 * rowsPerPage1 + rowsPerPage1).map((notebook) => (
                                    <TableRow key={notebook.id}>
                                        <TableCell>{notebook.prescription}</TableCell>
                                        <TableCell>{notebook.diagnostic}</TableCell>
                                        <TableCell>{notebook.patientName}</TableCell>
                                        <TableCell>{notebook.doctorName}</TableCell>
                                        <TableCell>
                                            {/* {notebook.fileTitle ? (
                                                <span title={notebook.fileTitle}>{notebook.fileTitle}</span>
                                            ) : ( */}

                                            <IconButton onClick={() => handleClickOpen(notebook)} title="Thêm ảnh">
                                                <AddIcon />
                                            </IconButton>
                                            <Button onClick={() => handleOpenImageDialog(notebook)} color="primary">
                                                Xem ảnh hiện có
                                            </Button>
                                            {/* )} */}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleSaveBut(notebook.patientId, notebook.doctorId, notebook.appointmentDate)}
                                            >
                                                Lưu
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={check1Notebooks.length}
                            rowsPerPage={rowsPerPage1}
                            page={page1}
                            onPageChange={(event, newPage) => setPage1(newPage)}
                            onRowsPerPageChange={(event) => {
                                setRowsPerPage1(parseInt(event.target.value, 10));
                                setPage1(0);
                            }}
                        />
                    </TableContainer>
                </div>

                <div style={{ flex: 1 }}>
                    <h2>Sổ tay y tế đã xử lý</h2>
                    <TextField
                        label="Tìm kiếm theo chẩn đoán"
                        variant="outlined"
                        fullWidth
                        onChange={(e) => setSearchQuery2(e.target.value)}
                        sx={{ marginBottom: '20px' }}
                    />
                    <TableContainer component={Paper} sx={{ border: '1px solid #ddd' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Kê đơn</TableCell>
                                    <TableCell>Chẩn đoán</TableCell>
                                    <TableCell>Tên bệnh nhân</TableCell>
                                    <TableCell>Bác sĩ khám</TableCell>
                                    <TableCell>Thêm ảnh</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {check2And3Notebooks.slice(page2 * rowsPerPage2, page2 * rowsPerPage2 + rowsPerPage2).map((notebook) => (
                                    <TableRow key={notebook.id}>
                                        <TableCell>{notebook.prescription}</TableCell>
                                        <TableCell>{notebook.diagnostic}</TableCell>
                                        <TableCell>{notebook.patientName}</TableCell>
                                        <TableCell>{notebook.doctorName}</TableCell>
                                        <TableCell>
                                            {/* {notebook.fileTitle ? (
                                                <span title={notebook.fileTitle}>{notebook.fileTitle}</span>
                                            ) : ( */}
                                            <IconButton onClick={() => handleClickOpen(notebook)} title="Thêm ảnh">
                                                <AddIcon />
                                            </IconButton>
                                            <Button onClick={() => handleOpenImageDialog(notebook)} color="primary">
                                                Xem ảnh hiện có
                                            </Button>
                                            {/* )} */}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={check2And3Notebooks.length}
                            rowsPerPage={rowsPerPage2}
                            page={page2}
                            onPageChange={(event, newPage) => setPage2(newPage)}
                            onRowsPerPageChange={(event) => {
                                setRowsPerPage2(parseInt(event.target.value, 10));
                                setPage2(0);
                            }}
                        />
                    </TableContainer>
                </div>
            </div>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Thêm ảnh vào sổ tay y tế</DialogTitle>
                <DialogContent>
                    <input type="file" onChange={handleFileChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        <CloseIcon /> Đóng
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        <AddIcon /> Thêm
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={imageDialogOpen} onClose={handleCloseImageDialog} maxWidth="md" fullWidth>
    <DialogTitle>Ảnh hiện có</DialogTitle>
    <DialogContent>
        {currentImages.length === 0 ? (
            <p>Không có ảnh nào hiện tại</p>
        ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {currentImages.map((image) => (
                    <img
                        key={image.imgId}
                        src={image.imgUrl}
                        alt={`Image ${image.imgId}`}
                        style={{ width: '90%', height: '50%', objectFit: 'cover', margin: '10px' }} // Thay đổi kích thước tại đây
                    />
                ))}
            </div>
        )}
    </DialogContent>
    <DialogActions>
        <Button onClick={handleCloseImageDialog} color="primary">
            Đóng
        </Button>
    </DialogActions>
</Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

        </>
    );
};

export default ViewAllNoteBooks;
