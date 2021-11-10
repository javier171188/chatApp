'use strict';
import { put, takeEvery, all, takeLatest, call, fork } from 'redux-saga/effects'
import * as type from '../types';
import { openChatSaga, createNewRoomSaga } from './socket';
import i18n from "i18next";

import axios from 'axios';

require('dotenv').config();
const USER_PATH = process.env.USER_PATH;


function postUsersService(path, form) {
    return axios.post(USER_PATH + path, form)
        .then(data => data.data)
        .catch((error) => { throw error });
}
function getUsersService(path, form) {
    return axios.get(USER_PATH + path, form)
        .then(data => data.data)
        .catch((error) => { throw error });
}



//Login//////////////////////////////////
function* tryLogin(data) {
    try {
        const form = {
            email: data.data[0].value,
            password: data.data[1].value,
        }

        const user = yield postUsersService('/login', form);

        yield put({ type: type.SET_AUTH, payload: true });
        window.sessionStorage.setItem('email', JSON.stringify(user.user.email));
        window.sessionStorage.setItem('token', user.token);
        yield put({ type: type.SET_USER_STATE, payload: user.user });
        yield put({ type: type.SET_ERROR, payload: [] });

    } catch (error) {
        console.log(error.response.data);
        yield put({ type: type.SET_ERROR, payload: [error] })
    }
}
function* loginSaga() {
    yield takeEvery(type.LOGIN, (data) => tryLogin(data));
}

////////////////////////////////////////////////////////////////////////
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
    let conf = {
        headers: {
            'Authorization': 'Bearer ' + token
        },
        params: {
            email,
            selfUser: true
        }
    }
    const user = yield getUsersService('/getUser', conf);
    localStorage.setItem('language', user.language);
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
        const conf = {
            headers: {
                'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
            }
        }
        yield put({ type: type.SET_AUTH, payload: false });
        window.sessionStorage.removeItem('token');
        window.sessionStorage.removeItem('email');
        yield postUsersService('/logoutAll', conf);
    } catch (error) {
        console.error(error.response.data);
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
        const conf = {
            headers: {
                'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
            },
            params: {
                email: event.target[0].value
            }
        }
        event.target[0].value = '';
        let user = yield getUsersService('/getUser', conf);
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

export default function* rootSaga() {
    yield all([
        loginSaga(),
        getUserStateSaga(),
        logoutSaga(),
        lookForUserSaga(),
        openChatSaga(),
        createNewRoomSaga()
    ]);
}