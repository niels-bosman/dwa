let game = {};

let player = {
  location: 'town',
  items:    []
};

let map = {
  forest:   {
    description: 'a forest',
    items:       ['mushroom'],
    exits:       ['town']
  },
  town:     {
    description: 'a town',
    items:       ['coin', 'sword', 'axe'],
    exits:       ['forest', 'mountain']
  },
  mountain: {
    description: 'a mountain range',
    items:       [],
    exits:       ['town']
  }
};

/**
 * Returns the items the player is carrying.
 * @returns {Array}
 */
game.getInventory = () => player.items;

/**
 * Returns the list of items at the player's current location.
 * @returns {Array}
 */
game.getItems = () => map[player.location].items;

/**
 * Returns an object containing the description and the
 * exits of the players current location on the map.
 * @returns {Object}
 */
game.getLocationInformation = () => {
  const { description, exits } = map[player.location];

  return { description, exits };
};

/**
 * Checks if there is a connection between the player current location
 * and the location represented by the given locationName and moves the
 * player to that location.
 * Otherwise it changes nothing.
 *
 * @param {String} locationName - The name of the location the player wants to move to.
 * @returns {String} - The location the player is in after executing this function
 */
game.goToLocation = (locationName) => {
  const currentLocation = game.getLocationInformation();

  if (currentLocation.exits.includes(locationName)) {
    player.location = locationName;
  }

  return player.location;
};

/**
 * Checks if the item with the given itemName is in the list of
 * items of the player's current location and transfers it to the player.
 * Otherwise it changes nothing.
 *
 * @param {String} itemName - The name of the item.
 * @returns {String} - The name of the item that was taken. If nothing was taken, it returns
 * the string 'nothing'
 */
game.takeItem = (itemName) => {
  const items = map[player.location].items;

  if (!items.includes(itemName)) {
    return 'nothing';
  }

  // Remove the item from the location and add it to the player.
  map[player.location].items = items.filter(value => value !== itemName);
  player.items.push(itemName);

  return itemName;
};

module.exports = game;