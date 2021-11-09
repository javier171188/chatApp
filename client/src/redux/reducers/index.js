'use strict';
import * as type from '../types';


const reducer = (state, action) => {
    switch (action.type) {
        case type.SET_ERROR:
            return {
                ...state,
                errorMessages: action.payload
            }
        case type.SET_AUTH:
            return {
                ...state,
                isAuth: action.payload
            }
        case type.SET_USER:
            return {
                ...state,
                userState: action.payload
            }
        case type.SET_SEARCH_MESSAGE:
            return {
                ...state,
                searchMessage: action.payload
            }
        case type.SET_SEARCH_USER:
            return {
                ...state,
                searchUser: action.payload
            }
        default:
            return state;
    }
}

export default reducer;