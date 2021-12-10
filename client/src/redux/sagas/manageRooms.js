import * as type from "../types";
import socket from './socket';
import store from "../store";
import { takeEvery } from "redux-saga/effects";
import { request } from "graphql-request";


const { USER_PATH } = process.env;

const action = ({ type, data, payload }) => store.dispatch({
    type,
    data,
    payload,
});

function* createNewRoom(data) {
    const { roomName, participants } = data.payload;
    socket.emit("newRoom", { roomName, participants }, async (roomId) => {
        const token = sessionStorage.getItem("token");

        const mutation = `
          mutation createNewRoomGQL($participants:[RoomParticipant]){
              createNewRoom(token: "${token}", roomName: "${roomName}",  participants:$participants, roomId:"${roomId}", newMsgs:true )
                             
          }`;
        await request(`${USER_PATH}/api`, mutation, { participants });
        socket.emit("updateRooms", { participants, roomId }, () => {
            window.location.href = "/chat/";
        });
    });
}
function* createNewRoomSaga() {
    yield takeEvery(type.CREATE_NEW_ROOM, (data) => createNewRoom(data));
}

function* subscribeRoomsFS(data) {
    const userState = data.payload;
    userState.contacts.forEach((c) => {
        socket.emit("joinPersonal", { current: userState._id, receiver: c._id }, ({ _id, lastMessages }) => {
        });
    });

    userState.conversations.forEach((c) => {
        socket.emit("joinGroup", { roomId: c.roomId });
    });
}
function* subscribeRoomsSaga() {
    yield takeEvery(type.SUBSCRIBE_ROOMS, (data) => subscribeRoomsFS(data));
}

function* addUserToRoomFS(roomId) {
    socket.emit("getRoom", { roomId: roomId.payload }, ({ participants }) => {
        action({
            type: type.SET_CURRENT_USERS,
            payload: participants,
        });
    });
    action({
        type: type.SET_ADDING_USER,
        payload: true,
    });
}
function* addUserToRoomSaga() {
    yield takeEvery(type.ADD_USER_TO_ROOM, (data) => addUserToRoomFS(data));
}

module.exports = {
    addUserToRoomSaga,
    createNewRoomSaga,
    subscribeRoomsSaga,
}