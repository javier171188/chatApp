import * as type from "../types";
import socket from './socket';
import store from "../store";
import { request } from "graphql-request";
import { put, takeEvery } from "redux-saga/effects";
import { lookForUserGQL } from "../../graphql/queries";
import { addUserGql, addUsersToRoom, confirmAddingGql } from "../../graphql/mutations";


const { USER_PATH } = process.env;

const action = ({ type, data, payload }) => store.dispatch({
    type,
    data,
    payload,
});

function* lookForUser({ data }) {
    const { event } = data;
    try {
        const token = window.sessionStorage.getItem("token");
        const email = event.target[0].value;


        event.target[0].value = "";
        const userGQL = yield request(`${USER_PATH}/api`, lookForUserGQL, { email, token });
        const user = userGQL.getUser;

        user.newMsgs = false;

        yield put({ type: type.SET_SEARCH_USER, payload: user });
        yield put({ type: type.SET_SEARCH_MESSAGE, payload: "One user found: " });
    } catch (error) {
        yield put({
            type: type.SET_SEARCH_MESSAGE,
            payload: "No user was found, try a different e-mail address.",
        });
    }
}
function* lookForUserSaga() {
    yield takeEvery(type.LOOK_FOR_USER, (data) => lookForUser(data));
}

function* acceptRequestFS(data) {
    try {
        const { participants } = data.payload;
        const token = sessionStorage.getItem("token");


        const state = store.getState();
        const { currentUserChat } = state.chatArea;

        yield request(`${USER_PATH}/api`, confirmAddingGql, { token, participants });

        socket.emit("userAccepted", { acceptedId: currentUserChat }, () => {
        });
        action({
            type: type.GET_USER,
        });
        action({
            type: type.SET_CONTACT_STATUS,
            status: "accepted",
        });
    } catch (e) {
        console.error(e);
    }
}
function* acceptRequestSaga() {
    yield takeEvery(type.ACCEPT_REQUEST, (data) => acceptRequestFS(data));
}

function* addUserSocket(data) {
    const state = store.getState();
    const { roomId, newUsers } = data.payload;
    const { currentRoomName, currentRoomId } = state.chatArea;

    socket.emit("addUsers", { roomId, newUsers }, async (participants) => {
        try {
            const token = sessionStorage.getItem("token");
            const newRoomParams = {
                roomName: currentRoomName, participants, roomId: currentRoomId, newMsgs: true,
            };

            const data = { token, newRoomParams };
            await request(`${USER_PATH}/api`, addUsersToRoom, data);
            socket.emit("updateRooms", { participants, currentRoomName }, () => {
            });
        } catch (e) {
            console.error(e);
        }
    });
    action({
        type: type.SET_ADDING_USER,
        payload: false,
    });
}
function* addUserSocketSaga() {
    yield takeEvery(type.ADD_USERS, (data) => addUserSocket(data));
}

function* addUser(payload) {
    const { currentId, searchUser } = payload.payload;
    const token = window.sessionStorage.getItem("token");


    const dataGQL = yield request(`${USER_PATH}/api`, addUserGql, { token, currentId, searchUser });
    const data = dataGQL.addUser;

    action({ type: type.SET_USER_STATE, payload: data });
    socket.emit("userAccepted", { acceptedId: searchUser._id }, () => {
    });
}
function* addUserSaga() {
    yield takeEvery(type.ADD_CONTACT, (data) => addUser(data));
}

module.exports = {
    addUserSaga,
    addUserSocketSaga,
    acceptRequestSaga,
    lookForUserSaga
}