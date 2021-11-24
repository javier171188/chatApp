'use strict';

const { makeExecutableSchema } = require('@graphql-tools/schema');
const { graphqlHTTP } = require('express-graphql');
const { readFileSync } = require('fs');
const { join } = require('path');
const resolvers = require('./resolvers');


const typeDefs = readFileSync(
  join(__dirname, 'schema.graphql'),
  'utf-8'
)
const schema = makeExecutableSchema({ typeDefs, resolvers });

const graphqlConf = graphqlHTTP({
  schema: schema,
  rootValue: resolvers,
  graphiql: true
})

module.exports = { graphqlConf };