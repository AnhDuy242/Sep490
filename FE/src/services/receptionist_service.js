// src/services/receptionist_account.js

const BASE_URL = 'https://localhost:7240/api/Receptionist';
const SECONDARY_URL = 'https://localhost:7240/api/CreateEmployee';


export const updateReceptionist = async (accId, receptionist) => {
  const url = `${BASE_URL}/${accId}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(receptionist),
    });

    if (!response.ok) {
      throw new Error(`Failed to update receptionist with phone ${accId}. Status code: ${response.status}`);
    }

    // Check for 204 No Content
    if (response.status === 204) {
      return null; // or return a message or an empty object based on your needs
    }

    // Parse JSON response if available
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating receptionist:', error);
    throw error;
  }
};


export const updateReceptionistByActive = async (accId, receptionist) => {
  const url = `${BASE_URL}/${accId}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(receptionist),
    });

    if (!response.ok) {
      throw new Error(`Failed to update receptionist with accId ${accId}`);
    }

    // Check if response body is empty
    const data = await response.text();
    if (!data) {
      return {}; // Return empty object if response body is empty
    }

    return JSON.parse(data); // Parse JSON data if available
  } catch (error) {
    console.error('Error updating receptionist:', error);
    throw error;
  }
};


export const loadReceptionists = async (setAccounts, setLoading, setError) => {
  const url = BASE_URL;

  try {
    setLoading(true);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to load receptionists');
    }

    const jsonData = await response.json();
    setAccounts(Array.isArray(jsonData.$values) ? jsonData.$values : []);
  } catch (error) {
    console.error('Error loading receptionists:', error);
    setError(error);
  } finally {
    setLoading(false);
  }
};


export const deleteReceptionist = async (phone) => {
  try {
    const response = await fetch(`${BASE_URL}/${phone}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete receptionist with phone ${phone} - Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting receptionist:', error);
    throw error;
  }
};

export const addReceptionist = async (receptionist) => {
  try {
      const response = await fetch(SECONDARY_URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(receptionist),
      });

      if (!response.ok) {
          let errorMessage = 'Failed to add new receptionist';
          if (response.status === 400 || response.status === 409) {
              // Handle specific error messages if necessary
              const data = await response.json();
              errorMessage = data.message || errorMessage;
          }
          throw new Error(`${errorMessage} - Status: ${response.status}`);
      }

      return await response.json();
  } catch (error) {
      console.error('Error adding receptionist:', error);
      throw error;
  }
};


export const deleteMultipleReceptionists = async (phones) => {
  try {
    const deletePromises = phones.map((phone) =>
      fetch(`${BASE_URL}/${phone}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );

    const responses = await Promise.all(deletePromises);

    responses.forEach((response) => {
      if (!response.ok) {
        throw new Error('Failed to delete one or more receptionists');
      }
    });
  } catch (error) {
    console.error('Error deleting receptionists:', error);
    throw error;
  }
};