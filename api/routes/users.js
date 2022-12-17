const express = require('express');
const path = require("node:path");
const { authorize } = require('../utils/auth');
const { parse, serialize } = require("../utils/json");

const jsonDbPath = path.join(__dirname, '/../data/levels.json');

const router = express.Router();

/**
 * set the level of the specified user to the next level
 * @param {midlleware} authorize this middleware verify if the request is authorized before allowing it to proceed
 */
// eslint-disable-next-line consistent-return
router.post('/set', authorize, (req, res) => {
    const { username } = req.user;

    if (!username) return res.status(400).json({ error: 'Username missing !' }); // Bad Request

    const levels = parse(jsonDbPath);

    levels.forEach((element) => {
        if (element.username === username) {
            // eslint-disable-next-line no-param-reassign
            element.level += 1;
        }
    });

    serialize(jsonDbPath, levels);
    return res.sendStatus(200); // OK
});

/**
 * get the level of the specified user
 * @param {midlleware} authorize this middleware verify if the request is authorized before allowing it to proceed
 * @returns the level at wich he user is or level 1 if the user has never played
 */
// eslint-disable-next-line consistent-return
router.post('/get', authorize, (req, res) => {
    const { username } = req.user;

    if (!username) return res.status(400).json({ error: 'Username missing !' }); // Bad Request

    const levels = parse(jsonDbPath);

    let found;
    // eslint-disable-next-line consistent-return
    levels.forEach((level) => {
        if (level.username === username) {
            found = level;
        }
    });

    if (found) {
        return res.status(200).json(found); // OK
    }
    const newLevel = {
        username,
        level: 1,
    };
    levels.push(newLevel);
    serialize(jsonDbPath, levels);
    return res.status(200).json(newLevel); // OK
});

/**
 * reset the level of the specified user to level 1
 * @returns level 1
 */
router.post('/reset', (req, res) => {
    const { username } = req.body;

    if (!username) return res.status(400).json({ error: 'Username missing !' }); // Bad Request

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
        return res.status(200).json(newLevel); // OK
    }
})

module.exports = router;
