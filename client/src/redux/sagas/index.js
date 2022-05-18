import { all } from "redux-saga/effects";
import { openChatSaga, sendMessageSaga } from "./chatArea";
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
import { updateRoomUsersSaga, checkStreamsSaga } from "./conference";

export default function* rootSaga() {
  yield all([
    loginSaga(),
    getUserStateSaga(),
    updateRoomUsersSaga(),
    checkStreamsSaga(),
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
