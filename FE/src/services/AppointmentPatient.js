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

//hàm book appointment cho patient 

const bookAppoint = 'https://localhost:7240/api/PatientAppointment/BookAppointment';

export const bookAppointment = (appointmentData) => {
  return fetch(bookAppoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointmentData),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .catch(error => {
    console.error('There was an error booking the appointment!', error);
    throw error;
  });
};

//lấy ra list danh sách doctor 
const listDoctor = 'https://localhost:7240/api/PatientAppointment/GetListDoctor';

export const getListDoctor = async () => {
  try {
    const response = await fetch(listDoctor, {
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


const listDepart = 'https://localhost:7240/api/PatientAppointment/GetListDepartment';

export const getListDepartment = async () => {
  try {
    const response = await fetch(listDepart, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers if needed
      },
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
