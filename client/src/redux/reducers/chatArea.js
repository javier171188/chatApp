import * as type from "../types";
import chatAreaState from "../state/chatAreaState";

const chatAreaReducer = (state = chatAreaState, action) => {
    switch (action.type) {
        case type.SET_CURRENT_USER_CHAT:
            return {
                ...state,
                currentUserChat: action.payload,
            };
        case type.SET_CURRENT_ROOM_ID:
            return {
                ...state,
                currentRoomId: action.data,
            };
        case type.SET_CURRENT_MESSAGES:
            return {
                ...state,
                currentMessages: action.data,
            };
        case type.SET_CURRENT_ROOM_NAME:
            return {
                ...state,
                currentRoomName: action.data,
            };
        case type.SET_CURRENT_USERS:
            return {
                ...state,
                currentUsers: action.payload,
            };
        default:
            return state;
    }
}

export default chatAreaReducer;