// import React, { useState, useEffect } from 'react';
// import { Grid } from '@mui/material';
// import Header from '../../layouts/Header'
// import NavBar from '../../layouts/Navbar'
// import CarouselSlider from '../../layouts/CarouselSlider';
// import Footer from '../../layouts/Footer'
// // Hàm gọi API để lấy danh sách phòng ban
// const listDepart = 'https://localhost:7240/api/PatientAppointment/GetListDepartment';

// export const getListDepartment = async () => {
//     try {
//         const response = await fetch(listDepart, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         return response.json(); // Parse JSON response
//     } catch (error) {
//         console.error('There was a problem with the fetch operation:', error);
//         throw error; // Rethrow the error so caller can handle it
//     }
// };

// const PatientViewQuestion = () => {
//     const [departments, setDepartments] = useState([]);
//     const [selectedDepartment, setSelectedDepartment] = useState(null);

//     useEffect(() => {
//         const fetchDepartments = async () => {
//             try {
//                 const data = await getListDepartment();
//                 setDepartments(data.$values); // Giả sử data là một mảng các phòng ban
//             } catch (error) {
//                 console.error('Error fetching departments:', error);
//             }
//         };

//         fetchDepartments();
//     }, []);

//     const handleDepartmentChange = (event) => {
//         setSelectedDepartment(event.target.value);
//     };

//     return (
//         <>
//             <Header />
//             <NavBar />
//             <CarouselSlider />
//             <div style={{
//                 display: 'grid',
//                 gridTemplateColumns: '2fr 7fr',
//                 gap: '20px',
//                 padding: '20px', // Khoảng cách bên trong của vùng chứa chính
//                 margin: '20px'   // Khoảng cách bên ngoài của vùng chứa chính
//             }}>
//                 <div style={{ paddingRight: '20px' }}>
//                     <h4>Danh sách phòng ban</h4>
//                     <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
//                         {departments.map((department) => (
//                             <li key={department.id}>
//                                 <label>
//                                     <input
//                                         type="radio"
//                                         name="department"
//                                         value={department.id}
//                                         checked={selectedDepartment === department.id}
//                                         onChange={handleDepartmentChange}
//                                     />
//                                     {department.name}
//                                 </label>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//                 <div style={{ paddingLeft: '20px' }}>
//                     <h1>Hỏi đáp chuyên gia</h1>
//                 </div>
//             </div>
//             <Footer />
//         </>


//     );
// };

// export default PatientViewQuestion;



import React, { useState, useEffect } from 'react';
import Header from '../../layouts/Header'
import NavBar from '../../layouts/Navbar'
import CarouselSlider from '../../layouts/CarouselSlider';
import Footer from '../../layouts/Footer'

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

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const data = await getListDepartment();
                setDepartments(data.$values);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        fetchDepartments();
    }, []);

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
                            <div key={department.id} style={{ 
                                marginBottom: '15px', 
                                display: 'flex', 
                                alignItems: 'center',
                                cursor: 'pointer'
                            }}>
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
                        {/* Đây là nơi bạn sẽ thêm các câu hỏi và trả lời */}
                        <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                            <h4>Thanh Huyền</h4>
                            <p>khám nội</p>
                            <p>Tôi muốn tư vấn để đăng ký khám nội tổng quát cơ thể. Cảm ơn bác sĩ!</p>
                            <button style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '5px 10px' }}>Xem câu trả lời</button>
                        </div>
                        {/* Thêm các câu hỏi khác tương tự */}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PatientViewQuestion;