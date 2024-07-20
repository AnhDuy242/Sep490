export const fetchMedicalNotebooksByPatientId = async (patientId) => {
    try {
        const response = await fetch(`https://localhost:7240/api/PatientMedicalNoteBook/GetMedicalNotebookByPatientId?pid=${patientId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Console log để xem dữ liệu trả về từ API
        return Array.isArray(data.$values) ? data.$values : [];
    } catch (error) {
        console.error('Error fetching data: ', error);
        throw error; // Rethrow the error to handle it in the component
    }
};
