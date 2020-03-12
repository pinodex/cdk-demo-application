const express = require('express');
const bodyParser = require('body-parser');

const app = require('./index');

const server = express();

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use(app.handler);

server.listen(process.env.PORT || 3000);
