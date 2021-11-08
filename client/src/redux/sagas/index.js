'use strict';
import { put, takeEvery, all, takeLatest, call } from 'redux-saga/effects'
import { LOGIN } from '../actions';
import * as type from '../types';

import axios from 'axios';

require('dotenv').config();
const USER_PATH = process.env.USER_PATH;


function postUsersService(path, form) {
    return axios.post(USER_PATH + path, form)
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
        yield put({ type: type.SET_USER, payload: user.user });
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
function* getUserState(refresh = true) {
    let email = JSON.parse(sessionStorage.getItem('email'));
    let token = sessionStorage.getItem('token');
    if (!email || !token) {
        yield put({
            type: type.SET_USER, payload: {
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
    const user = yield postUsersService('/getUser', cong);
    yield put({ type: type.SET_USER, payload: user.user });
    /*if (countUserLoad === 0 || refresh) {
        //setUserState(user.data)
        i18n.changeLanguage(user.data.language);
        localStorage.setItem('language', user.data.language);
        countUserLoad++;
    }*/
};
function* getUserStateSaga() {
    yield takeEvery(type.GET_USER, getUserState);
}


//logout///////////////////////////////////////////////////////////

export default function* rootSaga() {
    yield all([
        loginSaga(),
        getUserStateSaga()
    ]);
}