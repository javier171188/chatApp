'use strict';
import * as type from '../types';

export const setError = (payload) => ({
    type: type.SET_ERROR,
    payload,
});