// Biến để lưu URL API
const apiUrl = 'https://localhost:7240/api/PatientAppointment/GetAppointment';

// Hàm fetch có thể được gọi khi cần thiết, ví dụ khi nhấn vào một nút hoặc xử lý sự kiện khác
function fetchAppointments(patientId) {
  const fullUrl = `${apiUrl}?pid=${patientId}`;

  fetch(fullUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Xử lý dữ liệu ở đây
      console.log(data);
    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
    });
}