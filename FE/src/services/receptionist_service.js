// src/services/receptionist_account.js

const BASE_URL = 'https://localhost:7240/api/Receptionist';

export const addOrUpdateReceptionist = async (receptionist, isEditMode) => {
  const url = isEditMode ? `${BASE_URL}/${receptionist.phone}` : BASE_URL;
  const method = isEditMode ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(receptionist)
    });

    if (!response.ok) {
      throw new Error('Failed to add/update receptionist');
    }

    return response.json(); // Return the JSON response if needed
  } catch (error) {
    console.error('Error adding/updating receptionist:', error);
    throw error;
  }
};

export const loadReceptionists = async (callback, errorCallback) => {
  const url = BASE_URL;

  try {
    const response = await fetch(url);
    console.log(response); // Log response to inspect the fetched data

    if (!response.ok) {
      throw new Error('Failed to load receptionists');
    }

    const jsonData = await response.json(); // Parse response as JSON

    // Call the callback function with the received data
    callback(jsonData);
  } catch (error) {
    console.error('Error loading receptionists:', error);
    if (errorCallback) {
      errorCallback(error);
    }
    throw error;
  }
};

export const deleteReceptionist = async (phone) => {
  try {
    const response = await fetch(`${BASE_URL}/${phone}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete receptionist with phone ${phone}`);
    }
  } catch (error) {
    console.error('Error deleting receptionist:', error);
    throw error;
  }
};

export const addReceptionist = async (receptionist) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(receptionist),
    });

    if (!response.ok) {
      throw new Error('Failed to add new receptionist'+response.status);
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


