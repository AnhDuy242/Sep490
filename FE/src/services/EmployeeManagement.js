import axios from 'axios';

const API_BASE_URL = 'https://localhost:7240/api/Employee';

export const fetchDoctors = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/GetAllDoctors`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchReceptionists = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/GetAllReceptionists`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const fetchAllEmployees = async () => {
    try {
        // Gọi API để lấy dữ liệu
        const response = await axios.get('https://localhost:7240/api/Employee/GetAllDoctorsAndReceptionists');
        
        // Xử lý dữ liệu trả về
        const { doctors, receptionists } = response.data;

        // Nếu cần, bạn có thể kết hợp cả bác sĩ và lễ tân vào một danh sách duy nhất
        const allEmployees = [
            ...doctors.$values.map(doctor => ({
                ...doctor,
                type: 'Doctor'
            })),
            ...receptionists.$values.map(receptionist => ({
                ...receptionist,
                type: 'Receptionist'
            }))
        ];

        return allEmployees;
    } catch (error) {
        // Xử lý lỗi
        console.error('Error fetching employees:', error);
        throw error;
    }
};

export const addDoctor = async (doctor) => {
    const response = await fetch('https://localhost:7240/api/Employee/CreateDoctorAlter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctor),
    });

    if (!response.ok) {
        throw new Error('Failed to add doctor');
    }

    return response.json();
};
// Add Receptionist
export const addReceptionist = async (receptionist) => {
    try {
        await axios.post(`https://localhost:7240/api/Employee/CreateReceptionistAlter/Create`, receptionist);
    } catch (error) {
        throw new Error('Failed to add receptionist');
    }
};

// Update Doctor
export const updateDoctor = async (id, doctor) => {
    try {
        await axios.put(`${API_BASE_URL}/UpdateDoctor/${id}`, doctor);
    } catch (error) {
        throw new Error('Failed to update doctor');
    }
};

// Update Receptionist
export const updateReceptionist = async (id, receptionist) => {
    try {
        await axios.put(`${API_BASE_URL}/UpdateReceptionist/${id}`, receptionist);
    } catch (error) {
        throw new Error('Failed to update receptionist');
    }
};
export const deleteEmployee = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/DeleteEmployee/${id}`);
    } catch (error) {
        throw new Error('Failed to delete employee');
    }
};
const API_URL = 'https://localhost:7240/api/Employee'; // Đổi URL cho phù hợp

export const updateEmployeeStatus = async (accId, isActive) => {
    const response = await fetch(`https://localhost:7240/api/Employee/UpdateStatus?accId=${accId}&isActive=${isActive}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }
    // Handle plain text response
    const text = await response.text();
    return text;
};


export const updateDoctorStatus = async (accId, isActive) => {
    const response = await fetch(`https://localhost:7240/api/Employee/UpdateDoctorStatus?accId=${accId}&isActive=${isActive}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Network response was not ok.');
    }
    // Handle plain text response
    const text = await response.text();
    return text;
};
