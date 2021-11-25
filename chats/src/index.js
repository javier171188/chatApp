const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const Chat = require("./model/chat");
require("./db/mongoose");

const port = process.env.PORT;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  path: "/mysocket",
});

io.on("connection", (socket) => {
  console.log("New connection");

  socket.on("userAccepted", ({ acceptedId }, callback) => {
    io.emit("userAccepted", { acceptedId });
  });

  socket.on("getRoom", async ({ current, receiver, roomId }, callback) => {
    try {
      var chat;
      if (!roomId) {
        chat = await Chat.findOne({
          $and: [{ participants: current }, { participants: receiver }]
        });
        if (!chat) {
          chat = new Chat({ participants: [current, receiver] });
          await chat.save();
        }
      } else {
        chat = await Chat.findById(roomId);
      }

      const lastMessages = chat.messages.slice(-20);
      const { participants } = chat;
      const { roomName } = chat;
      callback({
        _id: chat._id.toString(), lastMessages, participants, roomName,
      });
    } catch (e) {
      console.error(e.toString());
    }
  });

  socket.on("joinPersonal", async ({ current, receiver }) => {
    try {
      let chat = await Chat.findOne({
        $and: [{ participants: current }, { participants: receiver }]
      });
      if (!chat) {
        chat = new Chat({ participants: [current, receiver] });
        await chat.save();
      }
      socket.join(chat._id.toString());
    } catch (e) {
      console.error(e.toString());
    }
  });

  socket.on("joinGroup", async ({ roomId }) => {
    try {
      const chat = await Chat.findOne({ _id: roomId });
      socket.join(chat._id.toString());
    } catch (e) {
      console.error(e.toString());
    }
  });

  socket.on("getMessagesByRoomId", async (roomId, callback) => {
    const chat = await Chat.findById(roomId);
    const messages = chat.messages.slice(-20);
    callback(messages);
  });

  socket.on("sendMessage", async (message, callback) => {
    const chat = await Chat.findById(message.roomId);
    const prevMessages = chat.messages;
    const { participants } = chat;
    prevMessages.push(message);
    chat.messages = prevMessages;
    chat.save();
    callback(participants);
    io.to(message.roomId).emit("updateMessages", { participants, roomId: message.roomId, returnedMessages: prevMessages.slice(-20) });
  });

  socket.on("newRoom", async (data, callback) => {
    const chat = new Chat(data);
    await chat.save();
    callback(chat._id);
  });

  socket.on("addUsers", async ({ roomId, newUsers }, callback) => {
    const chat = await Chat.findById(roomId);
    const newUsersList = chat.participants.concat(newUsers);
    chat.participants = newUsersList;
    await chat.save();
    callback(newUsersList);
  });

  socket.on("updateRooms", ({ participants, roomId }, callback) => {
    socket.broadcast.emit("newRoom", { participants, roomId });
    callback();
  });

  socket.on("disconnect", () => {
    console.log("A user has disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
