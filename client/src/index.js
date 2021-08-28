'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducers';
import App from './routes/App';
import axios from 'axios';

const initialState = {'users': [{
    'id': 1,
    'username': 'Tom',
    'email': 'test@test.com',
    'password':'123',
    'friends': ['Andy', 'Bob'],
    'Token': ''
}]};


axios.get('http://localhost:3000/users')
    .then(response => {
        console.log(response.data);
    })

const store = createStore(reducer, initialState);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root"));