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

export const updateDetailDoctorInfoService = (data) => {
    return axios.put('/api/update-doctor-info', data);
}
// export { handleLoginApi, getAllUsers }; 