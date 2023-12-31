import axios from '../axios';
export const handleLoginApi = (userEmail, userPassword) => {
    return axios.post('/api/login', { email: userEmail, password: userPassword });
}

export const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`)
}

export const createNewUserService = (data) => {
    return axios.post('/api/create-new-user', data);
}

export const deleteUser = (userId) => {
    return axios.delete('/api/delete-user', {
        data: {
            id: userId
        }
    });
}
export const editUserService = (userData) => {
    return axios.put('/api/edit-user', userData);
}

export const getAllCodeService = (inputData) => {
    return axios.get(`/api/allcode?type=${inputData}`);
}

export const getTopDoctorsService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`);
}

export const getAllDoctorsService = () => {
    return axios.get(`/api/get-all-doctors`);
}

export const addDetailDoctorService = (data) => {
    return axios.post(`/api/add-doctor-info`, data);
}

export const getDetailDoctorService = (id) => {
    return axios.get(`/api/get-detail-doctor?id=${id}`);
}

export const getDetailManageDoctor = (id) => {
    return axios.get(`/api/detail-manage-doctor?id=${id}`);
}

export const updateDetailDoctorInfoService = (data) => {
    return axios.put('/api/update-doctor-info', data);
}

export const saveBulkScheduleDoctor = (data) => {
    return axios.post('/api/bulk-create-schedule', data);
}

export const getScheduleDoctorByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`);
}

export const getExtraDoctorInfoById = (doctorId) => {
    return axios.get(`/api/get-extra-doctor-info-by-id?id=${doctorId}`);
}

export const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?id=${doctorId}`);
}

export const BookAppointmentService = (data) => {
    return axios.post('/api/patient-book-appointment', data);
}

export const verifyBookAppointment = (data) => {
    return axios.post('/api/verify-book-appointment', data);
}

export const createSpecialty = (data) => {
    return axios.post('/api/create-specialty', data);
}

export const getAllSpecialty = () => {
    return axios.get('/api/get-all-specialty');
}

export const getOneSpecialty = (id) => {
    return axios.get(`/api/get-one-specialty?id=${id}`);
}

export const createClinic = (data) => {
    return axios.post('/api/create-clinic', data);
}

export const getAllClinic = () => {
    return axios.get('/api/get-all-clinic');
}

export const getOneClinic = (id) => {
    return axios.get(`/api/get-one-clinic?id=${id}`);
}

export const getPatientForDoctor = (doctorId, date) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${doctorId}&date=${date}`);
}

export const sendPrescription = (data) => {
    return axios.post('/api/send-prescription', data);
}

// export const getPatientForDoctor = (data) => {
//     return axios.post(`/api/get-list-patient-for-doctor`, data);
// }
// export { handleLoginApi, getAllUsers }; 