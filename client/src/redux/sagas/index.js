import { all } from "redux-saga/effects";
import {
  openChatSaga,
  sendMessageSaga,
  startCallSaga,
  stopCallSaga,
} from "./chatArea";
import { loginSaga, logoutSaga, registerSaga } from "./loginLogout";
import {
  addUserToRoomSaga,
  createNewRoomSaga,
  subscribeRoomsSaga,
} from "./manageRooms";
import {
  addUserSaga,
  addUserSocketSaga,
  acceptRequestSaga,
  lookForUserSaga,
} from "./searchingArea";
import { setLanguageSaga } from "./settings";
import { getUserStateSaga } from "./userState";

export default function* rootSaga() {
  yield all([
    loginSaga(),
    getUserStateSaga(),
    startCallSaga(),
    stopCallSaga(),
    logoutSaga(),
    lookForUserSaga(),
    openChatSaga(),
    createNewRoomSaga(),
    setLanguageSaga(),
    addUserSaga(),
    sendMessageSaga(),
    subscribeRoomsSaga(),
    addUserToRoomSaga(),
    addUserSocketSaga(),
    acceptRequestSaga(),
    registerSaga(),
  ]);
}
