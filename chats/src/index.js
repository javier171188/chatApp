'use strict';

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const Chat = require('./model/chat');
require('./db/mongoose');

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
    /*let date = new Date();
    let dateStr = date.getTime().toString();
    serverData.date = dateStr;
    serverData.message = 'Welcome!';
    socket.emit('message', serverData);
    serverData.message = 'A user has joined!'
    socket.broadcast.emit('message', serverData);*/

    socket.on('getRoom',  async ({current, receiver}, callback)=> {
        try{
            var chat = await Chat.findOne({$and: [{"participants":current}, {"participants": receiver}]});
            if (!chat){
                chat = new Chat({"participants":[current, receiver]});
                await chat.save();
                
            }
            socket.join(chat._id.toString());
            const lastMessages = chat.messages.slice(-20);
            callback({_id:chat._id.toString(), lastMessages});
        }catch (e){
            console.log(e.toString());
        }
    }); 

    socket.on('joinPersonal',  async ({current, receiver}, callback)=> {
        try{
            var chat = await Chat.findOne({$and: [{"participants":current}, {"participants": receiver}]});
            if (!chat){
                chat = new Chat({"participants":[current, receiver]});
                await chat.save();
                
            }
            socket.join(chat._id.toString());
        }catch (e){
            console.log(e.toString());
        }
    })
    

    socket.on('sendMessage', async (message, callback) => {
        
        var chat = await Chat.findById(message.roomId);
        let prevMessages = chat.messages;
        prevMessages.push(message);
        chat.messages = prevMessages;
        chat.save();
        io.to(message.roomId).emit('updateMessages',prevMessages.slice(-20));
        //io.emit('updateMessages',prevMessages.slice(-20));
        //callback(prevMessages);
    });
    socket.on('disconnect', () => {
        console.log('A user has disconnected')
        /*let date = new Date();
        let dateStr = date.getTime().toString();
        serverData.date = dateStr;
        serverData.message = 'A user has left';
        io.emit('message', serverData);*/
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));