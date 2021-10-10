'use strict';

const mongoose = require('mongoose');
require('../model/player.js');

const express = require('express');
const router  = express.Router();

const Player = mongoose.model('Player');

router.get('/:player/where', async (request, response) => {
  const player                 = await Player.findById(request.params.player);
  const { description, exits } = player.getLocationInformation();

  return response.status(200).json({ description, exits });
});

router.put('/:player/goto', async (request, response) => {
  const player = await Player.findById(request.params.player);

  try {
    const { description } = await player.goToLocation(request.query.location);
    return response.status(200).json(description);
  } catch ({ message }) {
    return response.status(403).send(message || 'Er is iets fout gegaan');
  }
});


module.exports = router;