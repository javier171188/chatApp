import * as type from "../types";
import { request } from "graphql-request";
import { put, takeEvery } from "redux-saga/effects";
import i18n from "i18next";

const { USER_PATH } = process.env;

let countUserLoad = 0;
function* getUserState(refresh = true) {
    const email = JSON.parse(sessionStorage.getItem("email"));
    const token = sessionStorage.getItem("token");
    if (!email || !token) {
        yield put({
            type: type.SET_USER_STATE,
            payload: {
                contacts: [],
                email: "",
                hasAvatar: false,
                userName: "",
                _id: "",
                conversations: [],
            },
        });
    }

    const query = `query{getUser(email:"${email}", token:"${token}", selfUser:true) {
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

    const userGQL = yield request(`${USER_PATH}/api`, query);
    const user = userGQL.getUser;

    localStorage.setItem("language", user.language);
    sessionStorage.setItem("_id", user._id);
    yield put({ type: type.SET_USER_STATE, payload: user });
    if (countUserLoad === 0 || refresh) {
        i18n.changeLanguage(user.language);
        countUserLoad++;
    }
}
function* getUserStateSaga() {
    yield takeEvery(type.GET_USER, () => getUserState(false));
}

module.exports = {
    getUserStateSaga
}