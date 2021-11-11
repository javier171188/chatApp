'use strict';

const initialState = {
    errorMessages: [],
    isAuth: sessionStorage.getItem('token'),
    userState: {
        contacts: [],
        email: "",
        hasAvatar: false,
        userName: "",
        _id: "",
        conversations: []
    },
    currentMessages: [],
    currentRoomId: '',
    contactStatus: '',
    addingUser: false,
    drawingAreaOn: false,
    searchMessage: 'InitialMessage',
    searchUser: null,
    groupRoom: false,
    currentUserChat: '',
    currentRoomName: '',
    lastRoomChanged: ''
};

export default initialState;
