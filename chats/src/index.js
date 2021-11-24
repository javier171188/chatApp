const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const Chat = require("./model/chat");
require("./db/mongoose");

const port = process.env.PORT;
// const routes = require('./routes.js');

const app = express();
// app.use(routes);
const server = http.createServer(app);
const io = socketIo(server, {
  path: "/mysocket",
});

const serverData = {
  sender: {
    _id: "0",
    userName: "Chat",
  },
};

io.on("connection", (socket) => {
  console.log("New connection");
  /* let date = new Date();
    let dateStr = date.getTime().toString();
    serverData.date = dateStr;
    serverData.message = 'Welcome!';
    socket.emit('message', serverData);
    serverData.message = 'A user has joined!'
    socket.broadcast.emit('message', serverData); */
  socket.on("userAccepted", ({ acceptedId }, callback) => {
    io.emit("userAccepted", { acceptedId });
  });

  socket.on("getRoom", async ({ current, receiver, roomId }, callback) => {
    try {
      if (!roomId) {
        var chat = await Chat.findOne({ $and: [{ participants: current }, { participants: receiver }] });
        if (!chat) {
          chat = new Chat({ participants: [current, receiver] });
          await chat.save();
        }
      } else {
        var chat = await Chat.findById(roomId);
      }

      const lastMessages = chat.messages.slice(-20);
      const { participants } = chat;
      const { roomName } = chat;
      callback({
        _id: chat._id.toString(), lastMessages, participants, roomName,
      });
    } catch (e) {
      console.log(e.toString());
    }
  });

  socket.on("joinPersonal", async ({ current, receiver }, callback) => {
    try {
      let chat = await Chat.findOne({ $and: [{ participants: current }, { participants: receiver }] });
      if (!chat) {
        chat = new Chat({ participants: [current, receiver] });
        await chat.save();
      }
      socket.join(chat._id.toString());
    } catch (e) {
      console.log(e.toString());
    }
  });

  socket.on("joinGroup", async ({ roomId }, callback) => {
    try {
      const chat = await Chat.findOne({ _id: roomId });
      socket.join(chat._id.toString());
    } catch (e) {
      console.log(e.toString());
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
    console.log(message.roomId);
    io.to(message.roomId).emit("updateMessages", { participants, roomId: message.roomId, returnedMessages: prevMessages.slice(-20) });
  });

  socket.on("newRoom", async (data, callback) => {
    const chat = new Chat(data);
    // console.log(chat);
    await chat.save();
    callback(chat._id);
    // socket.broadcast.emit('newRoom', {participants:data.participants, roomId:data.roomId});
  });

  socket.on("addUsers", async ({ roomId, newUsers }, callback) => {
    const chat = await Chat.findById(roomId);
    const newUsersList = chat.participants.concat(newUsers);
    chat.participants = newUsersList;
    await chat.save();
    callback(newUsersList);
  });

  socket.on("updateRooms", ({ participants, roomId }, callback) => {
    // I think I am not using this.
    socket.broadcast.emit("newRoom", { participants, roomId });
    callback();
  });

  socket.on("disconnect", () => {
    console.log("A user has disconnected");
    /* let date = new Date();
        let dateStr = date.getTime().toString();
        serverData.date = dateStr;
        serverData.message = 'A user has left';
        io.emit('message', serverData); */
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
