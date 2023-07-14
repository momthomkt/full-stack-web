import actionTypes from '../actions/actionTypes';

const initialState = {
    genders: [],
    roles: [],
    positions: [],
    isLoading_gender: false,
    isLoading_role: false,
    isLoading_position: false
}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_ALL_CODE_START:
            console.log('fetch all code start', action);
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
            //console.log('fetch all code success: ', state);
            return {
                ...state
            }
        case actionTypes.FETCH_ALL_CODE_FAILED:
            state['isLoading_' + action.typeInput] = false;
            state[action.typeInput + 's'] = [];
            return {
                ...state
            }
        default:
            return state;
    }
}

export default adminReducer;