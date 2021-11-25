const axios = require("axios");

const restPath = process.env.REST_PATH;


module.exports = {
  Query: {
    getUser: async (root, { email, token, selfUser }) => {
      try {
        const conf = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            email,
            selfUser,
          },
        };
        const user = await axios.get(`${restPath}/getUser`, conf);
        return user.data;
      } catch (e) {
        return e;
      }
    },
  },
  Mutation: {
    login: async (root, { input }) => {
      try {
        const response = await axios.post(`${restPath}/login`, input);
        return response.data;
      } catch (e) {
        return e;
      }
    },
    logout: async (root, { token }) => {
      try {
        const conf = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.post(`${restPath}/logoutAll`, {}, conf);
        return;
      } catch (e) {
        return e;
      }
    },
    changeLanguage: async (root, { paramsLang, token }) => {
      try {
        const conf = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        axios.post(`${restPath}/changeLanguage`, paramsLang, conf);
        return;
      } catch (e) {
        return e;
      }
    },
    confirmAdding: async (root, { token, participants }) => {
      try {
        const conf = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.patch(`${restPath}/confirmAdding`, { participants }, conf);
        return;
      } catch (e) {
        return e;
      }
    },
    newRoom: async (root, { token, newRoomParams }) => {
      try {
        const conf = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        axios.post(`${restPath}/newRoom`, newRoomParams, conf);
        return;
      } catch (e) {
        return e;
      }
    },

    addUser: async (root, { token, currentId, searchUser }) => {
      try {
        const conf = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const data = await axios.post(`${restPath}/addContactNoConf`, {
          logged: currentId,
          searched: searchUser,
        }, conf);

        return data.data;
      } catch (e) {
        return e;
      }
    },
    createNewRoom: async (root, {
      token, roomName, participants, roomId, newMsgs,
    }) => {
      try {
        const conf = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        axios.post(`${restPath}/newRoom`, {
          roomName, participants, roomId, newMsgs,
        }, conf);
        return;
      } catch (e) {
        return e;
      }
    },
    updateUser: async (root, {
      token, senderId, receiver, newStatus, roomId,
    }) => {
      try {
        const conf = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            senderId, receiver, newStatus, roomId,
          },
        };

        await axios.post(`${restPath}/updateUser`, conf);
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
          password,
        };
        const data = await axios.post(`${restPath}/register`, form);
        return data.data;
      } catch (e) {
        const strError = e.response.data;
        return { token: strError };
      }
    },
  },
};
