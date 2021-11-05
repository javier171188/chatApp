'use strict';
import { put, takeEvery, all, takeLatest, call } from 'redux-saga/effects'
import { LOGIN } from '../actions';

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

const delay = (ms) => {
    console.log('Inside delay');
    return new Promise(res => setTimeout(res, ms))
}


function* tryLogin(data) {
    try {
        const form = {
            email: data.data[0].value,
            password: data.data[1].value,
        }



        /*axios.post(USER_PATH + '/login', form)
            .then(data => {
                window.sessionStorage.setItem('email', JSON.stringify(data.data.user.email));
                //setUserState(data.data.user);
                window.sessionStorage.setItem('token', data.data.token);
                //setErrorMessages([]);
                //setIsAuth(true);
                console.log(data);
            }).catch(e => {
                //setErrorMessages([e]);
                console.log(e);
            });*/

        console.log('I am being called');
        const user = yield loginPost('/login', form);
        console.log(user);

    } catch (error) {

    }
}

function* login() {
    yield takeEvery('LOGIN', (data) => tryLogin(data));
}

export default function* rootSaga() {
    yield all([
        login()
    ]);
}