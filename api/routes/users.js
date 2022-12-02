const express = require('express');

const router = express.Router();
const path = require("node:path");

const { parse } = require("../utils/json");

const jsonDbPath = path.join(__dirname, '/../data/levels.json');
// eslint-disable-next-line consistent-return
router.post('/set', (req, res) => {
  const { username, level } = req.body;

  if (!username) return res.status(400).json({ error: 'Username missing !' });

  const levels = parse(jsonDbPath);

  levels.forEach((element) => {
    if (element.username === username) {
      // eslint-disable-next-line no-param-reassign
      element.level = level;
    }
  });
});

// eslint-disable-next-line consistent-return
router.post('/get', (req, res) => {
  const { username } = req.body;

  if (!username) return res.status(400).json({ error: 'Username missing !' });

  const levels = parse(jsonDbPath);

  // eslint-disable-next-line consistent-return
  levels.forEach((level) => {
    if (level.username === username) {
      return res.status(200).json(level);
    }
  });
});

module.exports = router;