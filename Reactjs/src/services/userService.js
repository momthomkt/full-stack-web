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

// export { handleLoginApi, getAllUsers }; 