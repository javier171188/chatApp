import * as type from "../types";
import store from "../store";
import { takeEvery } from "redux-saga/effects";

import { startCall } from "../../red5pro/publish.js";
import shutdown from "../../red5pro/unpublish";

const action = ({ type, data, payload }) =>
  store.dispatch({
    type,
    data,
    payload,
  });

function* startCallFromSaga(data) {
  let { recording, audio, video, streamName } = data.payload;
  startCall(recording, audio, video, streamName);
}
function* startCallSaga() {
  yield takeEvery(type.START_CALL, (data) => {
    return startCallFromSaga(data);
  });
}

function* stopCallFromSaga(data) {
  shutdown();
}
function* stopCallSaga() {
  yield takeEvery(type.STOP_CALL, (data) => {
    return stopCallFromSaga(data);
  });
}
module.exports = {
  startCallSaga,
  stopCallSaga,
};
