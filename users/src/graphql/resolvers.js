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
                let { email, password } = input;
                return { password, email }
            } catch (e) {
                return e;
            }
        }
    }
}