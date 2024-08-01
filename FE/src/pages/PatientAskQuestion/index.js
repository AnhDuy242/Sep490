import React, { useState, useEffect } from 'react';
import Header from '../../layouts/Header';
import NavBar from '../../layouts/Navbar';
import CarouselSlider from '../../layouts/CarouselSlider';
import Footer from '../../layouts/Footer';
import { fetchQuestionsByDepId } from './../../services/QuestionService'; // Cập nhật đường dẫn đúng với vị trí của hàm
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem } from '@mui/material';
import { getListDepartment, createPatientQuestion } from './../../services/QuestionService'; // Thay đổi đường dẫn nếu cần
import { NavLink } from 'react-router-dom';

const PatientViewQuestion = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const [departmentForQuestion, setDepartmentForQuestion] = useState('');

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const data = await getListDepartment();
                setDepartments(data.$values); // Đảm bảo cấu trúc dữ liệu đúng
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        fetchDepartments();
    }, []);

    const handleDepartmentClick = (depId) => {
        setSelectedDepartment(depId);
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            if (selectedDepartment) {
                try {
                    const data = await fetchQuestionsByDepId(selectedDepartment);
                    setQuestions(data.$values); // Đảm bảo cấu trúc dữ liệu đúng
                } catch (error) {
                    console.error('Error fetching questions:', error);
                }
            }
        };

        fetchQuestions();
    }, [selectedDepartment]);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleSubmitQuestion = async () => {
        const patientId = localStorage.getItem('accountId');
        if (!patientId || !newQuestion || !departmentForQuestion) {
            console.error('Missing required fields');
            return;
        }

        try {
            await createPatientQuestion(patientId, newQuestion, departmentForQuestion);
            setNewQuestion('');
            setDepartmentForQuestion('');
            setOpenDialog(false);
            // Optionally, refresh the questions list here
            if (selectedDepartment) {
                const data = await fetchQuestionsByDepId(selectedDepartment);
                setQuestions(data.$values); // Đảm bảo cấu trúc dữ liệu đúng
            }

        } catch (error) {
            console.error('Error creating question:', error);
        }
    };

    return (
        <>
            <Header />
            <NavBar />
            <CarouselSlider />
            <div style={{
                display: 'flex',
                padding: '20px',
                margin: '20px'
            }}>
                <div style={{ width: '20%', paddingRight: '20px' }}>
                    <div style={{ backgroundColor: '#f0f0f0', padding: '15px' }}>
                        <h3 style={{ color: '#fff', backgroundColor: '#3498db', padding: '10px', margin: '-15px -15px 15px -15px' }}>Chuyên mục tư vấn online</h3>
                        {departments.map((department) => (
                            <div
                                key={department.depId}
                                style={{
                                    marginBottom: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleDepartmentClick(department.depId)}
                            >
                                <span style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    border: '2px solid #3498db',
                                    display: 'inline-block',
                                    marginRight: '10px'
                                }}></span>
                                <span style={{ color: '#333' }}>{department.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ width: '70%', paddingLeft: '20px' }}>
                    <h1 style={{ color: '#3498db' }}>HỎI ĐÁP CHUYÊN GIA</h1>
                    <div>
                        {questions.length === 0 ? (
                            <p>Chọn một chuyên mục để xem các câu hỏi.</p>
                        ) : (
                            questions.map((question) => (
                                <div key={question.$id} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h2 style={{ margin: 0 }}>{question.question1}</h2>
                                        <p style={{ fontSize: '12px', color: 'blue', margin: 0, fontWeight: 'bold' }}>
                                            Ngày hỏi: {new Date(question.quesDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p style={{ fontSize: '13px', color: 'blue', margin: 0 }}>{question.patientName}</p>
                                        <p style={{ fontSize: '12px', color: 'blue', textAlign: 'right' }}>
                                            Ngày trả lời: {question.ansDate ? new Date(question.ansDate).toLocaleDateString() : 'Chưa trả lời'}
                                        </p>
                                    </div>

                                    <p>
                                        <span style={{ color: 'blue' }}>Trả lời:</span> {question.answer ? question.answer : 'Chưa có câu trả lời'}
                                    </p>
                                    <p>
                                        <span style={{ color: 'blue' }}>Người trả lời:</span> {question.doctorName ? question.doctorName : 'Chưa có người trả lời'}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div style={{ justifyContent: 'flex-end', alignItems: 'center', width: '10%', paddingLeft: '30px' }}>
                    <Button
                        style={{ backgroundColor: '#3498db', color: 'white' }}
                        onClick={handleOpenDialog}
                    >
                        Đặt câu hỏi
                    </Button>
                    <Button
                        style={{ backgroundColor: '#3498db', color: 'white', marginTop: '20px' }}
                        component={NavLink} to="/GetListQuestionOfPatient"
                    >Xem câu hỏi</Button>
                </div>
            </div>
            <Footer />
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Đặt câu hỏi</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Chọn chuyên mục"
                        select
                        fullWidth
                        value={departmentForQuestion}
                        onChange={(e) => setDepartmentForQuestion(e.target.value)}
                        variant="outlined"
                        margin="normal"
                    >
                        {departments.map((department) => (
                            <MenuItem key={department.depId} value={department.depId}>
                                {department.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Nhập câu hỏi"
                        multiline
                        rows={4}
                        fullWidth
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        InputProps={{
                            style: { resize: 'both' }, // Cho phép kéo to nhỏ
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button
                        onClick={handleSubmitQuestion}
                        style={{ backgroundColor: '#3498db', color: 'white' }}
                    >
                        Gửi câu hỏi
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PatientViewQuestion;
