'use strict';
import * as type from '../types';

export const setError = (payload) => ({
    type: type.SET_ERROR,
    payload,
});

export const setAuth = (payload) => ({
    type: type.SET_AUTH,
    payload,
});