import actionTypes from './actionTypes';
import { getAllCodeService } from '../../services/userService';
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