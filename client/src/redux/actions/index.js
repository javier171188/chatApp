'use strict';
import * as type from '../types';

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
    payload
})

export const setSearchUser = (payload) => ({
    type: type.SET_SEARCH_USER,
    payload
})

export const setGroupRoom = (payload) => ({
    type: type.SET_GROUP_ROOM,
    payload
})

export const setCurrentUserChat = (payload) => ({
    type: type.SET_CURRENT_USER_CHAT,
    payload
})

export const socketGetRoom = (payload) => ({
    type: type.SOCKET_GET_ROOM,
    payload
})

export const setCurrentRoomId = (payload) => ({
    type: type.SET_CURRENT_ROOM_ID,
    payload
})

export const setCurrentMessages = (payload) => ({
    type: type.SET_CURRENT_MESSAGES,
    payload
})

export const setCurrentRoomName = (payload) => ({
    type: type.SET_CURRENT_ROOM_NAME,
    payload
})

export const setUserStatus = (userStatus) => ({
    type: type.SET_USER_STATE,
    userStatus
})

export const setContactStatus = (status) => ({
    type: type.SET_CONTACT_STATUS,
    status
})

export const socketCreateNewRoom = (payload) => ({
    type: type.CREATE_NEW_ROOM,
    payload
})

export const changeLanguageAction = (payload) => ({
    type: type.CHANGE_LANGUAGE,
    payload
})