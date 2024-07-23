export async function createPatientQuestion(pid, question1, depId) {
    const url = `https://localhost:7240/api/PatientQuestionCreateQuestion?pid=${pid}&question=${question1}&depId=${depId}`;
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  //lấy ra list danh sách department 
const listDepart = 'https://localhost:7240/api/PatientAppointment/GetListDepartment';

export const getListDepartment = async () => {
  try {
    const response = await fetch(listDepart, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers if needed
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json(); // Parse JSON response
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error; // Rethrow the error so caller can handle it
  }
};

// lấy danh sách câu hỏi theo department
// export const fetchQuestionsByDepId = async (depId) => {
//     const API_URL = `https://localhost:7240/api/PatientQuestion/GetQuestionByDepId?depId=${depId}`;
//     try {
//         const response = await fetch(API_URL);
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         throw error;
//     }
// };


export const fetchQuestionsByDepId = async (depip) => {
    try {
        const url = `https://localhost:7240/api/PatientQuestionGetQuestionByDepId?depip=${depip}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text(); // Đọc lỗi từ phản hồi
            console.error('Response error:', errorText);
            throw new Error('Network response was not ok: ' + errorText);
        }

        const data = await response.json();
        console.log('Data received:', data);
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};
