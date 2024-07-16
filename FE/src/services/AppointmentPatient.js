// Biến để lưu URL API
// const apiUrl = 'https://localhost:7240/api/PatientAppointment/GetAppointment';

// services/AppointmentPatient.js

export const fetchAppointments = async (patientId) => {
  try {
    const apiUrl = `https://localhost:7240/api/PatientAppointment/GetAppointment?pid=${patientId}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.$value;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};
