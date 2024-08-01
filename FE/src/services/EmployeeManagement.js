import axios from 'axios';

const API_URL = 'https://localhost:7240/api/Employee';

export const fetchDoctors = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetAllDoctors`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchReceptionists = async () => {
    try {
        const response = await axios.get(`${API_URL}/GetAllReceptionists`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchAllEmployees = async () => {
    try {
        const [doctors, receptionists] = await Promise.all([
            fetchDoctors(),
            fetchReceptionists(),
        ]);
        return [...doctors, ...receptionists];
    } catch (error) {
        throw error;
    }
};
