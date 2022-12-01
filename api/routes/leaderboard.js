/* eslint-disable */
const express = require('express');
const path = require("node:path");
const router = express.Router();

const { parse, serialize } = require("../utils/json");

const jsonDbPath = path.join('./../data/leaderboard.json');

router.post('/{level}', (req, res) => {
  const leaderboard = parse(jsonDbPath);

  const { level } = req.query.params;

  console.log(level);
});

router.post('/{user}', (req, res) => {
  const leaderboard = parse(jsonDbPath);

  const { user } = req.query.params;

  console.log(user);
});

module.exports = router;