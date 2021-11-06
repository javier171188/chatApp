'use strict';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducers';

import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

const initialState = {
    errorMessages: [],
    isAuth: false,
};

const store = createStore(
    reducer,
    initialState,
    applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);


export default store;