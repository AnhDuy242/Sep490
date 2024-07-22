//Hàm gọi API tạo tài khoản bệnh nhân
export const createPatient = async (patientData) => {
    const url = 'https://localhost:7240/api/CreatePatient/CreatePatient';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patientData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Patient created successfully:', result);
        return result;
    } catch (error) {
        console.error('Error creating patient:', error);
        throw error;
    }
};
//hàm get tài khoản bệnh nhân
export const getAllPatients = async () => {
    const url = 'https://localhost:7240/api/CreatePatient/TestGetAllPatient';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Fetched patients successfully:', result);

        // Kiểm tra và trả về đúng định dạng
        return result.$values ? result.$values : [];
    } catch (error) {
        console.error('Error fetching patients:', error);
        return [];
    }
};
//hàm get notebooks bệnh nhân
export const getMedicalNotebooks = async () => {
    const url = 'https://localhost:7240/api/ReceptionistMedicalNotebook/GetAllMedicalNoteBook';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Fetched patients successfully:', result);

        // Kiểm tra và trả về đúng định dạng
        return result.$values ? result.$values : [];
    } catch (error) {
        console.error('Error fetching patients:', error);
        return [];
    }
};
// export const getMedicalNotebooks = async () => {
//     const response = await fetch('https://your-api-endpoint.com/api/medicalNotebooks');
//     if (!response.ok) {
//         throw new Error('Failed to fetch medical notebooks');
//     }
//     const data = await response.json();
//     return data.$values; // Trả về mảng $values
// };