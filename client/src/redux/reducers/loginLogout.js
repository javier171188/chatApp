import * as type from "../types";
import loginLogoutState from "../state/loginLogoutState";

const loginLogout = (state = loginLogoutState, action) => {
    switch (action.type) {
        case type.SET_ERROR:
            return {
                ...state,
                errorMessages: action.payload,
            };
        case type.SET_AUTH:
            return {
                ...state,
                isAuth: action.payload,
            };
        default:
            return state;
    }
}

export default loginLogout;