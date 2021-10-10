const express         = require('express');
const promiseWrappers = require('./promise-wrappers');
const path            = require('path');
const router          = express.Router();

const gameFilesFolderName = 'game_files';

router.get('/listPlayerFiles', async (request, response) => {
  const fileList = await promiseWrappers.readdirP(gameFilesFolderName);

  return response.json(fileList);
});

router.post('/createPlayerFile', async (request, response) => {
  const player        = request.body.player;
  const fileToWriteTo = path.join(gameFilesFolderName, `${player}.json`);
  await promiseWrappers.createEmptyFileP(fileToWriteTo);

  return response.json({ name: player });
});

router.delete('/deletePlayerFile/:player', async (request, response) => {
  const player        = request.params.player;
  const fileToWriteTo = path.join(gameFilesFolderName, `${player}.json`);
  await promiseWrappers.unlinkFileP(fileToWriteTo);

  return response.json({ result: `game ${player}.json removed` });
});

module.exports = router;