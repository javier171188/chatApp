'use strict';
const User = require('../model/user');
const axios = require('axios');

module.exports = {
    Query: {
        getUser: () => {
            return 'You have an user';
        }
    },
    Mutation: {
        login: async (root, { input }) => {
            try {
                //let { email, password } = input;
                let response = await axios.post('http://localhost:80/users/login', input);
                console.log('I am resolving');
                return response;
            } catch (e) {
                return e;
            }
        }
    }
}