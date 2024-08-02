// src/services/department_service.js
import axios from "axios";
export const fetchServices = async () => {
    const response = await fetch('https://localhost:7240/api/Header/GetService');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  };
  
  export const fetchDepartments = async () => {
    try {
      const response = await axios.get('https://localhost:7240/api/Department/GetDepartments');
      return response.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error; // Rethrow the error to handle it where the function is called
    }
  };
  export const fetchServicesByDepartment = async (departmentId) => {
    try {
      const response = await axios.get(`https://localhost:7240/api/Department/GetServicesAndDetailsByDepartmentId/GetServicesByDepartment/${departmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching services by department:', error);
      throw error;
    }
  };