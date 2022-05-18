import * as type from "../types";
import store from "../store";
import socket from "./socket";
import { takeEvery } from "redux-saga/effects";

const action = ({ type, payload }) =>
  store.dispatch({
    type,
    payload,
  });

function* updateRoomUsersFromSaga({ payload }) {
  socket.emit("getRoom", { roomId: payload }, ({ participants }) => {
    action({
      type: type.SET_CURRENT_USERS,
      payload: participants,
    });
  });
}

function* updateRoomUsersSaga() {
  yield takeEvery(type.GET_ROOM_USERS, (data) => updateRoomUsersFromSaga(data));
}

function* checkStreamsFromSaga({ payload }) {
  socket.emit("getStreams", { roomId: payload }, (participants) => {
    console.log(participants);
    const state = store.getState();
    const prevStreams = state.chatArea.currentStreams;

    let streamChanges = false;
    for (let p of participants) {
      if (!prevStreams.includes(p)) {
        streamChanges = true;
        break;
      }
    }

    if (participants.length !== prevStreams.length || streamChanges) {
      action({
        type: type.SET_CURRENT_STREAMS,
        payload: participants,
      });
    }
  });
}
function* checkStreamsSaga() {
  yield takeEvery(type.CHECK_STREAMS, (data) => checkStreamsFromSaga(data));
}

module.exports = {
  updateRoomUsersSaga,
  checkStreamsSaga,
};
