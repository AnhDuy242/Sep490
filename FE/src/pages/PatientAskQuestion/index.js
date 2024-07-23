import React, { useState, useEffect } from 'react';
import Header from '../../layouts/Header';
import NavBar from '../../layouts/Navbar';
import CarouselSlider from '../../layouts/CarouselSlider';
import Footer from '../../layouts/Footer';
import { fetchQuestionsByDepId } from './../../services/QuestionService'; // Cập nhật đường dẫn đúng với vị trí của hàm

const listDepart = 'https://localhost:7240/api/PatientAppointment/GetListDepartment';

export const getListDepartment = async () => {
    try {
        const response = await fetch(listDepart, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};

const PatientViewQuestion = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [questions, setQuestions] = useState([]);

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
        console.log('dep', depId)
    };
    useEffect(() => {
        const fetchQuestions = async () => {
            if (selectedDepartment) {
                console.log('đây là data1 ạ', selectedDepartment)
                try {
                    const data = await fetchQuestionsByDepId(selectedDepartment);
                    console.log('đây là data ạ', data)
                    setQuestions(data); // Đảm bảo cấu trúc dữ liệu đúng
                } catch (error) {
                    console.error('Error fetching questions:', error);
                }
            }
        };

        fetchQuestions();
    }, [selectedDepartment]);



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
                <div style={{ width: '25%', paddingRight: '20px' }}>
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
                <div style={{ width: '75%', paddingLeft: '20px' }}>
                    <h1 style={{ color: '#3498db' }}>HỎI ĐÁP CHUYÊN GIA</h1>
                    <div>
                        {questions.length === 0 ? (
                            <p>Chọn một chuyên mục để xem các câu hỏi.</p>
                        ) : (
                            questions.map((question) => (
                                <div key={question.$id} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                                    <h4>{question.question1}</h4>
                                    <p>Ngày hỏi: {new Date(question.quesDate).toLocaleDateString()}</p>
                                    {/* <p>Ngày trả lời: {question.ansDate ? new Date(question.ansDate).toLocaleDateString() : 'Chưa trả lời'}</p> */}
                                    <p>{question.answer ? question.answer : 'Chưa có câu trả lời'}</p>
                                    <button style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '5px 10px' }}>Xem câu trả lời</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PatientViewQuestion;
