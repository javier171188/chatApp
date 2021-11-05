'use strict';
import { put, takeEvery, all, takeLatest } from 'redux-saga/effects'
import { LOGIN } from '../actions';


function* helloSaga() {
    console.log('Hello Sagas!')
}

function* tryLogin(data) {
    try {
        console.log(data);
        yield console.log('trying to login');
    } catch (error) {

    }
}

function* login() {
    yield takeEvery('LOGIN', (data) => tryLogin(data), 'hi');
}

export default function* rootSaga() {
    yield all([
        login()
    ]);
}