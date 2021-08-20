'use strict';

const express = require('express');
const router = require('./routes');

require('./db/mongoose');
const USer = require('./model/user');

const app = express();
const port = process.env.PORT || 3000;

app.use((req,res, next)=>{//Basic middleweare, delete once you don't forget how to use them
    console.log(req.method, req.path);
    next();
})
app.use(express.json()); // Parse incoming json to object.
app.use(router);

app.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});

