import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton
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

    const handleClickOpen = (notebook) => {
        setSelectedNotebook(notebook);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFile(null);
    };

    const handleSave = async () => {
        if (file && selectedNotebook) {
            try {
                await uploadFile(selectedNotebook.$id, file);
                // Lấy lại dữ liệu sổ tay y tế sau khi tải lên
                getMedicalNotebooks()
                    .then(data => {
                        setNotebooks(data);
                    })
                    .catch(error => {
                        console.error('Lỗi khi lấy dữ liệu sổ tay y tế:', error);
                    });
            } catch (error) {
                console.error('Lỗi khi tải lên file:', error);
            }
        }
        handleClose();
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

            // Kiểm tra nếu phản hồi có kiểu là JSON
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                // Xử lý phản hồi JSON nếu có
                const result = await response.json();
                console.log('Tải lên file thành công:', result);
            } else {
                // Nếu phản hồi không phải JSON, đọc dưới dạng văn bản
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

    const handleSaveBut = async (patientId) => {
        try {
            // Cập nhật trạng thái bệnh nhân thành không hoạt động
            await setOfflinePatientByMid(patientId);

            // Lấy lại dữ liệu sổ tay y tế sau khi cập nhật trạng thái
            const data = await getMedicalNotebooks();
            setNotebooks(data);
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái bệnh nhân:', error);
        }
    };


    return (
        <>
            <TableContainer component={Paper}>
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
                        {notebooks.map((notebook, index) => (
                            <TableRow key={index}>
                                <TableCell>{notebook.prescription}</TableCell>
                                <TableCell>{notebook.diagnostic}</TableCell>
                                {/* <TableCell>{notebook.testResult ? <img src={notebook.testResult} alt="Kết quả xét nghiệm" style={{ width: '100px' }} /> : 'Không có kết quả'}</TableCell> */}
                                <TableCell>{notebook.patientName}</TableCell>
                                <TableCell>{notebook.doctorName}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleClickOpen(notebook)} title="Thêm ảnh">
                                        <AddIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleSaveBut(notebook.id)}
                                    >
                                        Save
                                    </Button>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    Thêm ảnh
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                        style={{ position: 'absolute', right: 12, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSave} color="primary">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ViewAllNoteBooks;
