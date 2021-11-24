'use strict';
import { put, takeEvery, all, takeLatest, call, fork } from 'redux-saga/effects'
import * as type from '../types';
import i18n from "i18next";
import {
    openChatSaga,
    createNewRoomSaga,
    addUserSaga,
    sendMessageSaga,
    subscribeRoomsSaga,
    addUserToRoomSaga,
    addUserSocketSaga,
    acceptRequestSaga
} from './socket';
import store from '../store';
import axios from 'axios';
import { request } from 'graphql-request';

const action = ({ type, data, payload }) => store.dispatch({
    type,
    data,
    payload
})


require('dotenv').config();
const USER_PATH = process.env.USER_PATH;


//Login//////////////////////////////////
function* tryLogin(data) {
    try {
        var email = data.data[0].value;
        var password = data.data[1].value;

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
        `

        let loginResponse = yield request(USER_PATH + '/api', mutation);
        const { login: user } = loginResponse;


        yield put({ type: type.SET_AUTH, payload: true });
        window.sessionStorage.setItem('email', JSON.stringify(user.user.email));
        window.sessionStorage.setItem('token', user.token);
        yield put({ type: type.SET_USER_STATE, payload: user.user });
        yield put({ type: type.SET_ERROR, payload: [] });

    } catch (error) {
        console.error(error);
        yield put({ type: type.SET_ERROR, payload: [error] })
    }
}
function* loginSaga() {
    yield takeEvery(type.LOGIN, (data) => tryLogin(data));
}

//Get user data//////////////////////////////////////////////////////
let countUserLoad = 0;
function* getUserState(refresh = true) {
    let email = JSON.parse(sessionStorage.getItem('email'));
    let token = sessionStorage.getItem('token');
    if (!email || !token) {
        yield put({
            type: type.SET_USER_STATE, payload: {
                contacts: [],
                email: "",
                hasAvatar: false,
                userName: "",
                _id: "",
                conversations: []
            }
        });
    }

    let query = `query{getUser(email:"${email}", token:"${token}", selfUser:true) {
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
    }`

    const userGQL = yield request(USER_PATH + '/api', query);
    const user = userGQL.getUser;

    localStorage.setItem('language', user.language);
    sessionStorage.setItem('_id', user._id);
    yield put({ type: type.SET_USER_STATE, payload: user });
    if (countUserLoad === 0 || refresh) {
        i18n.changeLanguage(user.language);
        countUserLoad++;
    }
};
function* getUserStateSaga() {
    yield takeEvery(type.GET_USER, () => getUserState(false));
}
//logout///////////////////////////////////////////////////////////
function* logout(data) {
    try {
        let token = window.sessionStorage.getItem('token');
        const mutation = `
        mutation{
            logout(token:"${token}")
          }
        `
        yield request(USER_PATH + '/api', mutation);
        yield put({ type: type.SET_AUTH, payload: false });
        window.sessionStorage.removeItem('token');
        window.sessionStorage.removeItem('email');
        window.sessionStorage.removeItem('_id');
    } catch (error) {
        console.error(error);
    }
}
function* logoutSaga() {
    yield takeEvery(type.LOGOUT, logout);
}
////////////////////////////////////////////////////////////////////
// Search for user
function* lookForUser({ data }) {
    let event = data.event;
    try {

        let token = window.sessionStorage.getItem('token');
        let email = event.target[0].value;

        let query = `query{getUser(email:"${email}", token:"${token}", selfUser:false) {
            _id
            userName
            email
                }
            }`
        event.target[0].value = '';
        const userGQL = yield request(USER_PATH + '/api', query);
        const user = userGQL.getUser;

        user.newMsgs = false;

        yield put({ type: type.SET_SEARCH_USER, payload: user })
        yield put({ type: type.SET_SEARCH_MESSAGE, payload: 'One user found: ' });
    } catch (error) {
        yield put({
            type: type.SET_SEARCH_MESSAGE,
            payload: 'No user was found, try a different e-mail address.'
        });
    }
}
function* lookForUserSaga() {
    yield takeEvery(type.LOOK_FOR_USER, (data) => lookForUser(data));
}

//////////////////////////////////////////////////////////////////////
// Change language
function* setLanguage(data) {
    let token = sessionStorage.getItem('token')
    let paramsLang = data.payload.paramsLang;

    let mutation = `
    mutation{
        changeLanguage(token:"${token}",
        paramsLang:{email:"${paramsLang.email}", language:"${paramsLang.language}"})
      }
    `
    yield request(USER_PATH + '/api', mutation);
    yield localStorage.setItem('language', paramsLang.chosenLanguage);
}
function* setLanguageSaga() {
    yield takeEvery(type.CHANGE_LANGUAGE, (data) => setLanguage(data));
}
////////////////////////////////////////////////////////////////
// Register/////////////////////////////////////////////////////
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
                selectedFile.name
            );

            yield axios.post(USER_PATH + "/avatar/check", formData);
        }

        if (event.target[2].value === event.target[3].value) {
            let userName = event.target[0].value;
            let email = event.target[1].value;
            let password = event.target[2].value;
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
            `
            const data = yield request(USER_PATH + '/api', mutation)
            if (selectedFile) {
                const conf = { headers: { 'Authorization': 'Bearer ' + data.registerUser.token } };
                var user = yield axios.post(USER_PATH + "/avatar", formData, conf);
                action({
                    type: type.SET_USER_STATE,
                    payload: user.data
                })
                window.sessionStorage.setItem('email', JSON.stringify(user.data.email));
            } else {

                action({
                    type: type.SET_USER_STATE,
                    payload: data.registerUser.user
                })
                window.sessionStorage.setItem('email', JSON.stringify(data.registerUser.user.email));
            }

            window.sessionStorage.setItem('token', data.registerUser.token);
            action({
                type: type.SET_ERROR,
                payload: []
            })
            action({
                type: type.SET_AUTH,
                payload: true
            })
        } else {
            action({
                type: type.SET_ERROR,
                payload: ['The password does not match the confirmation']
            })
        }
    } catch (error) {
        //let strError = error.response.data;
        //strError = strError.replace('Error: ', '');
        console.log(error)
        switch (error) {
            case 'That e-mail is already registered':
                action({
                    type: type.SET_ERROR,
                    payload: ['That e-mail is already registered']
                })
                break;
            default:
                action({
                    type: type.SET_ERROR,
                    payload: ['Something went wrong']
                })
                break;
        }
    }
}
function* registerSaga() {
    yield takeEvery(type.REGISTER, (data) => register(data));
}
////////////////////////////////////////////////////////////////

export default function* rootSaga() {
    yield all([
        loginSaga(),
        getUserStateSaga(),
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
        registerSaga()
    ]);
}