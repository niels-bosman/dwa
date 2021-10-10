const fetch = require('node-fetch');

let game = {};

let player = {
  location: 'town',
  items:    []
};

let map = {
  town: {
    description: 'a town',
    exits:       ['forest', 'mountain']
  }
};
/**
 * Checks if there is a connection between the player current location
 * and the location represented by the give locationName and moves the
 * player to that location.
 * Otherwise it does nothing.
 *
 * If this destination location is already visited, the local copy is
 * loaded (e.g. the one in the map variable)
 * Otherwise a request for this location is issued to the server and the
 * response is added to the local copy of the map.
 *
 * @async
 * @param {String} locationName - The name of the location the player wants to move to.
 *
 * @returns {Promise} Promise object holding the name of the location the player is.
 *
 */
game.goToLocation = locationName => {
  return new Promise((resolve, reject) => {
    game.getLocationInformation().then(result => {
      if (result.exits.includes(locationName)) {
        fetch(`http://localhost:3000/${locationName}`)
          .then(response => response.json())
          .then(data => {
              if (!(locationName in map)) map[locationName] = data;

              player.location = locationName;
              resolve(data.description);
            }
          );
      } else {
        reject('This location could not be found.');
      }
    });
  });
};

/**
 * Returns an object containing the description and the
 * exits of the players current location on the map.
 *
 * @returns {Promise} Promise object containing the location information object.
 */
game.getLocationInformation = () => {
  return new Promise(resolve => {
    const { description, exits } = map[player.location];

    return resolve({ description, exits });
  });
};

module.exports = game;
