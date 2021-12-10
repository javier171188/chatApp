import * as type from "../types";
import store from "../store";
import axios from "axios";
import { request } from "graphql-request";
import { put, takeEvery } from "redux-saga/effects";

const { USER_PATH } = process.env;

const action = ({ type, data, payload }) => store.dispatch({
    type,
    data,
    payload,
});


function* tryLogin(data) {
    try {
        const email = data.data[0].value;
        const password = data.data[1].value;

        const mutation = `
          mutation{
              login(input:{
                email: "${email}"
                password: "${password}"
                    
              }){
                user{
                  _id
                  userName
                  email
                  contacts {
                      email
                      newMsgs
                      status
                      userName
                      _id
                  }
                  hasAvatar
                  conversations {
                      newMsgs
                      participants{
                          joinDate
                          userName
                          _id
                      }
                      roomId
                      roomName
                  }
                  language
                }
                token
              }
            }
          `;

        const loginResponse = yield request(`${USER_PATH}/api`, mutation);
        const { login: user } = loginResponse;
        yield put({ type: type.SET_AUTH, payload: true });
        window.sessionStorage.setItem("email", JSON.stringify(user.user.email));
        window.sessionStorage.setItem("token", user.token);

        yield put({ type: type.SET_USER_STATE, payload: user.user });
        yield put({ type: type.SET_ERROR, payload: [] });
    } catch (error) {
        console.error(error);
        yield put({ type: type.SET_ERROR, payload: [error] });
    }
}
function* loginSaga() {
    yield takeEvery(type.LOGIN, (data) => tryLogin(data));
}

function* logout() {
    try {
        const token = window.sessionStorage.getItem("token");
        const mutation = `
          mutation{
              logout(token:"${token}")
            }
          `;
        yield request(`${USER_PATH}/api`, mutation);
        yield put({ type: type.SET_AUTH, payload: false });
        window.sessionStorage.removeItem("token");
        window.sessionStorage.removeItem("email");
        window.sessionStorage.removeItem("_id");
    } catch (error) {
        console.error(error);
    }
}
function* logoutSaga() {
    yield takeEvery(type.LOGOUT, logout);
}

function* register(data) {
    const event = data.payload;
    try {
        event.preventDefault();
        const selectedFile = event.target[4].files[0];
        if (selectedFile) {
            var formData = new FormData();
            formData.append(
                "avatar",
                selectedFile,
                selectedFile.name,
            );

            yield axios.post(`${USER_PATH}/avatar/check`, formData);
        }

        if (event.target[2].value === event.target[3].value) {
            const userName = event.target[0].value;
            const email = event.target[1].value;
            const password = event.target[2].value;
            const mutation = `
              mutation{
                  registerUser(
                    userName: "${userName}"
                    email: "${email}"
                    password: "${password}"
                  ){
                      user{
                          _id
                          userName
                          email
                          contacts {
                              email
                              newMsgs
                              status
                              userName
                              _id
                          }
                          hasAvatar
                          conversations {
                              newMsgs
                              participants{
                                  joinDate
                                  userName
                                  _id
                              }
                              roomId
                              roomName
                          }
                          language
                        }
                        token
                  }
                }
              `;
            const data = yield request(`${USER_PATH}/api`, mutation);
            if (data.registerUser.token.startsWith("Error:")) {
                throw new Error(data.registerUser.token.replace("Error: ", ""));
            }
            if (selectedFile) {
                const conf = { headers: { Authorization: `Bearer ${data.registerUser.token}` } };
                const user = yield axios.post(`${USER_PATH}/avatar`, formData, conf);
                action({
                    type: type.SET_USER_STATE,
                    payload: user.data,
                });
                window.sessionStorage.setItem("email", JSON.stringify(user.data.email));
            } else {
                action({
                    type: type.SET_USER_STATE,
                    payload: data.registerUser.user,
                });
                window.sessionStorage.setItem("email", JSON.stringify(data.registerUser.user.email));
            }

            window.sessionStorage.setItem("token", data.registerUser.token);
            action({
                type: type.SET_ERROR,
                payload: [],
            });
            action({
                type: type.SET_AUTH,
                payload: true,
            });
        } else {
            action({
                type: type.SET_ERROR,
                payload: ["The password does not match the confirmation"],
            });
        }
    } catch (error) {
        const strError = error.toString().replace("Error: ", "");

        switch (strError) {
            case "That e-mail is already registered":
                action({
                    type: type.SET_ERROR,
                    payload: ["That e-mail is already registered"],
                });
                break;
            default:
                action({
                    type: type.SET_ERROR,
                    payload: ["Something went wrong"],
                });
                break;
        }
    }
}
function* registerSaga() {
    yield takeEvery(type.REGISTER, (data) => register(data));
}

module.exports = {
    loginSaga,
    logoutSaga,
    registerSaga
}