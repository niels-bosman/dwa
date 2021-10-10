const express         = require('express');
const promiseWrappers = require('./promise-wrappers');
const path            = require('path');
const Game            = require('./game');
const router          = express.Router();

const gameFilesFolderName = 'game_files';

const gameFileReader = async (request, response, next) => {
  try {
    const fileName      = path.join(gameFilesFolderName, `${request.params.player}.json`);
    request.fileContent = await promiseWrappers.readFileP(fileName);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return response.status(401).send('Deze speler is niet gevonden.');
    }

    return response.status(500).send('Something went wrong.');
  }

  return next();
};

router.use('/:player/where', gameFileReader);
router.use('/:player/goto', gameFileReader);

const gameStateReader = async (request, response, next) => {
  try {
    request.game = new Game(JSON.parse(request.fileContent));
  } catch (error) {
    return next(error);
  }

  return next();
};

router.use('/:player/where', gameStateReader);
router.use('/:player/goto', gameStateReader);

router.get('/:player/where', async (request, response) => {
  console.log(request.game);
  const locationInformation = await request.game.getLocationInformation();

  return response.json(locationInformation);
});

router.post('/:player/goto', async (request, response) => {
  const desiredLocation = request.query.location;
  const location        = await request.game.goToLocation(desiredLocation);
  const fileToWriteTo   = path.join(gameFilesFolderName, `${request.params.player}.json`);
  await promiseWrappers.writeFileP(fileToWriteTo, JSON.stringify(request.game.state));

  return response.json(location);
});

router.post('/:player/arise', async (request, response) => {
  const { start, inventory } = request.body;
  const player               = request.params.player;

  if (!start || !inventory) return response.send('Error!');

  const game          = new Game();
  const description   = await game.startNew(start, inventory);
  const fileToWriteTo = path.join(gameFilesFolderName, `${player}.json`);
  await promiseWrappers.writeFileP(fileToWriteTo, JSON.stringify(game.state));

  return response.send(description);
});

module.exports = router;