import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { getMedicalNotebooks } from '../../services/receptionist_management';

const ViewAllNoteBooks = () => {
    const [notebooks, setNotebooks] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedNotebook, setSelectedNotebook] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        getMedicalNotebooks()
            .then(data => {
                setNotebooks(data); // Sửa để truy cập đúng dữ liệu
            })
            .catch(error => {
                console.error('Failed to fetch medical notebooks:', error);
            });
    }, []);

    const handleClickOpen = (notebook) => {
        setSelectedNotebook(notebook);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFile(null); // Reset file input when dialog closes
    };

    const handleSave = () => {
        // Hàm xử lý lưu file đã chọn
        console.log('Saving file:', file);
        handleClose();
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Kê đơn</TableCell>
                            <TableCell>Chẩn đoán</TableCell>
                            <TableCell>Kết quả xét nghiệm</TableCell>
                            <TableCell>Tên bệnh nhân</TableCell>
                            <TableCell>Bác sĩ khám</TableCell>
                            <TableCell>Thêm ảnh</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {notebooks.map((notebook) => (
                            <TableRow key={notebook.$id}>
                                <TableCell>{notebook.prescription}</TableCell>
                                <TableCell>{notebook.diagnostic}</TableCell>
                                <TableCell>{notebook.testResult}</TableCell>
                                <TableCell>{notebook.patientName}</TableCell>
                                <TableCell>{notebook.doctorName}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleClickOpen(notebook)}>
                                        <AddIcon />
                                    </IconButton>
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
                        style={{ position: 'absolute', right: 8, top: 8 }}
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
