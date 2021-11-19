'use strict';

const { graphql, buildSchema } = require('graphql');

const schema = buildSchema(`
    type Query {
        hello: String
    }
`)


const resolvers = {
    hello: () => {
        return 'Hello world'
    }
}

graphql(schema, '{hello}', resolvers).then((data) => {
    console.log(data);
}).catch(console.log)