/* eslint-disable */
const express = require('express');

const router = express.Router();
const path = require("node:path");

const { parse, serialize} = require("../utils/json");

const jsonDbPath = path.join(__dirname, '/../data/levels.json');
// eslint-disable-next-line consistent-return
router.post('/set', (req, res) => {
    const { username } = req.body;

    if (!username) return res.status(400).json({ error: 'Username missing !' });

    const levels = parse(jsonDbPath);

    levels.forEach((element) => {
        if (element.username === username) {
            // eslint-disable-next-line no-param-reassign
            element.level += 1;
        }
    });

    serialize(jsonDbPath, levels);
});

// eslint-disable-next-line consistent-return
router.post('/get', (req, res) => {
    const { username } = req.body;

    if (!username) return res.status(400).json({ error: 'Username missing !' });

    const levels = parse(jsonDbPath);

    let found;
    // eslint-disable-next-line consistent-return
    levels.forEach((level) => {
        if (level.username === username) {
            found = level;
        }
    });

    if (found) {
        return res.status(200).json(found);
    } else {
        const newLevel = {
            username,
            level: 1,
        };
        levels.push(newLevel);
        serialize(jsonDbPath, levels);
        return res.status(200).json(newLevel);
    }
});

router.post('/reset', (req, res) => {
    const { username } = req.body;

    if (!username) return res.status(400).json({ error: 'Username missing !'});

    const levels = parse(jsonDbPath);

    let found;
    // eslint-disable-next-line consistent-return
    levels.forEach((level) => {
        if (level.username === username) {
            found = level;
        }
    });

    if (found) {
        const index = levels.indexOf(found);
        levels.splice(index, 1);
        found.level = 1;
        levels.push(found);
        serialize(jsonDbPath, levels);
    } else {
        const newLevel = {
            username,
            level: 1,
        };
        levels.push(newLevel);
        serialize(jsonDbPath, levels);
        return res.status(200).json(newLevel);
    }
})

module.exports = router;
