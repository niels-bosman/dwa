const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    _id:         { type: String, required: true },
    description: { type: String, required: true },
    exits:       { type: [String], required: true },
  }
);

mongoose.model('Location', locationSchema);

module.exports = locationSchema;