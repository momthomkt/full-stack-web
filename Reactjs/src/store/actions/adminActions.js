import actionTypes from './actionTypes';
import { getAllCodeService, createNewUserService, getAllUsers, deleteUser, editUserService, getTopDoctorsService } from '../../services/userService';
import { toast } from "react-toastify";
import { LANGUAGES } from '../../utils';
// export const fetchAllCodeStart = () => ({
//     type: actionTypes.FETCH_AllCode_START
// })
export const fetchAllCodeStart = (typeInput) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_CODE_START })
            let res = await getAllCodeService(typeInput);
            if (res && res.errCode === 0) {
                dispatch(fetchAllCodeSuccess(typeInput, res.data));
            }
            else {
                dispatch(fetchAllCodeFailed());
            }
        } catch (e) {
            dispatch(fetchAllCodeFailed());
            console.log('fetchAllCodeStart error', e)
        }
    }
}

export const fetchAllCodeSuccess = (typeInput, data) => ({
    type: actionTypes.FETCH_ALL_CODE_SUCCESS,
    typeInput: typeInput,
    data: data
})

export const fetchAllCodeFailed = () => ({
    type: actionTypes.FETCH_ALL_CODE_FAILED
})

export const createNewUser = (userData) => {
    return async (dispatch, getState) => {
        try {
            //dispatch({ type: actionTypes.FETCH_ALL_CODE_START })
            let res = await createNewUserService(userData);
            if (res && res.errCode === 0) {
                toast.success("Create a new user succeed");
                dispatch(saveUserSuccess());
            }
            else {
                dispatch(saveUserFailed());
            }
        } catch (e) {
            dispatch(saveUserFailed());
            console.log('Save user failed ', e)
        }
    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.SAVE_USER_SUCCESS
})

export const saveUserFailed = () => ({
    type: actionTypes.SAVE_USER_FAILED
})

export const fetchAllUserStart = () => {
    return async (dispatch, getState) => {
        try {
            //dispatch({ type: actionTypes.FETCH_ALL_CODE_START })
            let data = await getAllUsers('All');
            if (data && data.errCode === 0) {
                dispatch(fetchAllUsersSuccess(data.users.reverse()));
            }
            else {
                dispatch(fetchAllUsersFailed());
            }
        } catch (e) {
            dispatch(fetchAllUsersFailed());
            console.log('Get all user failed ', e)
        }
    }
}

export const fetchAllUsersSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: data
})

export const fetchAllUsersFailed = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED
})

export const deleteUserStart = (id, language) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUser(id);
            if (res && res.errCode === 0) {
                if (language === LANGUAGES.EN) {
                    toast.success("Delete user succeed");
                }
                else {
                    toast.success("Xóa người dùng thành công");
                }
                dispatch(deleteUserSuccess());
            }
            else {
                dispatch(deleteUserFailed());
            }
        } catch (e) {
            dispatch(deleteUserFailed());
            console.log('Delete user failed ', e)
        }
    }
}

export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USERS_SUCCESS
})

export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USERS_FAILED
})

export const editUserStart = (userData, language) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(userData);
            if (res && res.errCode === 0) {
                dispatch(editUserSuccess());
                dispatch(fetchAllUserStart());
                if (language === LANGUAGES.EN) {
                    toast.success("Edit user succeed");
                }
                else {
                    toast.success("Sửa người dùng thành công");
                }
            }
            else {
                dispatch(editUserFailed());
            }
        } catch (e) {
            dispatch(editUserFailed());
            console.log('Edit user failed ', e)
        }
    }
}

export const editUserSuccess = (userData) => ({
    type: actionTypes.EDIT_USERS_SUCCESS,
    userData: userData
})

export const editUserFailed = () => ({
    type: actionTypes.EDIT_USERS_FAILED
})

export const fetchTopDoctors = (limit) => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopDoctorsService(limit);
            if (res && res.errCode === 0) {
                dispatch(fetchTopDoctorsSuccess(res.data));
            }
            else {
                dispatch(fetchTopDoctorsFailed());
            }
        } catch (e) {
            dispatch(fetchTopDoctorsFailed());
            console.log('Get top doctors error', e)
        }
    }
}

export const fetchTopDoctorsSuccess = (topDoctors) => ({
    type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
    topDoctors: topDoctors
})

export const fetchTopDoctorsFailed = () => ({
    type: actionTypes.FETCH_TOP_DOCTORS_FAILED
})