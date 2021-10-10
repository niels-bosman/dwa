'use strict';

const express         = require('express');
const Game            = require('./game.js');
const promiseWrappers = require('./promise-wrappers');
const path            = require('path');
const bodyParser      = require('body-parser');
const game            = require('./game.js');

const app = express();

const gameFilesFolderName = 'game_files';

app.get('/action/:player/where', async (req, res) => {
  const game                = await getGameInformation(req.params.player);
  const locationInformation = await game.getLocationInformation();

  res.json(locationInformation);
});

app.post('/action/:player/goto', async (req, res) => {
  const game = await getGameInformation(req.params.player);

  const desiredLocation = req.query.location;
  const location        = await game.goToLocation(desiredLocation);
  const fileToWriteTo   = path.join(gameFilesFolderName, `${req.params.player}.json`);
  await promiseWrappers.writeFileP(fileToWriteTo, JSON.stringify(game.state));

  res.json(location);
});

const server = app.listen(3000, () => {
  console.log(`game server started on port ${server.address().port}`);
});

const getGameInformation = async player => {
  const fileName    = path.join(gameFilesFolderName, `${player}.json`);
  const fileContent = await promiseWrappers.readFileP(fileName);
  const gameState   = JSON.parse(fileContent);
  return new Game(gameState);
};