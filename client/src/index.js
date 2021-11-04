'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducers';
//import Context from './context/Context';
import './i18n';                             //is this being used?
import App from './routes/App';

const initialState = {
    errorMessages: [],
    isAuth: false
};

const store = createStore(reducer, initialState);


ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root"));