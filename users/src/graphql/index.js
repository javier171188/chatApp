'use strict';

const { buildSchema } = require('graphql');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { readFileSync } = require('fs');
const { join } = require('path');
const resolvers = require('./resolvers');

const app = express();
const port = process.env.port || 3000;

const schema = buildSchema(readFileSync(
  join(__dirname, 'schema.graphql'),
  'utf-8'
));

const graphqlConf = graphqlHTTP({
  schema: schema,
  rootValue: resolvers,
  graphiql: true
})

module.exports = { graphqlConf };