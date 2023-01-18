const express = require("express");
const router = express.Router();
const path = require("path");

const config = require("../config/config");

const commandRoutes = require("./command.route");

router.use("/command", commandRoutes);

module.exports = router;
