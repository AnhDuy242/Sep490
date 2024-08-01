import React, { useEffect, useState } from 'react';
import Header from '../../layouts/Header';
import NavBar from '../../layouts/Navbar';
import CarouselSlider from '../../layouts/CarouselSlider';
import Footer from '../../layouts/Footer';
import { getPatientQuestions, editPatientQuestion } from '../../services/QuestionService';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const ListPatientQuestion = () => {
    const [questions, setQuestions] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState({});
    const [updatedQuestion, setUpdatedQuestion] = useState('');

    const patientid = localStorage.getItem('accountId');
    
    useEffect(() => {
        window.scrollTo(0, 0); // Cuộn về đầu trang khi component được mount
    }, []);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = await getPatientQuestions(patientid);
                setQuestions(data);
            } catch (error) {
                console.error('Error fetching patient questions:', error);
            }
        };

        fetchQuestions();
    }, [patientid]);

    const handleEditClick = (question) => {
        setCurrentQuestion(question);
        setUpdatedQuestion(question.question1);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        try {
            await editPatientQuestion(currentQuestion.quesId, updatedQuestion);
            // Cập nhật lại danh sách câu hỏi sau khi chỉnh sửa
            const data = await getPatientQuestions(patientid);
            setQuestions(data);
            handleClose();
        } catch (error) {
            console.error('Error editing patient question:', error);
        }
    };

    return (
        <>
            <Header />
            <NavBar />
            <CarouselSlider />
            <div style={{ padding: '20px' }}>
                <h2>Danh sách câu hỏi của bệnh nhân</h2>
                <TableContainer component={Paper} style={{ marginBottom: '2000px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Câu hỏi</TableCell>
                                <TableCell>Ngày hỏi</TableCell>
                                <TableCell>Khoa</TableCell>
                                <TableCell>Tên bác sĩ</TableCell>
                                <TableCell>Ngày trả lời</TableCell>
                                <TableCell>Câu trả lời</TableCell>
                                <TableCell>Chỉnh sửa</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {questions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">Chưa có câu hỏi</TableCell>
                                </TableRow>
                            ) : (
                                questions.map((question) => (
                                    <TableRow key={question.quesId}>
                                        <TableCell>{question.question1}</TableCell>
                                        <TableCell>{new Date(question.quesDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{question.departmentName}</TableCell>
                                        <TableCell>{question.doctorName}</TableCell>
                                        <TableCell>{question.ansDate ? new Date(question.ansDate).toLocaleDateString() : 'Chưa trả lời'}</TableCell>
                                        <TableCell>{question.answer || 'Chưa trả lời'}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleEditClick(question)}>
                                                <EditIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <Footer />

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Chỉnh sửa câu hỏi</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Câu hỏi"
                        type="text"
                        fullWidth
                        value={updatedQuestion}
                        onChange={(e) => setUpdatedQuestion(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Hủy</Button>
                    <Button onClick={handleSave} color="primary">Lưu</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ListPatientQuestion;
