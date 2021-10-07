'use strict';

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const Chat = require('./model/chat');
require('./db/mongoose');

const port = process.env.PORT;
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

    socket.on('getRoom',  async ({current, receiver, roomId}, callback)=> {
        try{
            if (!roomId){
                var chat = await Chat.findOne({$and: [{"participants":current}, {"participants": receiver}]});
                if (!chat){
                    
                    chat = new Chat({"participants":[current, receiver]});
                    await chat.save();
                }
            } else {
                var chat = await Chat.findById(roomId);
            }
            
            //socket.join(chat._id.toString()); I think this is done in joinPersonal and joinGroup
            const lastMessages = chat.messages.slice(-20);
            const participants = chat.participants;
            const roomName = chat.roomName;
            callback({_id:chat._id.toString(), lastMessages, participants, roomName});
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

    socket.on('joinGroup',  async ({roomId}, callback)=> {
        try{
            var chat = await Chat.findOne({_id:roomId});
            socket.join(chat._id.toString());
        }catch (e){
            console.log(e.toString());
        }
    })


    
    socket.on('getMessagesByRoomId', async (roomId, callback) => {
        var chat = await Chat.findById(roomId);
        let messages = chat.messages.slice(-20);
        callback(messages);
    })



    socket.on('sendMessage', async (message, callback) => {
        var chat = await Chat.findById(message.roomId);
        let prevMessages = chat.messages;
        let participants = chat.participants
        prevMessages.push(message);
        chat.messages = prevMessages;
        chat.save();
        callback(participants);
        io.to(message.roomId).emit('updateMessages', { participants, roomId:message.roomId, returnedMessages:prevMessages.slice(-20)}, );
        //io.to(message.roomId).emit('updateMessages',prevMessages.slice(-20));
        //io.emit('updateMessages',prevMessages.slice(-20));
        //callback(prevMessages);
    });

    socket.on('newRoom', async (data, callback) => {
        let chat = new Chat(data);
        //console.log(chat);
        await chat.save();
        callback(chat._id);
        //socket.broadcast.emit('newRoom', {participants:data.participants, roomId:data.roomId});
    });

    socket.on('addUsers', async ({roomId, newUsers}, callback) => {
        let chat = await Chat.findById(roomId);
        let newUsersList = chat.participants.concat(newUsers);
        chat.participants = newUsersList;
        await chat.save();
        callback(newUsersList);
    })

    socket.on('updateRooms', ({participants, roomId}, callback) =>{
        socket.broadcast.emit('newRoom', { participants, roomId});
        callback();
    })


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