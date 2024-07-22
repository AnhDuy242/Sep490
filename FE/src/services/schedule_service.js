import moment from 'moment';

export const fetchSchedulesByDoctorID = async (id) => {
  try {
    const response = await fetch(`https://localhost:7240/api/DoctorSchedule/GetAllSchedulesByDoctorId?doctorId=${id}`);
    const data = await response.json();

    if (!data || !data.$values) {
      throw new Error('Invalid response from server');
    }

    const schedules = data.$values.map(item => ({
      date: moment(item.date).toDate(), // Convert date string to Date object
      morning: item.morning,
      afternoon: item.afternoon,
      appointments: item.appointments
    }));

    return schedules;
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return [];
  }
};
