// appointment.js

import React, { useEffect, useState } from 'react';
import { fetchAppointments } from '../../services/AppointmentPatient'; // Đảm bảo đường dẫn và tên hàm fetchAppointments đúng

const GetAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  
  useEffect(() => {
    // Lấy accountId từ localStorage
    const accountId = localStorage.getItem('accountId');

    // Kiểm tra nếu accountId tồn tại, gọi fetchAppointments với accountId
    if (accountId) {
      fetchAppointments(accountId)
        .then(data => {
          setAppointments(data.$value); // Cập nhật state với dữ liệu lịch hẹn nhận được từ API
        })
        .catch(error => {
          console.error('Failed to fetch appointments:', error);
        });
    }
  }, []); // Chỉ gọi useEffect khi component được mount (tránh gọi lại khi state hay props thay đổi)

  return (
    <div>
      <h2>Appointment List</h2>
      <ul>
        {appointments.map(appointment => (
          <li key={appointment.id}>
            {/* Hiển thị thông tin lịch hẹn */}
            <div>Date: {appointment.date}</div>
            <div>Time: {appointment.time}</div>
            <div>Doctor: {appointment.doctorName}</div>
            {/* Thêm các thông tin khác tùy theo cấu trúc dữ liệu trả về */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetAppointment;
