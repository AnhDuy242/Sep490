// import React, { useState, useEffect } from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import { fetchQuestionsByDepId, fetchDepartments, answerQuestion } from './../../../services/QuestionService'; // Import hàm answerQuestion

// const DoctorAnswerQuestion = () => {
//     const [questions, setQuestions] = useState([]);
//     const [depId, setDepId] = useState(null);
//     const [open, setOpen] = useState(false);
//     const [currentQuestionId, setCurrentQuestionId] = useState(null);
//     const [answer, setAnswer] = useState('');
//     const docId = localStorage.getItem('accountId');

//     useEffect(() => {
//         const getDepartmentAndQuestions = async () => {
//             if (!docId) {
//                 console.error('No docId found in local storage');
//                 return;
//             }

//             try {
//                 const department = await fetchDepartments(docId);
//                 if (department && department.depId) {
//                     const departmentId = department.depId;
//                     setDepId(departmentId);

//                     const questionsData = await fetchQuestionsByDepId(departmentId);
//                     setQuestions(questionsData.$values);
//                 } else {
//                     console.error('No department found');
//                 }
//             } catch (error) {
//                 console.error('Error fetching department or questions:', error);
//             }
//         };

//         getDepartmentAndQuestions();
//     }, [docId]);

//     const handleClickOpen = (questionId) => {
//         setCurrentQuestionId(questionId);
//         setAnswer(''); // Reset câu trả lời trong Dialog
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setOpen(false);
//         setAnswer('');
//         setCurrentQuestionId(null);
//     };

//     const handleSave = async () => {
//         if (currentQuestionId) {
//             try {
//                 await answerQuestion(currentQuestionId, answer, docId);
//                 handleClose();
//                 // Cập nhật lại danh sách câu hỏi sau khi lưu
//                 const questionsData = await fetchQuestionsByDepId(depId);
//                 setQuestions(questionsData.$values);
//             } catch (error) {
//                 console.error('Error saving answer:', error);
//             }
//         }
//     };

//     return (
//         <div>
//             <TableContainer component={Paper}>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell>ID</TableCell>
//                             <TableCell>Câu hỏi</TableCell>
//                             <TableCell>Ngày tạo</TableCell>
//                             <TableCell>Trả lời câu hỏi</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {questions.map((question) => (
//                             <TableRow key={question.quesId}>
//                                 <TableCell>{question.quesId}</TableCell>
//                                 <TableCell>{question.question1}</TableCell>
//                                 <TableCell>{question.quesDate}</TableCell>
//                                 <TableCell>
//                                     <IconButton onClick={() => handleClickOpen(question.quesId)}>
//                                         <EditIcon />
//                                     </IconButton>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>

//             <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//                 <DialogTitle>Trả lời câu hỏi</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         autoFocus
//                         margin="dense"
//                         label="Trả lời"
//                         type="text"
//                         fullWidth
//                         multiline
//                         minRows={4}
//                         maxRows={10}
//                         value={answer}
//                         onChange={(e) => setAnswer(e.target.value)}
//                         variant="outlined"
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose} color="primary">
//                         Hủy
//                     </Button>
//                     <Button onClick={handleSave} color="primary">
//                         Lưu
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </div>
//     );
// };

// export default DoctorAnswerQuestion;



import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { fetchQuestionsByDepId, fetchDepartments, answerQuestion } from './../../../services/QuestionService'; // Import hàm answerQuestion

const DoctorAnswerQuestion = () => {
    const [questions, setQuestions] = useState([]);
    const [depId, setDepId] = useState(null);
    const [open, setOpen] = useState(false);
    const [currentQuestionId, setCurrentQuestionId] = useState(null);
    const [answer, setAnswer] = useState('');
    const docId = localStorage.getItem('accountId');

    useEffect(() => {
        const getDepartmentAndQuestions = async () => {
            if (!docId) {
                console.error('No docId found in local storage');
                return;
            }

            try {
                const department = await fetchDepartments(docId);
                if (department && department.depId) {
                    const departmentId = department.depId;
                    setDepId(departmentId);

                    const questionsData = await fetchQuestionsByDepId(departmentId);
                    setQuestions(questionsData.$values);
                } else {
                    console.error('No department found');
                }
            } catch (error) {
                console.error('Error fetching department or questions:', error);
            }
        };

        getDepartmentAndQuestions();
    }, [docId]);

    const handleClickOpen = (questionId) => {
        setCurrentQuestionId(questionId);
        setAnswer(''); // Reset câu trả lời trong Dialog
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setAnswer('');
        setCurrentQuestionId(null);
    };

    const handleSave = async () => {
        if (currentQuestionId) {
            try {
                await answerQuestion(currentQuestionId, answer, docId);
                handleClose();
                // Cập nhật lại danh sách câu hỏi sau khi lưu
                const questionsData = await fetchQuestionsByDepId(depId);
                setQuestions(questionsData.$values);
            } catch (error) {
                console.error('Error saving answer:', error);
            }
        }
    };

    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Câu hỏi</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                            <TableCell>Trả lời câu hỏi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questions.map((question) => (
                            <TableRow key={question.quesId}>
                                <TableCell>{question.quesId}</TableCell>
                                <TableCell>{question.question1}</TableCell>
                                <TableCell>{question.quesDate}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleClickOpen(question.quesId)}>
                                        <EditIcon />
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
                maxWidth="md"
                fullWidth
                PaperProps={{
                    style: {
                        maxHeight: '80vh', // Giới hạn chiều cao tối đa của Dialog
                        maxWidth: '90vw',  // Giới hạn chiều rộng tối đa của Dialog
                    },
                }}
            >
                <DialogTitle>Trả lời câu hỏi</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Trả lời"
                        type="text"
                        fullWidth
                        multiline
                        minRows={4}
                        maxRows={10}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        variant="outlined"
                        sx={{
                            resize: 'both', // Cho phép điều chỉnh kích thước của TextField
                            maxHeight: '60vh', // Giới hạn chiều cao tối đa của TextField
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DoctorAnswerQuestion;
