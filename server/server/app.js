const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('../schema/schema');
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();
const PORT = 3005;

mongoose.connect('mongodb://localhost/tutor', { useNewUrlParser: true }).then(() => {
console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});

app.use(cors())

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

// const dbConnection = mongoose.connection;
// dbConnection.on('error', err => console.log(`Connection error: ${err}`));
// dbConnection.once('open', () => console.log('Connected'));

app.listen(PORT, err => {
    err ? console.log(error) : console.log('Server started!');
})