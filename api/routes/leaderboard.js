/* eslint-disable */
const express = require('express');
const path = require("node:path");
const router = express.Router();

const { parse, serialize } = require("../utils/json");

const jsonDbPath = path.join(__dirname, '/../data/leaderboard.json');

router.post('/', (req, res) => {
  const leaderboard = parse(jsonDbPath);

  return res.json(leaderboard.sort((a, b) => a.time - b.time));
});

router.post('/levels/:levelId', (req, res) => {
  const leaderboard = parse(jsonDbPath);

  const { levelId } = req.params;

  return res.json(leaderboard.filter((element) => element.level === levelId).sort((a, b) => a.time - b.time));
});

router.post('/users/:user_id', (req, res) => {
  const leaderboard = parse(jsonDbPath);

  const { user_id } = req.params;

  return res.json(leaderboard.filter((element) => element.user_id === user_id).sort((a, b) => a.time - b.time));
});

module.exports = router;
