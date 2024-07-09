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
  