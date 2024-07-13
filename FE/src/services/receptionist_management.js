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