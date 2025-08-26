const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String, // URL for destination image
    required: true,
  },
  bestTimeToVisit: {
    type: String, // Example: "March - June"
    default: "All year",
  },
  activities: [
    {
      type: String, // Example: ["Hiking", "Beach", "Sightseeing"]
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Destination = mongoose.model("Destination", destinationSchema);

module.exports = Destination;
