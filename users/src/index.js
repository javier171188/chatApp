'use strict';

const express = require('express');
const router = require('./routes');
require('./db/mongoose');
const { graphqlConf } = require('./graphql/index.js');

const app = express();
const port = process.env.PORT;

app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
})

app.use('/users/api', graphqlConf);
app.use(express.json()); // Parse incoming json to object.
app.use(router);

app.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});

