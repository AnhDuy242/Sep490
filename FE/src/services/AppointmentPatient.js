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
    return data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

//Hàm update appointment
export const updateAppointment = async (appointmentId, updatedAppointment) => {
  const apiUrl = `https://localhost:7240/api/PatientAppointment/UpdateAppointment?appId=${appointmentId}`;
  
  try {
      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedAppointment)
      });

      if (!response.ok) {
          throw new Error('Failed to update appointment');
      }

      const data = await response.json();
      return data; // Return updated appointment data if needed
  } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
  }
};

//lấy danh sách bác sĩ để đổ vào combobox
export const fetchDoctors = async () => {
  try {
      const response = await fetch('https://localhost:7240/api/Doctor');
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Failed to fetch doctors:', error);
      throw error;
  }
};
//lấy slot list
export const fetchSlots = async () => {
  try {
      const response = await fetch('https://localhost:7240/api/PatientAppointment/GetListSlot');
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Failed to fetch doctors:', error);
      throw error;
  }
};