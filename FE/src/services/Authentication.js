
const BASE_URL = "https://localhost:7240/api/Authentication"
const SECONDARY_URL = "https://localhost:7240/api/Otp"
export const login = async (Identifier, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Identifier, password }),
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
export const handleRegisterForEmail = async (email) => {
  try {
    const encodedEmail = encodeURIComponent(email); // Encode the email address

    const response = await fetch(`${SECONDARY_URL}/send-email?Email=${encodedEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      try {
        const data = await response.json();
        console.log('Response from /send-email:', data);
        // Handle successful response if needed
      } catch (error) {
        console.error('Error parsing JSON from response:', error);
        // Handle non-JSON response (if any)
      }
    } else {
      try {
        const errorData = await response.json();
        console.log('Error response from /send-email:', errorData);
        // Handle error response
      } catch (error) {
        console.error('Error parsing JSON from error response:', error);
        // Handle non-JSON error response (if any)
      }
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};

export const handleReceiveOTPForEmail =  async (email) => {
  try {
    const encodedEmail = encodeURIComponent(email); // Encode the email address

    const response = await fetch(`${SECONDARY_URL}/receive-otp-email?Email=${encodedEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('OTP sent to the email', data);
      // Handle successful OTP send
      return data.otp;
    } else {
      const errorData = await response.json();
      console.log('OTP could not be sent:', errorData);
      // Handle failed OTP send
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};
export const handleSentOTPConfirm = async (email, otp) => {

    const response = await fetch(`${SECONDARY_URL}/verify-email-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ otp, email}),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('OTP confirmation response:', data);
        // Handle successful OTP confirmation
        // Proceed with registration or next steps
      })
      .catch(error => {
        console.error('Error sending OTP:', error);
      });
  }






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