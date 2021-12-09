import * as type from "../types";
import user from "../state/userState";

const userState = (state = user, action) => {
    switch (action.type) {
        case type.SET_USER_STATE:
            return action.payload;
        default:
            return state;
    }
}

export default userState;