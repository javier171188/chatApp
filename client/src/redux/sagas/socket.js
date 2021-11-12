'use strict';
import { takeEvery, put } from 'redux-saga/effects';
import * as type from '../types'
import store from '../store';
import axios from 'axios';
import socketIOClient from 'socket.io-client';

let USER_PATH = process.env.USER_PATH;

const action = ({ type, data, payload }) => store.dispatch({
    type,
    data,
    payload
})


const socket = socketIOClient(process.env.SOCKET_ENDPOINT, {
    path: process.env.SOCKET_PATH
});


let updateLastRoom = function (roomId, returnedMessages, participants) {
    action({
        type: type.SET_LAST_ROOM_CHANGED,
        payload: roomId
    })
    const state = store.getState();
    const currentRoomId = state.currentRoomId;
    if (roomId === currentRoomId) {
        action({
            type: type.SET_CURRENT_MESSAGES,
            data: returnedMessages
        });
    } else {
        const userState = state.userState;
        let userWithNewMsgId = participants.filter(p => p !== userState._id)[0];
        let newState = { ...userState };
        newState.contacts.forEach(c => {
            if (c._id === userWithNewMsgId) {
                c.newMsgs = true;
            }
        });
        newState.conversations.forEach(c => {
            if (c.roomId === roomId) {
                c.newMsgs = true;
            }
        })
        action({
            type: type.SET_USER_STATE,
            payload: newState
        })
    }
}
socket.on('updateMessages', ({ participants, returnedMessages, roomId }) => {
    updateLastRoom(roomId, returnedMessages, participants);
});

socket.on('newRoom', async ({ participants, roomId }) => {
    //subscribeRoom(participants, roomId)
    try {
        const state = store.getState();
        let userState = state.userState;
        let participantIds = participants.map(p => p._id);
        if (participantIds.includes(userState._id)) {

            let conf = {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                },
                params: {
                    email: JSON.parse(sessionStorage.getItem('email')),
                    selfUser: true
                }
            }
            let user = await axios.get(USER_PATH + '/getUser', conf);
            //setUserState(user.data);
            action({
                type: type.SET_USER_STATE,
                payload: user.data
            })
            socket.emit('joinGroup', { roomId }, ({ _id, lastMessages }) => {
            });
        }
    } catch (e) {
        console.error(e);
    }
});

socket.on('userAccepted', ({ acceptedId }) => {
    let _id = sessionStorage.getItem('_id');
    if (_id === acceptedId) {
        action({
            type: type.GET_USER,
        });
    }
});

function* openChat(data) {
    const { current, receiver, userState, contactClasses, roomId } = data.payload.users;
    socket.emit('getRoom', { current, receiver, roomId }, ({ _id: _idRoom, lastMessages, participants, roomName }) => {
        action({
            type: type.SET_CURRENT_ROOM_ID,
            data: _idRoom
        })
        action({
            type: type.SET_CURRENT_MESSAGES,
            data: lastMessages
        })

        let participantId = participants.filter(p => p !== userState._id)[0];
        let newNameObj = userState.contacts.filter(c => (c._id === participantId));

        if (newNameObj[0]) {
            roomName = newNameObj[0].userName;
        }

        action({
            type: type.SET_CURRENT_ROOM_NAME,
            data: roomName
        })

        if (contactClasses) {
            if (contactClasses.includes('pending')) {
                action({
                    type: type.SET_CONTACT_STATUS,
                    payload: 'pending'
                })
                action({
                    type: type.SET_CURRENT_MESSAGES,
                    data: []
                })
                action({
                    type: type.SET_CURRENT_ROOM_ID,
                    data: '1'
                })
                return;
            } else if (contactClasses.includes('request')) {
                action({
                    type: type.SET_CONTACT_STATUS,
                    payload: 'request'
                })
                action({
                    type: type.SET_CURRENT_MESSAGES,
                    data: []
                })
                action({
                    type: type.SET_CURRENT_ROOM_ID,
                    data: '1'
                })
                return;
            }

        }

        let newUserState = { ...userState };
        newUserState.contacts.forEach(c => {
            if (c._id === receiver) {
                c.newMsgs = false;
            }
        });
        action({
            type: type.SET_USER_STATE,
            payload: newUserState
        })
        action({
            type: type.SET_CONTACT_STATUS,
            payload: 'accepted'
        })
        let conf = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            params: {
                senderId: receiver,
                receiver: userState._id,
                newStatus: false,
                roomId: _idRoom
            }
        }
        axios.post(USER_PATH + '/updateUser', conf).catch(e => console.log(e));
    });
}
function* openChatSaga() {
    yield takeEvery(type.SOCKET_GET_ROOM, (data) => openChat(data));
}

function* createNewRoom(data) {
    let { roomName, participants } = data.payload;
    socket.emit('newRoom', { roomName, participants }, (roomId) => {
        let conf = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
        }
        axios.post(USER_PATH + '/newRoom', { roomName, participants, roomId, newMsgs: true }, conf)
            .then(() => {
                socket.emit('updateRooms', { participants, roomId }, () => {
                    window.location.href = '/chat/';
                })
            })
            .catch(e => console.error(e));
    });
}
function* createNewRoomSaga() {
    yield takeEvery(type.CREATE_NEW_ROOM, (data) => createNewRoom(data))
}

function* addUser(payload) {
    const { currentId, searchUser } = payload.payload;
    const conf = {
        headers: {
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
        }
    };
    const data = yield axios.post(USER_PATH + '/addContactNoConf', {
        "logged": currentId,
        "searched": searchUser
    }, conf)

    console.log(data);
    action({ type: type.SET_USER_STATE, payload: data.data });



    socket.emit('userAccepted', { acceptedId: searchUser._id }, () => {
    });
}
function* addUserSaga() {
    yield takeEvery(type.ADD_CONTACT, (data) => addUser(data));
}

function* sendMessageFromSaga(data) {
    let { event, userState, currentRoomId, imageStr } = data.payload;
    var isImage;
    if (!imageStr) {
        event.preventDefault();
        //console.log(`Sended room id: ${currentRoomId}`);
        var message = event.target[0].value;
        event.target[0].value = '';
        isImage = false;
    } else {
        var message = imageStr;
        isImage = true;
    }

    if (message !== '') {
        let date = new Date();
        let dateStr = date.getTime().toString();

        let messageData = {
            sender: {
                _id: userState._id,
                userName: userState.userName
            },
            message,
            date: dateStr,
            roomId: currentRoomId,
            isImage
        };
        socket.emit('sendMessage', messageData, (participants) => {
            let notCurrentParticipants
            if (typeof participants[0] !== 'object') {
                notCurrentParticipants = participants.filter(p => p !== userState._id);
            } else {
                notCurrentParticipants = participants.filter(p => p._id !== userState._id);
            }

            let conf = {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                },
                params: {
                    senderId: userState._id,
                    receiver: '',
                    newStatus: true,
                    roomId: currentRoomId
                }
            }
            notCurrentParticipants.forEach(p => {
                conf.params.receiver = p;
                axios.post(USER_PATH + '/updateUser', conf).catch(e => console.log(e));
            })

        });
    }

}
function* sendMessageSaga() {
    yield takeEvery(type.SEND_MESSAGE, (data) => sendMessageFromSaga(data)
    );
}

function* subscribeRoomsFS(data) {
    let userState = data.payload;
    userState.contacts.forEach(c => {
        socket.emit('joinPersonal', { current: userState._id, receiver: c._id }, ({ _id, lastMessages }) => {
        });
    });

    userState.conversations.forEach(c => {
        socket.emit('joinGroup', { roomId: c.roomId }, ({ _id, lastMessages }) => {
        });
    });

}
function* subscribeRoomsSaga() {
    yield takeEvery(type.SUBSCRIBE_ROOMS, (data) => subscribeRoomsFS(data));
}

function* addUserToRoomFS(roomId) {
    socket.emit('getRoom', { roomId }, ({ participants }) => {
        action({
            type: type.SET_CURRENT_USERS,
            payload: participants
        })
    })
    action({
        type: type.SET_ADDING_USER,
        payload: true
    })
}
function* addUserToRoomSaga() {
    yield takeEvery(type.ADD_USER_TO_ROOM, (data) => addUserToRoomFS(data));
}

function* addUserSocket(data) {
    console.log(data);
    const { currentRoomId, newUsers } = data.payload;
    socket.emit('addUsers', { roomId: currentRoomId, newUsers }, (participants) => {
        let conf = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
        }
        axios.post(USER_PATH + '/newRoom', { roomName: currentRoomName, participants, roomId: currentRoomId, newMsgs: true }, conf)
            .then(() => {
                socket.emit('updateRooms', { participants, currentRoomName }, () => {
                })
            })
            .catch(e => console.log(e));
    });
    action({
        type: type.SET_ADDING_USER,
        payload: false
    })
}
function* addUserSocketSaga() {
    yield takeEvery(type.ADD_USERS, (data) => addUserSocket(data));
}

function* acceptRequestFS(data) {
    const participants = data.payload.participants;
    let conf = {
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
    }
    const state = store.getState();
    const currentUserChat = state.currentUserChat;
    axios.patch(USER_PATH + '/confirmAdding', { participants }, conf)
        .then(() => {
            socket.emit('userAccepted', { acceptedId: currentUserChat }, () => {
            });
            //getUserState();
            action({
                type: type.GET_USER
            })
        })
        .catch(e => console.error(e));
    //setCurrentRoomId('');
    //setContactStatus('accepted');
    action({
        type: type.SET_CONTACT_STATUS,
        status: 'accepted'
    })
}
function* acceptRequestSaga() {
    yield takeEvery(type.ACCEPT_REQUEST, (data) => acceptRequestFS(data));
}

module.exports = {
    openChatSaga,
    createNewRoomSaga,
    addUserSaga,
    sendMessageSaga,
    subscribeRoomsSaga,
    addUserToRoomSaga,
    addUserSocketSaga,
    acceptRequestSaga
};