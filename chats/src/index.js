'use strict';

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");


const port = process.env.PORT || 3001;
//const routes = require('./routes.js');

const app = express();
//app.use(routes);
const server = http.createServer(app);
const io = socketIo(server, {
    path: '/mysocket'
});


io.on('connection', (socket) => {
    console.log('New connection');
    socket.emit('message', 'Welcome!');
    socket.broadcast.emit('message', '"Username" has joined!');

    socket.on('sendMessage', (message, callback) => {
        io.emit('message', message);
        callback('Delivered!');
    });

    socket.on('disconnect', () => {
        io.emit('message', '"Username" has left');
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));