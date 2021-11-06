'use strict';
import { put, takeEvery, all, takeLatest, call } from 'redux-saga/effects'
import { LOGIN } from '../actions';
import { SET_ERROR } from '../types';

import axios from 'axios';

//require('dotenv').config();
const USER_PATH = "http://localhost/users";

function* helloSaga() {
    console.log('Hello Sagas!')
}

function loginPost(path, form) {
    return axios.post(USER_PATH + path, form)
        .then(data => data.data)
        .catch((error) => { throw error });

}


function* tryLogin(data) {
    try {
        const form = {
            email: data.data[0].value,
            password: data.data[1].value,
        }

        const user = yield loginPost('/login', form);

    } catch (error) {
        console.log(error.response.data);
        yield put({ type: SET_ERROR, payload: [error] })
    }
}

function* loginSaga() {
    yield takeEvery('LOGIN', (data) => tryLogin(data));
}

export default function* rootSaga() {
    yield all([
        loginSaga()
    ]);
}