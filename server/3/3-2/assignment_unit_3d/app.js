'use strict';

const express = require('express');
const games   = require('./games.js');
const actions = require('./actions.js');

const app = express();

app.use(express.json());
app.use('/', games);
app.use('/action', actions);

const server = app.listen(3000, () => {
  console.log(`game server started on port ${server.address().port}`);
});