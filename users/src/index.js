'use strict';

const express = require('express');
//const cors = require("cors");
const router = require('./routes');

require('./db/mongoose');
const User = require('./model/user'); 

const app = express();

//app.use(cors());
const port = process.env.PORT;

app.use((req,res, next)=>{//Basic middleweare, delete once you don't forget how to use them
    console.log(req.method, req.path);
    next();
})
app.use(express.json()); // Parse incoming json to object.
app.use(router);

app.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});

