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
        case type.SET_USER_STATE:
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
        case type.SET_GROUP_ROOM:
            return {
                ...state,
                groupRoom: action.payload
            }
        case type.SET_CURRENT_USER_CHAT:
            return {
                ...state,
                currentUserChat: action.payload
            }
        case type.SET_CURRENT_ROOM_ID:
            return {
                ...state,
                currentRoomId: action.data
            }
        case type.SET_CURRENT_MESSAGES:
            return {
                ...state,
                currentMessages: action.data
            }
        case type.SET_CURRENT_ROOM_NAME:
            return {
                ...state,
                currentRoomName: action.data
            }
        case type.SET_CONTACT_STATUS:
            return {
                ...state,
                contactStatus: action.payload
            }
        default:
            return state;
    }
}

export default reducer;