const mongoose       = require('mongoose');
const LocationSchema = require('./location');

const playerSchema = new mongoose.Schema(
  {
    _id:             { type: String, required: true },
    name:            { type: String, required: true },
    items:           { type: [String], required: true },
    currentLocation: { type: String, required: true },
    map:             { type: [LocationSchema], required: true }
  }
);

playerSchema.methods.getLocationInformation = function () {
  return this.map.find(({ _id }) => _id === this.currentLocation);
};

const Location = mongoose.model('Location');

playerSchema.methods.goToLocation = async function (newLocationName) {
  const current = this.getLocationInformation();

  if (!current.exits.includes(newLocationName)) {
    throw new Error(`Je kunt niet via ${current._id} naar ${newLocationName}`);
  }

  const location       = await Location.findById(newLocationName);
  this.currentLocation = location._id;

  // Push the new location to map if not yet discovered.
  if (!this.getLocationInformation()) {
    this.map.push(location);
  }

  this.save();

  return this.getLocationInformation();
};

mongoose.model('Player', playerSchema);
