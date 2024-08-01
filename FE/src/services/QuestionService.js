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

// bác sĩ trả lời câu hỏi
export async function answerQuestion(qid, answer, docId) {
    const url = `https://localhost:7240/api/DoctorQuestion/AnswerQuestion?qid=${qid}&answer=${encodeURIComponent(answer)}&docId=${docId}`;
  
    try {
        const response = await fetch(url, {
            method: 'POST', // hoặc 'PUT' nếu API yêu cầu
            headers: {
                'Content-Type': 'application/json',
            },
            // Không cần body nếu API chỉ sử dụng query parameters
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

//lấy department theo bác sĩ
export const fetchDepartments = async (docId) => {
  try {
      const response = await fetch(`https://localhost:7240/api/DoctorQuestion/GetDepartment?docid=${docId}`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Fetch error:', error);
      return null;
  }
};

//lấy câu hỏi theo id patient
// Định nghĩa hàm fetch
export const getPatientQuestions = async (patientId) => {
  try {
    const response = await fetch(`https://localhost:7240/api/PatientQuestionGetQuestionByPatientId?patientId=${patientId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching patient questions: ${response.statusText}`);
    }

    const data = await response.json();
    return data.$values;
  } catch (error) {
    console.error("Error fetching patient questions:", error);
    throw error;
  }
};
//Chỉnh sửa câu hỏi
// services/QuestionService.js
export const editPatientQuestion = async (questionId, updatedQuestion) => {
  try {
    const response = await fetch(`https://localhost:7240/api/PatientQuestionUpdateQuestion?pid=${questionId}&question=${encodeURIComponent(updatedQuestion)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error editing patient question: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error editing patient question:", error);
    throw error;
  }
};

