const express         = require('express');
const promiseWrappers = require('../promise-wrappers');
const path            = require('path');
const router          = express.Router();

const folder = 'game_files';

router.get('/', async (request, response) => {
  const fileList = await promiseWrappers.readdirP(folder);

  return response.status(200).json(fileList);
});

router.post('/', async (request, response) => {
  const { player } = request.body;
  const filename   = path.join(folder, `${player}.json`);

  await promiseWrappers.createEmptyFileP(filename);

  return response.status(201).json({ name: player });
});

router.delete('/:player', async (request, response) => {
  const { player } = request.params;
  const filename   = path.join(folder, `${player}.json`);

  await promiseWrappers.unlinkFileP(filename);

  return response.status(200).json({ result: `game ${player}.json removed` });
});

module.exports = router;