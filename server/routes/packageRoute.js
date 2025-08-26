const express = require("express");
const router = express.Router();
const packageController = require("../controllers/packageController");

// GET all packages
router.get("/", packageController.getAllPackages);

module.exports = router;
