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
    const urll = 'https://localhost:7240/api/ReceptionistMedicalNotebook/GetAllPatient';

    try {
        const response = await fetch(urll, {
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

//hàm get notebooks bệnh nhân
export const getMedicalNotebooks = async () => {
    const url = 'https://localhost:7240/api/ReceptionistMedicalNotebook/GetAllMedicalNoteBook';

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
// export const getMedicalNotebooks = async () => {
//     const response = await fetch('https://your-api-endpoint.com/api/medicalNotebooks');
//     if (!response.ok) {
//         throw new Error('Failed to fetch medical notebooks');
//     }
//     const data = await response.json();
//     return data.$values; // Trả về mảng $values
// };

//set trạng thái hoạt động của patient
export const updatePatientStatus = async (pid) => {
  const url = `https://localhost:7240/api/ReceptionistMedicalNotebook/SetOnlinePatientByPid?pid=${pid}`;

  try {
      const response = await fetch(url, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          }
      });

      if (response.ok) {
          // Kiểm tra xem phản hồi có nội dung hay không
          const text = await response.text();
          const data = text ? JSON.parse(text) : {};
          console.log('Success:', data);
          return data;
      } else {
          const error = await response.text();
          console.error('Error:', error);
          throw new Error(`Failed to set online patient: ${error}`);
      }
  } catch (error) {
      console.error('Error:', error);
      throw new Error(`An error occurred: ${error.message}`);
  }
};

// set trạng thái không hoạt động của patient
export const setOfflinePatientByMid = async (mid) => {
  const url = `https://localhost:7240/api/ReceptionistMedicalNotebook/SetOfflinePatientByMid?mid=${mid}`;

  try {
      const response = await fetch(url, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          }
      });

      if (response.ok) {
          // Kiểm tra xem phản hồi có nội dung hay không
          const text = await response.text();
          const data = text ? JSON.parse(text) : {};
          console.log('Success:', data);
          return data;
      } else {
          const error = await response.text();
          console.error('Error:', error);
          throw new Error(`Failed to set offline patient: ${error}`);
      }
  } catch (error) {
      console.error('Error:', error);
      throw new Error(`An error occurred: ${error.message}`);
  }
};
