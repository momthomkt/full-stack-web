const actionTypes = Object.freeze({
    //app
    APP_START_UP_COMPLETE: 'APP_START_UP_COMPLETE',
    SET_CONTENT_OF_CONFIRM_MODAL: 'SET_CONTENT_OF_CONFIRM_MODAL',
    CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',

    //admin
    FETCH_ALL_CODE_START: 'FETCH_ALL_CODE_START',
    FETCH_ALL_CODE_SUCCESS: 'FETCH_ALL_CODE_SUCCESS',
    FETCH_ALL_CODE_FAILED: 'FETCH_ALL_CODE_FAILED',

    SAVE_USER_SUCCESS: 'SAVE_USER_SUCCESS',
    SAVE_USER_FAILED: 'SAVE_USER_FAILED',

    FETCH_ALL_USERS_SUCCESS: 'FETCH_ALL_USERS_SUCCESS',
    FETCH_ALL_USERS_FAILED: 'FETCH_ALL_USERS_FAILED',

    DELETE_USERS_SUCCESS: 'DELETE_USERS_SUCCESS',
    DELETE_USERS_FAILED: 'DELETE_USERS_FAILED',

    EDIT_USERS_SUCCESS: 'EDIT_USERS_SUCCESS',
    EDIT_USERS_FAILED: 'EDIT_USERS_FAILED',

    FETCH_TOP_DOCTORS_SUCCESS: 'FETCH_TOP_DOCTORS_SUCCESS',
    FETCH_TOP_DOCTORS_FAILED: 'FETCH_TOP_DOCTORS_FAILED',

    // ADMIN_LOGIN_SUCCESS: 'ADMIN_LOGIN_SUCCESS',
    // ADMIN_LOGIN_FAIL: 'ADMIN_LOGIN_FAIL',

    //user
    ADD_USER_SUCCESS: 'ADD_USER_SUCCESS',

    USER_LOGIN_SUCCESS: 'USER_LOGIN_SUCCESS',
    USER_LOGIN_FAIL: 'USER_LOGIN_FAIL',
    PROCESS_LOGOUT: 'PROCESS_LOGOUT',
})

export default actionTypes;