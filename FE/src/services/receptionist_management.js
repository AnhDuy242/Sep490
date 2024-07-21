//Hàm gọi API tạo tài khoản bệnh nhân
export const createPatient = async (patientData) => {
    const url = 'https://localhost:7240/api/CreatePatient/CreatePatient';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patientData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Patient created successfully:', result);
        return result;
    } catch (error) {
        console.error('Error creating patient:', error);
        throw error;
    }
};
//hàm get tài khoản bệnh nhân
export const getAllPatients = async () => {
    const url = 'https://localhost:7240/api/CreatePatient/TestGetAllPatient';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Fetched patients successfully:', result);

        // Kiểm tra và trả về đúng định dạng
        return result.$values ? result.$values : [];
    } catch (error) {
        console.error('Error fetching patients:', error);
        return [];
    }
};

//hàm approve lịch khám 
// ApproveAppointmentAPI.js

// src/services/receptionist_management.js

const BASE_URL = 'https://localhost:7240/api/ReceptionistAppointment';

export const fetchAppointments = async () => {
  try {
    const response = await fetch('https://localhost:7240/api/ReceptionistAppointment/GetAllAppointment');
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    console.log('Fetched Appointments:', data); // Log the fetched data
    if (!Array.isArray(data)) {
      throw new Error('API response is not an array');
    }
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return [];
  }
};

//lấy ra list danh sách doctor 
const listDoctor = 'https://localhost:7240/api/PatientAppointment/GetListDoctor';

export const getListDoctor = async () => {
  try {
    const response = await fetch('https://localhost:7240/api/ReceptionistAppointment/GetAllAppointment', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers if needed
      },
      // Optionally, add a body if your API requires data to be sent
      // body: JSON.stringify({ /* Your data object here */ }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse JSON response
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error; // Rethrow the error so caller can handle it
  }
};




export const approveAppointment = async (appId, status) => {
  try {
    const response = await fetch(`${BASE_URL}/ApproveAppointment?appId=${appId}&status=${encodeURIComponent(status)}`, {
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
};

