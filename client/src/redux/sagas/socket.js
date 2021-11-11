'use strict';
import { takeEvery, put } from 'redux-saga/effects';
import * as type from '../types'
import store from '../store';
import { connect } from "react-redux";
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

socket.on('updateMessages', ({ participants, returnedMessages, roomId }) => {
    console.log('I realize');
    updateLastRoom(roomId, returnedMessages, participants);
});

socket.on('newRoom', ({ participants, roomId }) => {
    subscribeRoom(participants, roomId)
});

socket.on('userAccepted', ({ acceptedId }) => {
    let _id = sessionStorage.getItem('_id');
    if (_id === acceptedId) {
        put({ type: type.SET_USER_STATE });
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


    yield put({ type: type.SET_USER_STATE, payload: data.data });



    yield socket.emit('userAccepted', { acceptedId: searchUser._id }, () => {
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
    yield takeEvery(type.SEND_MESSAGE, (data) => sendMessageFromSaga(data))
}

module.exports = { openChatSaga, createNewRoomSaga, addUserSaga, sendMessageSaga };