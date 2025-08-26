const Destination = require("../models/Destination");

// @desc   Get all destinations
// @route  GET /api/destinations
// @access Public
const getDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find({});
    res.status(200).json(destinations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDestinations };
