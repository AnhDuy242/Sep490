
const BASE_URL="https://localhost:7240/api/Authentication"

export const login = async (Identifier, password) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({Identifier, password }),
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      return response.json();
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };
  
  const handleRegister = async (credentials) => {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Register successful', data);
        // Handle successful login
      } else {
        console.log('Register failed');
        // Handle failed login
      }
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  export const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token');
  
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    return response.json();
  };
  export const logout = () => {
    localStorage.removeItem('token');
  };