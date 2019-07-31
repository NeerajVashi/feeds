/* eslint-disable no-console */

const express = require('express');

const app = express();

const cors = require('cors');


require('dotenv').config();


app.use(require('express-session')({
  secret: 'Virat is the best',
  resave: false,
  saveUninitialized: false,
}));

app.use(cors());

const post = require('./routes/route');


app.use('/', post);


app.listen(process.env.PORT || 4000);

module.exports = app;
