'use strict';

const express = require("express");
const http = require("http");
const { clearInterval } = require("timers");
const socketIo = require("socket.io");
const cors = require("cors");


const port = process.env.PORT || 3001;
const routes = require('./routes.js');

const app = express();

app.use(cors());


app.use(routes);

const server = http.createServer(app);

const io = socketIo(server,  {
    allowRequest: (req, callback) => {
      const noOriginHeader = req.headers.origin === undefined;
      callback(null, noOriginHeader);
    }
  });


let interval;

io.on("connection", (socket) => {
    console.log("new client connected");
    if (interval){
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on("disconnect", () => {
        console.log("client disconnected");
        clearInterval(interval);
    });
});

const getApiAndEmit = socket => {
    const response = new Date();
    socket.emit("FromAPI",response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));