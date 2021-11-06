'use strict';
import { put, takeEvery, all, takeLatest, call } from 'redux-saga/effects'
import { LOGIN } from '../actions';
import * as type from '../types';

import axios from 'axios';

require('dotenv').config();
const USER_PATH = process.env.USER_PATH;

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
        yield put({ type: type.SET_ERROR, payload: [] })
        yield put({ type: type.SET_AUTH, payload: true })

    } catch (error) {
        console.log(error.response.data);
        yield put({ type: type.SET_ERROR, payload: [error] })
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