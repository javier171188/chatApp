'use strict';
//https://stackoverflow.com/questions/55303250/redux-saga-socket-io
import socketIOClient from 'socket.io-client';
import { apply, call, fork, put, take, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as type from '../types';

let SOCKET_ENDPOINT = process.env.SOCKET_ENDPOINT;
let SOCKET_PATH = process.env.SOCKET_PATH;

function createSocketConnection(endpoint, path) {
    return socketIOClient(endpoint, {
        path
    });
}

function createSocketChannel(socket) {
    return eventChannel(emit => {
        const eventHandler = (event) => {
            emit(event.payload);
        };

        const errorHandler = (errorEvent) => {
            emit(new Error(errorEvent.reason));
        };

        socket.on('message', eventHandler);
        socket.on('error', errorHandler);

        const unsubscribe = () => {
            socket.off('message', eventHandler);
        };
        console.log('chanel created');
        return unsubscribe;
    });
}

function* emitResponse(socket) {
    yield apply(socket, socket.emit, ['message received']);
}

function* writeSocket(socket) {
    console.log('enter write socket');
    while (true) {
        const { eventName, payload } = yield take(type.SEND_SOCKET, () => console.log('send'));
        console.log(eventName, payload);
        console.log('I took the socket');
        socket.emit(eventName, payload);
    }
}



function* watchSocketChannel() {
    console.log('1')
    const socket = yield call(createSocketConnection, SOCKET_ENDPOINT, SOCKET_PATH);
    const socketChannel = yield call(createSocketChannel, socket);
    console.log(socketChannel);
    console.log(socket);
    fork(writeSocket, socket);
    while (true) {
        try {
            console.log('Enter while');
            const payload = yield take(socketChannel);
            console.log('I have payload');
            yield put({ type: actions.WEBSOCKET_MESSAGE, payload });
            yield fork(emitResponse, socket);
        } catch (err) {
            console.error('socket error: ', err);
        }
    }
}

export default watchSocketChannel;