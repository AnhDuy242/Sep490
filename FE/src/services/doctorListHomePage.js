// src/services/api.js
import axios from 'axios';

const API_URL = 'https://localhost:7240/api';

export const fetchDoctors = async () => {
  try {
    const response = await axios.get(`${API_URL}/Header/GetAllDoctor`);
    return response.data.$values;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

