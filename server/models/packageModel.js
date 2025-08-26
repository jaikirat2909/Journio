const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  airline: { type: String, required: true },
  departure: { type: String, required: true },
  arrival: { type: String, required: true },
  duration: { type: String, required: true },
});

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  amenities: [{ type: String }],
});

const packageSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  image: { type: String, required: true },
  includes: [{ type: String }],
  flightDetails: { type: flightSchema, required: true },
  hotelDetails: { type: hotelSchema, required: true },
  dates: [{ type: String }],
  destinationId: { type: Number, required: true } // link to destination
});

module.exports = mongoose.model('Package', packageSchema);
