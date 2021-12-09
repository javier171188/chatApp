import * as type from "../types";
import modalsState from "../state/modalsState";

const modals = (state = modalsState, action) => {
    switch (action.type) {
        case type.SET_ADDING_USER:
            return {
                ...state,
                addingUser: action.payload,
            };
        case type.SET_DRAWING_AREA_ON:
            return {
                ...state,
                drawingAreaOn: action.payload,
            };
        default:
            return state;
    }
}

export default modals;