'use strict';

const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    participants: [], 
    messages: [],
    roomName: {
        type: String,
        default: ''
    }
    
});


const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;