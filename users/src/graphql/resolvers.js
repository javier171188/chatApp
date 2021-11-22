'use strict';
const User = require('../model/user');
const axios = require('axios');

const REST_PATH = 'http://localhost/users';

module.exports = {
    Query: {
        getUser: async (root, { email, token, selfUser }) => {
            try {
                let conf = {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    params: {
                        email,
                        selfUser
                    }
                }
                console.log(conf)
                let user = await axios.get(REST_PATH + '/getUser', conf);
                return user.data;
            } catch (e) {
                return e;
            }
        }
    },
    Mutation: {
        login: async (root, { input }) => {
            try {
                let response = await axios.post(REST_PATH + '/login', input);
                return response.data;
            } catch (e) {
                return e;
            }
        },
        logout: async (root, { token }) => {
            try {
                const conf = {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }
                await axios.post(REST_PATH + '/logoutAll', {}, conf);
                return;
            } catch (e) {
                return e;
            }
        },
        changeLanguage: async (root, { paramsLang, token }) => {
            try {
                const conf = {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }
                axios.post(REST_PATH + '/changeLanguage', paramsLang, conf);
                return;
            } catch (e) {
                return e
            }
        }
    }
}