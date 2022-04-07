import * as type from "../types";

export const setError = (payload) => ({
  type: type.SET_ERROR,
  payload,
});

export const setAuth = (payload) => ({
  type: type.SET_AUTH,
  payload,
});

export const setSearchMessage = (payload) => ({
  type: type.SET_SEARCH_MESSAGE,
  payload,
});

export const setSearchUser = (payload) => ({
  type: type.SET_SEARCH_USER,
  payload,
});

export const setGroupRoom = (payload) => ({
  type: type.SET_GROUP_ROOM,
  payload,
});

export const setCurrentUserChat = (payload) => ({
  type: type.SET_CURRENT_USER_CHAT,
  payload,
});

export const socketGetRoom = (payload) => ({
  type: type.SOCKET_GET_ROOM,
  payload,
});

export const setCurrentRoomId = (payload) => ({
  type: type.SET_CURRENT_ROOM_ID,
  payload,
});

export const setCurrentMessages = (payload) => ({
  type: type.SET_CURRENT_MESSAGES,
  payload,
});

export const setCurrentRoomName = (payload) => ({
  type: type.SET_CURRENT_ROOM_NAME,
  payload,
});

export const setUserState = (payload) => ({
  type: type.SET_USER_STATE,
  payload,
});

export const setContactStatus = (status) => ({
  type: type.SET_CONTACT_STATUS,
  status,
});

export const socketCreateNewRoom = (payload) => ({
  type: type.CREATE_NEW_ROOM,
  payload,
});

export const changeLanguageAction = (payload) => ({
  type: type.CHANGE_LANGUAGE,
  payload,
});

export const addContactAction = (payload) => ({
  type: type.ADD_CONTACT,
  payload,
});

export const sendMessageAction = (payload) => ({
  type: type.SEND_MESSAGE,
  payload,
});

export const subscribeRoomsAction = (payload) => ({
  type: type.SUBSCRIBE_ROOMS,
  payload,
});

export const setLastRoomChanged = (payload) => ({
  type: type.SET_LAST_ROOM_CHANGED,
  payload,
});

export const addUserToRoomAction = (payload) => ({
  type: type.ADD_USER_TO_ROOM,
  payload,
});

export const setCurrentUsers = (payload) => ({
  type: type.SET_CURRENT_USERS,
  payload,
});

export const setAddingUser = (payload) => ({
  type: type.SET_ADDING_USER,
  payload,
});

export const addUsersAction = (payload) => ({
  type: type.ADD_USERS,
  payload,
});

export const setDrawingAreaOn = (payload) => ({
  type: type.SET_DRAWING_AREA_ON,
  payload,
});

export const acceptRequestAction = (payload) => ({
  type: type.ACCEPT_REQUEST,
  payload,
});

export const registerAction = (payload) => ({
  type: type.REGISTER,
  payload,
});

export const startCallAction = (payload) => {
  return {
    type: type.START_CALL,
    payload,
  };
};
