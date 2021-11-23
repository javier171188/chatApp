'use strict';
import { takeEvery, put } from 'redux-saga/effects';
import * as type from '../types'
import store from '../store';
import socketIOClient from 'socket.io-client';
import { request } from 'graphql-request';

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
    try {
        const state = store.getState();
        let userState = state.userState;
        let participantIds = participants.map(p => p._id);
        if (participantIds.includes(userState._id)) {

            let token = sessionStorage.getItem('token');
            let email = JSON.parse(sessionStorage.getItem('email'));

            let query = `query{getUser(email:"${email}", token:"${token}", selfUser:true) {
                _id
                userName
                email
                hasAvatar
                language
                        contacts{
                  email
                  newMsgs
                  status
                  userName
                  _id
                }
                        conversations{
                  newMsgs
                  participants{
                                        joinDate
                      userName
                      _id
                  }
                  roomId
                  roomName
                }
            }
               }`

            const userGQL = await request(USER_PATH + '/api', query);
            const user = userGQL.getUser;
            action({
                type: type.SET_USER_STATE,
                payload: user
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
        let params;
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
            params = {
                senderId: receiver,
                receiver: { _id: userState._id, individualRoom: true },
                newStatus: false,
                roomId: _idRoom
            }
        } else {
            params = {
                senderId: userState._id,
                receiver: { _id: userState._id, individualRoom: false },
                newStatus: false,
                roomId
            }
        }

        let newUserState = { ...userState };
        newUserState.contacts.forEach(c => {
            if (c._id === receiver) {
                c.newMsgs = false;
            }
        });

        newUserState.conversations.forEach(c => {
            if (c.roomId === roomId) {
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
        let token = sessionStorage.getItem('token')
        let conf = {
            headers: {
                'Authorization': 'Bearer ' + token
            },
            params
        }

        let mutation = `
        mutation updateUserGQL($receiver:UpdatedUser){
            updateUser(token: "${token}", senderId: "${params.senderId}", receiver:$receiver, newStatus:${params.newStatus}, roomId:"${params.roomId}" )
            }`
        request(USER_PATH + '/api', mutation, { receiver: params.receiver });

    });
}
function* openChatSaga() {
    yield takeEvery(type.SOCKET_GET_ROOM, (data) => openChat(data));
}

function* createNewRoom(data) {
    let { roomName, participants } = data.payload;
    socket.emit('newRoom', { roomName, participants }, async (roomId) => {
        let token = sessionStorage.getItem('token');

        let mutation = `
        mutation createNewRoomGQL($participants:[RoomParticipant]){
            createNewRoom(token: "${token}", roomName: "${roomName}",  participants:$participants, roomId:"${roomId}", newMsgs:true )
                           
        }`
        await request(USER_PATH + '/api', mutation, { participants });
        socket.emit('updateRooms', { participants, roomId }, () => {
            window.location.href = '/chat/';
        })
    });
}
function* createNewRoomSaga() {
    yield takeEvery(type.CREATE_NEW_ROOM, (data) => createNewRoom(data))
}

function* addUser(payload) {
    const { currentId, searchUser } = payload.payload;
    let token = window.sessionStorage.getItem('token');

    let mutation = `
    mutation addUserGql($searchUser:AddedUser){
        addUser(token: "${token}", currentId: "${currentId}", searchUser:$searchUser ){
            _id
            userName
            email
            hasAvatar
            language
    				contacts{
              email
              newMsgs
              status
              userName
              _id
            }
    				conversations{
              newMsgs
              participants{
									joinDate
                  userName
                  _id
              }
              roomId
              roomName
            }
        }
    }`
    const dataGQL = yield request(USER_PATH + '/api', mutation, { searchUser });
    const data = dataGQL.addUser;

    action({ type: type.SET_USER_STATE, payload: data });
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
                notCurrentParticipants = notCurrentParticipants.map(p => p._id);
            }

            let token = sessionStorage.getItem('token');

            notCurrentParticipants.forEach(p => {
                let receiver = { _id: p, individualRoom: true }
                let mutation = `
                mutation updateUserGQL($receiver:UpdatedUser) {
                    updateUser(token: "${token}", senderId: "${userState._id}", receiver:$receiver, newStatus:true, roomId:"${currentRoomId}" )
                }`

                request(USER_PATH + '/api', mutation, { receiver });
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

    socket.emit('getRoom', { roomId: roomId.payload }, ({ participants }) => {
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
    const state = store.getState();
    const { roomId, newUsers } = data.payload;
    let { currentRoomName, currentRoomId } = state;

    socket.emit('addUsers', { roomId, newUsers }, async (participants) => {
        try {
            const token = sessionStorage.getItem('token');
            const newRoomParams = { roomName: currentRoomName, participants, roomId: currentRoomId, newMsgs: true };
            const mutation = `
                mutation addUsersToRoom($newRoomParams:NewRoomParams){
                    newRoom(token:"${token}",
                    newRoomParams: $newRoomParams)
                }
                `
            let data = { newRoomParams };
            await request(USER_PATH + '/api', mutation, data);
            socket.emit('updateRooms', { participants, currentRoomName }, () => {
            })
        } catch (e) {
            console.error(e);
        }
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
    try {
        const participants = data.payload.participants;
        const token = sessionStorage.getItem('token');

        const mutation = `
            mutation{
                confirmAdding(token: "${token}", participants: ["${participants[0]}", "${participants[1]}"] )
            }`

        const state = store.getState();
        const currentUserChat = state.currentUserChat;

        yield request(USER_PATH + '/api', mutation);

        socket.emit('userAccepted', { acceptedId: currentUserChat }, () => {
        });
        action({
            type: type.GET_USER
        })
        action({
            type: type.SET_CONTACT_STATUS,
            status: 'accepted'
        })

    } catch (e) {
        console.error(e);
    }
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