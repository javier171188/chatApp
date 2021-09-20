'use strict';
const mongoose = require('mongoose');

const connectionURL =  process.env.DBURL || 'mongodb://127.0.0.1:27017'; 
const databaseName = process.env.DBNAME || 'chats-chat'; 

mongoose.connect(`${connectionURL}/${databaseName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


//useCreateIndex: true,