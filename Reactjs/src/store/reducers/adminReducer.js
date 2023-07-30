import actionTypes from '../actions/actionTypes';

const initialState = {
    genders: [],
    roles: [],
    positions: [],
    isLoading_gender: false,
    isLoading_role: false,
    isLoading_position: false,
    users: [],
    topDoctors: [],
    allDoctors: [],
    //
    allScheduleTime: [],
    //
    prices: [],
    payments: [],
    provinces: [],
    isLoading_price: false,
    isLoading_payment: false,
    isLoading_province: false,

}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_ALL_CODE_START:
            state['isLoading_' + action.typeInput] = true;
            return {
                ...state
            }
        case actionTypes.FETCH_ALL_CODE_SUCCESS:
            // let state = { ...state };
            // state[action.typeInput + 's'] = action.data;
            // state['isLoading_' + action.typeInput] = true;
            // //console.log('fetch all code success: ', state);
            // return {
            //     ...state
            // }
            state[action.typeInput + 's'] = action.data;
            state['isLoading_' + action.typeInput] = false;
            return {
                ...state
            }
        case actionTypes.FETCH_ALL_CODE_FAILED:
            state['isLoading_' + action.typeInput] = false;
            state[action.typeInput + 's'] = [];
            return {
                ...state
            }
        case actionTypes.FETCH_ALL_USERS_SUCCESS:
            state.users = action.users;
            return {
                ...state
            }

        case actionTypes.FETCH_ALL_USERS_FAILED:
            state.users = [];
            return {
                ...state
            }

        case actionTypes.FETCH_TOP_DOCTORS_SUCCESS:
            state.topDoctors = action.topDoctors;
            return {
                ...state
            }

        case actionTypes.FETCH_TOP_DOCTORS_FAILED:
            state.topDoctors = [];
            return {
                ...state
            }

        case actionTypes.FETCH_ALL_DOCTORS_SUCCESS:
            state.allDoctors = action.allDoctors;
            return {
                ...state
            }

        case actionTypes.FETCH_ALL_DOCTORS_FAILED:
            state.allDoctors = [];
            return {
                ...state
            }

        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS:
            state.allScheduleTime = action.dataTime;
            return {
                ...state
            }

        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED:
            state.allScheduleTime = [];
            return {
                ...state
            }

        case actionTypes.ADD_DETAIL_DOCTORS_SUCCESS:
            return {
                ...state
            }

        default:
            return state;
    }
}

export default adminReducer;