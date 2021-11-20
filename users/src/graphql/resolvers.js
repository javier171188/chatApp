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
                let response = await axios.post('http://localhost:80/users/login', input);
                console.log(response.data);
                return response.data;
            } catch (e) {
                return e;
            }
        }
    }
}