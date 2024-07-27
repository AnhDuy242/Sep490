export const fetchServices = async () => {
    try {
      const response = await fetch('https://localhost:7240/api/Header/GetService');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.$values;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      return [];
    }
  };
  export const fetchFeedbacks = async () => {
    try {
      const response = await fetch('https://localhost:7240/api/PatientFeedback/GetAllFeedback');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch feedbacks failed:', error);
      throw error;
    }
  };
  