/* eslint-disable */
const express = require('express');
const path = require("node:path");
const router = express.Router();
const { authorize } = require('../utils/auth');

const { parse, serialize } = require("../utils/json");

const jsonDbPath = path.join(__dirname, '/../data/leaderboard.json');

const jwtSecret = 'DamsLePlusBö!';

router.post('/', (req, res) => {
  const leaderboard = parse(jsonDbPath);

  return res.status(200).json(leaderboard.sort((a, b) => a.time - b.time));
});

router.post('/add', authorize,(req, res) => {
  const leaderboard = parse(jsonDbPath);
  const { username, level, time } = req.body;

  leaderboard.push({ username, level, time });

  serialize(jsonDbPath, leaderboard);

  return res.sendStatus(200);
});

module.exports = router;
