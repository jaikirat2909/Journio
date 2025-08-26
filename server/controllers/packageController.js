const Package = require("../models/packageModel");

exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find(); // get all packages
    res.status(200).json(packages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
