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



            
var serverData = {
        sender: {
            _id: '0',
            userName: 'Chat'
        },
};


io.on('connection', (socket) => {
    console.log('New connection');
    let date = new Date();
    let dateStr = date.getTime().toString();
    serverData.date = dateStr;
    serverData.message = 'Welcome!';
    socket.emit('message', serverData);
    serverData.message = 'A user has joined!'
    socket.broadcast.emit('message', serverData);

    socket.on('sendMessage', (message, callback) => {
        io.emit('message', message);
        
        callback('Delivered!');
    });

    socket.on('disconnect', () => {
        console.log('A user has disconnected')
        let date = new Date();
        let dateStr = date.getTime().toString();
        serverData.date = dateStr;
        serverData.message = 'A user has left';
        io.emit('message', serverData);
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));