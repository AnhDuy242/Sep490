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
//fetch service
export const fetchServices = async (depId) => {
  try {
    const response = await fetch(`https://localhost:7240/api/PatientAppointment/GetListService?deId=${depId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.$values || []; // chỉ trả về mảng $values
  } catch (error) {
    console.error('Failed to fetch services:', error);
    throw error;
  }
};
//fetch doctor
export const fetchDoctorByService = async (seId) => {
  try {
    const response = await fetch(`https://localhost:7240/api/PatientAppointment/GetListDoctor?seId=${seId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.$values || []; // chỉ trả về mảng $values
  } catch (error) {
    console.error('Failed to fetch doctor by service:', error);
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

export const ReceptionbookAppointment = (appointmentData) => {
  return fetch('https://localhost:7240/api/ReceptionistAppointment/CreateAppointment', {
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
//lấy ra list danh sách department 
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
export const fetchSlots = async () => {///////////
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

//set trạng thái để xóa cho appointment
export const cancelAppointment = async (appointmentId) => {
  try {
      const response = await fetch(`https://localhost:7240/api/PatientAppointment/CancelAppointment?aid=${appointmentId}`, {
          method: 'PUT', // Hoặc 'GET' tùy thuộc vào yêu cầu của API
          headers: {
              'Content-Type': 'application/json',
              // Các headers khác nếu cần thiết
          },
          // body: JSON.stringify(data) // Nếu cần gửi dữ liệu body
      });

      if (!response.ok) {
          throw new Error('Failed to cancel appointment');
      }

      const data = await response.json();
      return data; // Hoặc xử lý response tùy vào yêu cầu
  } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
  }
};

//lấy ngày làm việc theo id bác sĩ
export const fetchDateByDoctor = async (docid) => {
  try {
    const response = await fetch(`https://localhost:7240/api/PatientAppointment/GetListDate?docid=${docid}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.$values || []; // chỉ trả về mảng $values
  } catch (error) {
    console.error('Failed to fetch services:', error);
    throw error;
  }
};
//lấy slot theo date
// export const fetchSlotsByDate = async (doctorId, date) => {
//   try {
//     const response = await fetch(`https://localhost:7240/api/PatientAppointment/GetListSlot?docid=${doctorId}`);
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     const data = await response.json();
//     return data.$values || []; // Chỉ trả về mảng $values
//   } catch (error) {
//     console.error('Failed to fetch slots:', error);
//     throw error;
//   }
// };
// src/services/AppointmentPatient.js

export const fetchSlotsByDoctorAndDate = async (doctorId, date) => {
  try {
    const response = await fetch(`https://localhost:7240/api/PatientAppointment/GetListSlot?docid=${doctorId}`, {
      method: 'POST', // Sử dụng phương thức POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date }), // Gửi date trong body
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.$values || []; // chỉ trả về mảng $values
  } catch (error) {
    console.error('Failed to fetch slots:', error);
    throw error;
  }
};
