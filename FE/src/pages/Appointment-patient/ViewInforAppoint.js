// // appointment.js

// import React, { useEffect, useState } from 'react';
// import { fetchAppointments } from '../../services/AppointmentPatient'; // Đảm bảo đường dẫn và tên hàm fetchAppointments đúng

// const GetAppointment = () => {
//     const [appointments, setAppointments] = useState([]);
    
//     useEffect(() => {
//       // Lấy accountId từ localStorage
//       const accountId = localStorage.getItem('accountId');
  
//       // Kiểm tra nếu accountId tồn tại, gọi fetchAppointments với accountId
//       if (accountId) {
//         fetchAppointments(accountId)
//           .then(data => {
//             // Kiểm tra data.$value có tồn tại không
//             if (data && data.$value) {
//               setAppointments(data.$value); // Cập nhật state với dữ liệu lịch hẹn nhận được từ API
//             } else {
//               setAppointments([]); // Nếu không có dữ liệu, gán một mảng rỗng
//             }
//           })
//           .catch(error => {
//             console.error('Failed to fetch appointments:', error);
//           });
//       }
//     }, []); // Chỉ gọi useEffect khi component được mount (tránh gọi lại khi state hay props thay đổi)
  
//     return (
//       <div>
//         <h2>Danh sách cuộc hẹn</h2>
//         <ul>
//           {appointments.map(appointment => (
//             <li key={appointment.id}>
//               <div>Tên bệnh nhân: {appointment.patientName}</div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   };
  
//   export default GetAppointment;



import React, { useEffect, useState } from 'react';
import { fetchAppointments } from '../../services/AppointmentPatient';

const GetAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  
  useEffect(() => {
    const accountId = localStorage.getItem('accountId');

    if (accountId) {
      fetchAppointments(accountId)
        .then(data => {
          if (data && data.$values) {
            setAppointments(data.$values);
          } else {
            setAppointments([]);
          }
        })
        .catch(error => {
          console.error('Failed to fetch appointments:', error);
        });
    }
  }, []);

  return (
    <div>
      <h2>Danh sách cuộc hẹn</h2>
      <ul>
        {appointments.length > 0 ? (
          appointments.map(appointment => (
            <li key={appointment.id}>
              <div>
                <strong>Tên bệnh nhân:</strong> {appointment.patientName}
              </div>
              <div>
                <strong>Thời gian:</strong> {appointment.time}
              </div>
              <div>
                <strong>Bác sĩ:</strong> {appointment.doctorName}
              </div>
              <div>
                <strong>Trạng thái:</strong> {appointment.status}
              </div>
              {appointment.note && (
                <div>
                  <strong>Ghi chú:</strong> {appointment.note}
                </div>
              )}
            </li>
          ))
        ) : (
          <li>Không có cuộc hẹn nào.</li>
        )}
      </ul>
    </div>
  );
};

export default GetAppointment;
