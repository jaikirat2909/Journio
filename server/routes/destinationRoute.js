const express = require("express");
const { getDestinations } = require("../controllers/destinationController");

const router = express.Router();

// GET all destinations
router.get("/", getDestinations);

module.exports = router;
