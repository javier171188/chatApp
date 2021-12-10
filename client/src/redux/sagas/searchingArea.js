import * as type from "../types";
import socket from './socket';

function* lookForUser({ data }) {
    const { event } = data;
    try {
        const token = window.sessionStorage.getItem("token");
        const email = event.target[0].value;

        const query = `query{getUser(email:"${email}", token:"${token}", selfUser:false) {
              _id
              userName
              email
                  }
              }`;
        event.target[0].value = "";
        const userGQL = yield request(`${USER_PATH}/api`, query);
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

        const mutation = `
              mutation{
                  confirmAdding(token: "${token}", participants: ["${participants[0]}", "${participants[1]}"] )
              }`;

        const state = store.getState();
        const { currentUserChat } = state.chatArea;

        yield request(`${USER_PATH}/api`, mutation);

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
            const mutation = `
                  mutation addUsersToRoom($newRoomParams:NewRoomParams){
                      newRoom(token:"${token}",
                      newRoomParams: $newRoomParams)
                  }
                  `;
            const data = { newRoomParams };
            await request(`${USER_PATH}/api`, mutation, data);
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

    const mutation = `
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
      }`;
    const dataGQL = yield request(`${USER_PATH}/api`, mutation, { searchUser });
    const data = dataGQL.addUser;

    action({ type: type.SET_USER_STATE, payload: data });
    socket.emit("userAccepted", { acceptedId: searchUser._id }, () => {
    });
}
function* addUserSaga() {
    yield takeEvery(type.ADD_CONTACT, (data) => addUser(data));
}

module.export = {
    addUserSaga,
    addUserSocketSaga,
    acceptRequestSaga,
    lookForUserSaga
}