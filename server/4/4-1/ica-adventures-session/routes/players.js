const express         = require('express');
const path            = require('path');
const promiseWrappers = require('../promise-wrappers');
const router          = express.Router();

const playerFilesFolder = 'player_files';

router.post('/register', async (request, response) => {
  const { player, password } = request.body;
  const filename             = path.join(playerFilesFolder, `${player}.json`);

  await promiseWrappers.writeFileP(filename, JSON.stringify({ password }));

  return response.status(200).send();
});

router.post('/login', async (request, response) => {
  const { player, password } = request.body;

  try {
    let file = await promiseWrappers.readFileP(`${playerFilesFolder}/${player}.json`);
    file     = await JSON.parse(file);

    if (file?.password !== password) {
      delete request.session.player;
      return response.status(401).send();
    }
  } catch {
    return response.status(401).send();
  }

  request.session.player = player;
  return response.status(200).send();
});

router.post('/logout', (request, response) => {
  delete request.session.player;
  return response.status(200).send();
});

module.exports = router;