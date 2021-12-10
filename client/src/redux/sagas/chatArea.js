import * as type from "../types";
import socket from './socket';

function* sendMessageFromSaga(data) {
    const {
        event, userState, currentRoomId, imageStr,
    } = data.payload;
    let isImage;
    var message;
    if (!imageStr) {
        event.preventDefault();
        message = event.target[0].value;
        event.target[0].value = "";
        isImage = false;
    } else {
        message = imageStr;
        isImage = true;
    }

    if (message !== "") {
        const date = new Date();
        const dateStr = date.getTime().toString();

        const messageData = {
            sender: {
                _id: userState._id,
                userName: userState.userName,
            },
            message,
            date: dateStr,
            roomId: currentRoomId,
            isImage,
        };
        socket.emit("sendMessage", messageData, (participants) => {
            let notCurrentParticipants;
            if (typeof participants[0] !== "object") {
                notCurrentParticipants = participants.filter((p) => p !== userState._id);
            } else {
                notCurrentParticipants = participants.filter((p) => p._id !== userState._id);
                notCurrentParticipants = notCurrentParticipants.map((p) => p._id);
            }

            const token = sessionStorage.getItem("token");

            notCurrentParticipants.forEach((p) => {
                const receiver = { _id: p, individualRoom: true };
                const mutation = `
                  mutation updateUserGQL($receiver:UpdatedUser) {
                      updateUser(token: "${token}", senderId: "${userState._id}", receiver:$receiver, newStatus:true, roomId:"${currentRoomId}" )
                  }`;

                request(`${USER_PATH}/api`, mutation, { receiver });
            });
        });
    }
}
function* sendMessageSaga() {
    yield takeEvery(type.SEND_MESSAGE, (data) => sendMessageFromSaga(data));
}

function* openChat(data) {
    const {
        current, receiver, userState, contactClasses, roomId,
    } = data.payload.users;
    socket.emit("getRoom", { current, receiver, roomId }, ({
        _id: _idRoom, lastMessages, participants, roomName,
    }) => {
        action({
            type: type.SET_CURRENT_ROOM_ID,
            data: _idRoom,
        });
        action({
            type: type.SET_CURRENT_MESSAGES,
            data: lastMessages,
        });

        const participantId = participants.filter((p) => p !== userState._id)[0];
        const newNameObj = userState.contacts.filter((c) => (c._id === participantId));

        if (newNameObj[0]) {
            roomName = newNameObj[0].userName;
        }

        action({
            type: type.SET_CURRENT_ROOM_NAME,
            data: roomName,
        });
        let params;
        if (contactClasses) {
            if (contactClasses.includes("pending")) {
                action({
                    type: type.SET_CONTACT_STATUS,
                    payload: "pending",
                });
                action({
                    type: type.SET_CURRENT_MESSAGES,
                    data: [],
                });
                action({
                    type: type.SET_CURRENT_ROOM_ID,
                    data: "1",
                });
                return;
            } if (contactClasses.includes("request")) {
                action({
                    type: type.SET_CONTACT_STATUS,
                    payload: "request",
                });
                action({
                    type: type.SET_CURRENT_MESSAGES,
                    data: [],
                });
                action({
                    type: type.SET_CURRENT_ROOM_ID,
                    data: "1",
                });
                return;
            }
            params = {
                senderId: receiver,
                receiver: { _id: userState._id, individualRoom: true },
                newStatus: false,
                roomId: _idRoom,
            };
        } else {
            params = {
                senderId: userState._id,
                receiver: { _id: userState._id, individualRoom: false },
                newStatus: false,
                roomId,
            };
        }

        const newUserState = { ...userState };
        newUserState.contacts.forEach((c) => {
            if (c._id === receiver) {
                c.newMsgs = false;
            }
        });

        newUserState.conversations.forEach((c) => {
            if (c.roomId === roomId) {
                c.newMsgs = false;
            }
        });

        action({
            type: type.SET_USER_STATE,
            payload: newUserState,
        });
        action({
            type: type.SET_CONTACT_STATUS,
            payload: "accepted",
        });
        const token = sessionStorage.getItem("token");

        const mutation = `
          mutation updateUserGQL($receiver:UpdatedUser){
              updateUser(token: "${token}", senderId: "${params.senderId}", receiver:$receiver, newStatus:${params.newStatus}, roomId:"${params.roomId}" )
              }`;
        request(`${USER_PATH}/api`, mutation, { receiver: params.receiver });
    });
}
function* openChatSaga() {
    yield takeEvery(type.SOCKET_GET_ROOM, (data) => openChat(data));
}

module.export = {
    openChatSaga,
    sendMessageSaga,
}