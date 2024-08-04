// Hàm để gọi API lấy danh sách bác sĩ
// src/services/doctor_service.js

import axios from 'axios';

export const fetchDoctors = async () => {
  const response = await fetch('https://localhost:7240/api/Doctor');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

export const loadDoctors = async (setDoctors, setLoading, setError) => {
  try {
    setLoading(true);
    const data = await fetchDoctors(); // Gọi hàm fetchDoctors để lấy dữ liệu
    console.log('Data received:', data); // Log dữ liệu nhận được
    setDoctors(data.$values); // Cập nhật dữ liệu vào trạng thái
    return data;
  } catch (error) {
    console.error('Error loading doctors:', error); // Log lỗi
    setError(error.message); // Cập nhật lỗi vào trạng thái
  } finally {
    setLoading(false); // Kết thúc trạng thái loading
  }
};


// Hàm để thêm bác sĩ mới
export const addDoctor = async (doctor) => {
  const response = await fetch('https://localhost:7240/api/CreateEmployee', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(doctor),
  });
  if (!response.ok) {
    throw new Error('Failed to add new doctor');
  }
  return await response.json();
};

// Hàm để chỉnh sửa thông tin bác sĩ
export const updateDoctor = async (id, data) => {
  const url = `https://localhost:7240/api/Doctor/${id}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const updatedDoctor = await response.json(); // Đảm bảo dữ liệu trả về là JSON
    return updatedDoctor;
  } catch (error) {
    console.error('Error updating doctor:', error);
    throw error;
  }
};


export const fetchSchedulesByDoctorId = async (doctorId) => {
  try {
    const response = await fetch(`https://localhost:7240/api/ManageSchedule/GetAllSchedulesByDoctorId?doctorId=${doctorId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch schedules: ${error.message}`);
  }
};
// services/apiService.js


export const fetchTestResults = async (mid) => {
  try {
      const response = await fetch(`https://localhost:7240/api/PatientMedicalNoteBook/GetTestResult?mid=${mid}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
  } catch (error) {
      console.error('Error fetching test results:', error);
      throw error;
  }
};


export const getPatientsByDoctorId = async (doctorId) => {
  try {
    const response = await fetch(`https://localhost:7240/api/DoctorCustomerCare/GetListPatientByDoctorId?docid=${doctorId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.$values;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
export const fetchOrCreateConversation = async (doctorId, patientId) => {
  try {
    // Check for existing conversation
    let conversation = await getConversationsByPatientAndDoctor(doctorId, patientId);
    console.log(conversation);
    if (!conversation) {
      // Fetch names of the patient and doctor
      const patientName = await getPatientNameById(patientId);
      const doctorName = await getDoctorNameById(doctorId);

      // Create a new conversation if none exists
      conversation = await createConversation({
        doctorId,
        patientId,
        createdAt: new Date(),
        conversation_Name: `Cuộc hội thoại giữa bệnh nhân ${patientName} và bác sĩ ${doctorName}`,
      });
    }

    return conversation;
  } catch (error) {
    console.error('Error in fetchOrCreateConversation:', error);
    throw error;
  }
};
export const createConversation = async (conversationData) => {
  try {
    // Make sure conversationData contains all required fields
    const response = await axios.post('https://localhost:7240/api/Conversations/CreateIfNotExist', conversationData);
    return response.data;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};
export const getConversationsByPatientAndDoctor = async (doctorId, patientId) => {
  try {
    const response = await axios.get(`https://localhost:7240/api/Conversations/GetByDoctorIdAndPatientID?doctorId=${doctorId}&patientId=${patientId}`);
    return response.data;
  } catch (error) {
    return null;
  }
}


export const getPatientNameById = async (patientId) => {
  try {
    const response = await axios.get(`https://localhost:7240/api/Conversations/GetPatientName/patientname/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patient name:', error);
    throw error;
  }
};

export const getDoctorNameById = async (doctorId) => {
  try {
    const response = await axios.get(`https://localhost:7240/api/Conversations/GetDoctorName/${doctorId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor name:', error);
    throw error;
  }
};