'use strict';
const mongoose = require('mongoose');

const connectionURL =  process.env.DB_URL; 
const databaseName = process.env.DB_NAME; 
console.log(connectionURL);
console.log(databaseName);
mongoose.connect(`${connectionURL}/${databaseName}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
