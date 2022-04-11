import * as type from "../types";
import conferenceState from "../state/conferenceState";

const conferenceReducer = (state = conferenceState, action) => {
  switch (action.type) {
    case type.UPDATE_STREAMS:
      return {
        ...state,
        streams: action.payload,
      };
    case type.SET_RED5PRO_CONFIG:
      return {
        ...state,
        configuration: action.payload,
      };
    default:
      return state;
  }
};

export default conferenceReducer;
