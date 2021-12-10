import socketIOClient from "socket.io-client";
import { request } from "graphql-request";
import * as type from "../types";
import store from "../store";

const action = ({ type, data, payload }) => store.dispatch({
  type,
  data,
  payload,
});

const socket = socketIOClient(process.env.SOCKET_ENDPOINT, {
  path: process.env.SOCKET_PATH,
});

const updateLastRoom = function (roomId, returnedMessages, participants) {

  action({
    type: type.SET_LAST_ROOM_CHANGED,
    payload: roomId,
  });
  const state = store.getState();
  const { currentRoomId } = state.chatArea;

  if (roomId === currentRoomId) {
    action({
      type: type.SET_CURRENT_MESSAGES,
      data: returnedMessages,
    });
  } else {
    const { userState } = state;
    const userWithNewMsgId = participants.filter((p) => p !== userState._id)[0];
    const newState = { ...userState };
    newState.contacts.forEach((c) => {
      if (c._id === userWithNewMsgId) {
        c.newMsgs = true;
      }
    });
    newState.conversations.forEach((c) => {
      if (c.roomId === roomId) {
        c.newMsgs = true;
      }
    });
    action({
      type: type.SET_USER_STATE,
      payload: newState,
    });
  }
};
socket.on("updateMessages", ({ participants, returnedMessages, roomId }) => {
  updateLastRoom(roomId, returnedMessages, participants);
});

socket.on("newRoom", async ({ participants, roomId }) => {
  try {
    const state = store.getState();
    const { userState } = state;
    const participantIds = participants.map((p) => p._id);
    if (participantIds.includes(userState._id)) {
      const token = sessionStorage.getItem("token");
      const email = JSON.parse(sessionStorage.getItem("email"));

      const query = `query{getUser(email:"${email}", token:"${token}", selfUser:true) {
                _id
                userName
                email
                hasAvatar
                language
                        contacts{
                  email
                  newMsgs
                  status
                  userName
                  _id
                }
                        conversations{
                  newMsgs
                  participants{
                                        joinDate
                      userName
                      _id
                  }
                  roomId
                  roomName
                }
            }
               }`;

      const userGQL = await request(`${USER_PATH}/api`, query);
      const user = userGQL.getUser;
      action({
        type: type.SET_USER_STATE,
        payload: user,
      });
      socket.emit("joinGroup", { roomId });
    }
  } catch (e) {
    console.error(e);
  }
});

socket.on("userAccepted", ({ acceptedId }) => {
  const _id = sessionStorage.getItem("_id");
  if (_id === acceptedId) {
    action({
      type: type.GET_USER,
    });
  }
});


export default socket;