import actionTypes from '../actions/actionTypes';

const initialState = {
    genders: [],
    roles: [],
    positions: [],
    isLoading_gender: false,
    isLoading_role: false,
    isLoading_position: false,
    users: []
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

        // case actionTypes.EDIT_USERS_SUCCESS:
        //     state.users = [];
        //     return {
        //         ...state
        //     }

        // case actionTypes.EDIT_USERS_FAILED:
        //     state.users = [];
        //     return {
        //         ...state
        //     }

        default:
            return state;
    }
}

export default adminReducer;