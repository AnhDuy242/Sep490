// src/services/doctorService.js

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
    setDoctors(data); // Cập nhật dữ liệu vào trạng thái
  } catch (error) {
    setError(error.message); // Cập nhật lỗi vào trạng thái
  } finally {
    setLoading(false); // Kết thúc trạng thái loading
  }
};
