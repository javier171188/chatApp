import * as type from "../types";
import searchAreaState from "../state/searchAreaState";

const searchArea = (state = searchAreaState, action) => {
    switch (action.type) {
        case type.SET_SEARCH_MESSAGE:
            return {
                ...state,
                searchMessage: action.payload,
            };
        case type.SET_SEARCH_USER:
            return {
                ...state,
                searchUser: action.payload,
            };
        default:
            return state;
    }
}

export default searchArea;