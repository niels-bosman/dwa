const express         = require('express');
const promiseWrappers = require('../promise-wrappers');
const path            = require('path');
const Game            = require('../game');
const router          = express.Router();

const folder = 'game_files';

const gameFileReader = async (request, response, next) => {
  try {
    if (!request.session.hasOwnProperty('player')) {
      return next(new Error('Er is nog geen speler ingelogd.'));
    }

    const filename      = path.join(folder, `${request.session.player}.json`);
    request.fileContent = await promiseWrappers.readFileP(filename);
  } catch (error) {
    return next(error);
  }

  return next();
};

const gameStateReader = async (request, response, next) => {
  try {
    request.game = new Game(JSON.parse(request.fileContent));
  } catch (error) {
    return next(error);
  }

  return next();
};

const errorHandling = (error, request, response, next) => {
  if (error.code === 'ENOENT') {
    return response.status(401).send('Deze speler is niet gevonden.');
  }

  return response.status(500).send(error.message ?? 'Er is iets fout gegaan');
};

router.use('/where', [gameStateReader, gameFileReader]);
router.use('/goto', [gameStateReader, gameFileReader]);
router.use(errorHandling);

router.get('/where', async (request, response) => {
  const locationInformation = await request.game.getLocationInformation();

  return response.status(200).json(locationInformation);
});

router.post('/goto', async (request, response) => {
  const { location } = request.query;
  const description  = await request.game.goToLocation(location);
  const filename     = path.join(folder, `${request.session.player}.json`);

  await promiseWrappers.writeFileP(filename, JSON.stringify(request.game.state));

  return response.status(200).json(description);
});

router.post('/arise', async (request, response) => {
  const { start, inventory } = request.body;
  const { player }           = request.session;

  const game        = new Game();
  const description = await game.startNew(start, inventory);
  const filename    = path.join(folder, `${player}.json`);

  await promiseWrappers.writeFileP(filename, JSON.stringify(game.state));

  return response.status(200).send(description);
});

module.exports = router;