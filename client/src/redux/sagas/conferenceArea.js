import * as type from "../types";
import store from "../store";
import { takeEvery } from "redux-saga/effects";

import { startCall } from "../../red5pro/publish.js";

const action = ({ type, data, payload }) =>
  store.dispatch({
    type,
    data,
    payload,
  });

function* startCallFromSaga(data) {
  console.log("calling");
  startCall();
}
function* startCallSaga() {
  yield takeEvery(type.START_CALL, (data) => {
    return startCallFromSaga(data);
  });
}
module.exports = {
  startCallSaga,
};
