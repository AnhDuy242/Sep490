// src/services/department_service.js

export const fetchServices = async () => {
    const response = await fetch('https://localhost:7240/api/Header/GetService');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  };
  