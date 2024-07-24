const BASE_URL = 'https://localhost:7240/api';

export const fetchPatients = async () => {
  try {
    const response = await fetch('https://localhost:7240/api/DoctorMedicalNotebook/GetAllPatient');

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return data.$values; // Parse JSON response
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error; // Rethrow the error so caller can handle it
  }
};
export const createMedicalNotebook = async (formData) => {
    try {
      const response = await fetch(`${BASE_URL}/DoctorMedicalNotebook/CreateMedicalNoteBook`, {
        method: 'POST',  // Use POST method
        headers: {
          'Content-Type': 'application/json'  // Set content type to JSON
        },
        body: JSON.stringify(formData)  // Convert formData to JSON
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Assuming the response is in JSON format
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };
  