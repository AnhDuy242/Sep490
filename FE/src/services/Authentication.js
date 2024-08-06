
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

    const response = await fetch(`${SECONDARY_URL}/SendOtp?Email=${encodedEmail}`, {
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

export const handleReceiveOTPForEmail = async (email) => {
  try {
    const encodedEmail = encodeURIComponent(email); // Encode the email address

    const response = await fetch(`${SECONDARY_URL}/ReceiveOtpEmail?Email=${encodedEmail}`, {
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
export const handleRegisterForPhone  = async (phone) => {
  try {

    const response = await fetch(`https://localhost:7240/api/Otp/SendOtpSms?PhoneNumber?PhoneNumber=${phone}`, {
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
export const handleSentOTPConfirmForEmail = async (email, otp) => {

  const response = await fetch(`${SECONDARY_URL}/VerifyOtpEmail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({ otp, email }),
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

export const RegisterCompleteForm = async (registrationDetails,getPhone) => {
  try {
    const response = await fetch(`${BASE_URL}/Register?phone=${getPhone}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Name: registrationDetails.Name,
        Email: registrationDetails.email,
        Dob: registrationDetails.dob,
        Gender: registrationDetails.Gender,
        Address: registrationDetails.address,
        // Phone: registrationDetails.Phone, // Hoặc registrationDetails.Phone nếu bạn muốn lấy từ form
        Password: registrationDetails.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Validation error:', errorData);
      throw new Error(errorData.message || 'Network response was not ok');
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError);
      throw new Error('Registration successful but could not parse response');
    }

    console.log('Registration successful:', data);
    return data; // Optionally return data to handle further in caller function
  } catch (error) {
    console.error('Error during registration:', error);
    throw error; // Propagate error to handle in caller function or component
  }
};

//tạo feedback của bệnh nhân

export const createFeedback = async (feedback, pid) => {
  try {
    const response = await fetch(`https://localhost:7240/api/PatientFeedback/CreateFeedback?pid=${pid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating feedback:', error);
    throw error;
  }
};
