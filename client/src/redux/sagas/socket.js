'use strict';
import { takeEvery } from 'redux-saga/effects';
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

socket.on('updateMessages', ({ participants, returnedMessages, roomId }) => {
    updateLastRoom(roomId, returnedMessages, participants);
});

socket.on('newRoom', ({ participants, roomId }) => {
    subscribeRoom(participants, roomId)
});

socket.on('userAccepted', ({ acceptedId }) => {
    checkForUpdates(acceptedId);
});

function* openOneToOneChat(data) {
    const { current, receiver, userState, contactClasses } = data.payload.users;
    socket.emit('getRoom', { current, receiver }, ({ _id: _idRoom, lastMessages, participants }) => {
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
        //setCurrentRoomName(newNameObj[0].userName);

        action({
            type: type.SET_CURRENT_ROOM_NAME,
            data: newNameObj[0].userName
        })

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

function* openOneToOneChatSaga() {
    yield takeEvery(type.SOCKET_GET_ROOM, (data) => openOneToOneChat(data));
}

module.exports = { openOneToOneChatSaga };