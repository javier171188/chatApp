'use strict';

const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    participants: [String], 
    messages: []
    
});


const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;