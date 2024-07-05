const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema');
const graphQlResolvers = require('./graphql/resolvers');

require('dotenv').config()

const app = express();
app.use(bodyParser.json());

mongoose.connect(`${process.env.DB_URL}${process.env.DB_NAME}`);

app.use('/graphql', graphqlHTTP({
  schema: graphQlSchema,
  rootValue: graphQlResolvers,
  graphiql: true
}))

app.listen(3000, () => { console.log('App is running on port 3000!')});