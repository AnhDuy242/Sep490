// // src/services/doctorService.js

// // Hàm để gọi API lấy danh sách bác sĩ
// export const fetchDoctors = async () => {
//   const response = await fetch('https://localhost:7240/api/Doctor');
//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }
//   return await response.json();
// };

// // Hàm để tải dữ liệu bác sĩ và cập nhật trạng thái
// export const loadDoctors = async (setDoctors, setLoading, setError) => {
//   try {
//     const data = await fetchDoctors(); // Gọi hàm fetchDoctors để lấy dữ liệu
//     setDoctors(data); // Cập nhật dữ liệu vào trạng thái
//   } catch (error) {
//     setError(error.message); // Cập nhật lỗi vào trạng thái
//   } finally {
//     setLoading(false); // Kết thúc trạng thái loading
//   }
// };




// src/services/doctor_service.js

// Hàm để gọi API lấy danh sách bác sĩ
export const fetchDoctors = async () => {
  const response = await fetch('https://localhost:7240/api/Doctor');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

// Hàm để tải dữ liệu bác sĩ và cập nhật trạng thái
export const loadDoctors = async (setDoctors, setLoading, setError) => {
  try {
    const data = await fetchDoctors(); // Gọi hàm fetchDoctors để lấy dữ liệu
    setDoctors(data.$values); // Cập nhật dữ liệu vào trạng thái
  } catch (error) {
    setError(error.message); // Cập nhật lỗi vào trạng thái
  } finally {
    setLoading(false); // Kết thúc trạng thái loading
  }
};

// Hàm để xóa bác sĩ
export const deleteDoctor = async (phone) => {
  const response = await fetch(`https://localhost:7240/api/Doctor/${phone}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to delete doctor with phone ${phone}`);
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

// // Hàm để xóa nhiều bác sĩ
// export const deleteMultipleDoctors = async (phones) => {
//   const response = await fetch('https://localhost:7240/api/DeleteDoctors', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ phones: phones }),
//   });

//   if (!response.ok) {
//     throw new Error('Failed to delete doctors');
//   }
// };

// // Tạo hàm để xóa nhiều bác sĩ
// export const deleteMultipleDoctors = async (phones) => {
//   try {
//     const response = await fetch('https://localhost:7240/api/Doctor', {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ phones }), // Gửi một đối tượng JSON chứa mảng các số điện thoại cần xóa
//     });
//     if (!response.ok) {
//       throw new Error('Failed to delete doctors');
//     }
//     return await response.json(); // Trả về phản hồi JSON từ API nếu cần
//   } catch (error) {
//     console.error('Error deleting doctors:', error);
//     throw error;
//   }
// };

export const deleteMultipleDoctors = async (phones) => {
  try {
    console.log('Sending delete request with phones:', phones);
    const response = await fetch('https://localhost:7240/api/Doctor', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phones: phones }), // Wrap phones in an object
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error(`Failed to delete doctors, status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting doctors:', error);
    throw error;
  }
};




