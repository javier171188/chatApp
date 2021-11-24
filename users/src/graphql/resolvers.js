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
        },
        confirmAdding: async (root, { token, participants }) => {
            try {
                let conf = {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }
                await axios.patch(REST_PATH + '/confirmAdding', { participants }, conf)
                return;
            } catch (e) {
                return e;
            }
        },
        newRoom: async (root, { token, newRoomParams }) => {
            try {

                let conf = {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                }
                axios.post(REST_PATH + '/newRoom', newRoomParams, conf)
                return;

            } catch (e) {
                return e;
            }
        },

        addUser: async (root, { token, currentId, searchUser }) => {
            try {
                const conf = {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                };
                const data = await axios.post(REST_PATH + '/addContactNoConf', {
                    "logged": currentId,
                    "searched": searchUser
                }, conf)

                return data.data;
            } catch (e) {
                return e;
            }
        },
        createNewRoom: async (root, { token, roomName, participants, roomId, newMsgs }) => {
            try {

                let conf = {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                }

                axios.post(REST_PATH + '/newRoom', { roomName, participants, roomId, newMsgs }, conf)
                return
            } catch (e) {
                return e
            }
        },
        updateUser: async (root, { token, senderId, receiver, newStatus, roomId }) => {
            try {

                let conf = {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    params: {
                        senderId, receiver, newStatus, roomId
                    }
                }

                await axios.post(REST_PATH + '/updateUser', conf);
                return;
            } catch (e) {
                return e;
            }
        },
        registerUser: async (root, { userName, email, password }) => {
            try {
                const form = {
                    userName,
                    email,
                    password
                }
                const data = await axios.post(REST_PATH + '/register', form)
                return data.data;
            } catch (e) {
                return e;
            }
        }
    }
}