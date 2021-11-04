'use strict';
import { createStore } from 'redux';
import reducer from './reducers';

const initialState = {
    errorMessages: [],
    isAuth: false,
    logIn: (e) => {
        e.preventDefault();
        console.log('I am logging in :D');
    }
};

const store = createStore(reducer, initialState);

export default store;