require('dotenv').config();


const PORT = 3000;
const express = require('express');
const server = express();
const jwt = require('jsonwebtoken');


const apiRouter = require('./api');
const { client } = require('./db');
client.connect();

server.listen(
    PORT,
    () => {
        console.log('The server is up on port ', PORT)
    }
);

const bodyParser = require('body-parser');
server.use(bodyParser.json());



const morgan = require('morgan');
server.use(morgan('dev'));

server.get('/add/:first/to/:second', (req,res,next) => {
    res.send(`<h1>${req.params.first} + ${req.params.second} = ${Number(req.params.first)+ Number(req.params.second)}`)
})

server.use(
    (req, res, next) => {
        console.log('...Body logger start...')
        console.log(req.body)
        console.log('...body logger end...')
       
        next();
    }
);

server.use('/api', apiRouter);


