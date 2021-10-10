'use strict';

const express = require('express');
const session = require('express-session');
const games   = require('./routes/games.js');
const actions = require('./routes/actions.js');
const players = require('./routes/players.js');

const app = express();

app.use(express.json());
app.use(session({ resave: true, saveUninitialized: true, secret: 'ica-adventures' }));
app.use('/player-file', games);
app.use('/', players);
app.use('/action', actions);

const server = app.listen(3000, () => {
  console.log(`game server started on port ${server.address().port}`);
});