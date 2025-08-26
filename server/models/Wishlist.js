const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      destinationId: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: true },
      name: String,
      image: String,
      description: String,
      price: Number
    }
  ]
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
