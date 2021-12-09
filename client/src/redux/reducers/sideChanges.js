import * as type from "../types";
import sideChangeState from "../state/sideChangesState";

const sideChanges = (state = sideChangeState, action) => {
    switch (action.type) {
        case type.SET_GROUP_ROOM:
            return {
                ...state,
                groupRoom: action.payload,
            };

        case type.SET_CONTACT_STATUS:
            return {
                ...state,
                contactStatus: action.payload,
            };
        case type.SET_LAST_ROOM_CHANGED:
            return {
                ...state,
                lastRoomChanged: action.payload,
            };
        default:
            return state;
    }
}

export default sideChanges;