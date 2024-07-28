//lấy cuộc hẹn
import axios from 'axios';

export const fetchAllAppointments = async () => {
  try {
    const response = await axios.get('https://localhost:7240/api/AdminAppointment/GetAllAppointment', {
      headers: {
        'Content-Type': 'application/json',
        // Nếu bạn cần gửi token hoặc các header khác, thêm vào đây
        // 'Authorization': 'Bearer <your-token>'
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Có lỗi xảy ra khi lấy dữ liệu:', error);
    return null;
  }
};
// nhắc lịch
export const setNotificationTime = async (time) => {
    try {
        const response = await axios.post(
            'https://localhost:7240/api/NotificationTime/SetNotificationTime',
            time,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Có lỗi xảy ra khi gửi dữ liệu:', error.response.data);
        return null;
    }
};
