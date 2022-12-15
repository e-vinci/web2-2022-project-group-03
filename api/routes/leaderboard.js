/* eslint-disable */
const express = require('express');
const path = require("node:path");
const router = express.Router();

const { parse, serialize } = require("../utils/json");

const jsonDbPath = path.join(__dirname, '/../data/leaderboard.json');

router.post('/', (req, res) => {
    const leaderboard = parse(jsonDbPath);

    let newRepresentation = [];
    leaderboard.forEach((leaderboardElement) => {
        if (leaderboardElement.levels.length === 2) {
            leaderboardElement.levels.forEach((level) => {
                let representationFound;
                newRepresentation.forEach((element) => {
                    if (element.username === leaderboardElement.username) {
                        representationFound = element;
                    }
                });
                if (representationFound) {
                    const index = newRepresentation.indexOf(representationFound);
                    newRepresentation.splice(index, 1);
                    representationFound.time += level.time;
                    newRepresentation.push(representationFound);
                } else {
                    newRepresentation.push({
                        username: leaderboardElement.username,
                        time: level.time,
                    });
                }
            });
        }
    });

    if (newRepresentation) {
        newRepresentation = newRepresentation.sort((a, b) => a.time - b.time);

        console.log(newRepresentation);

        return res.status(200).json(newRepresentation);
    } else {
        return res.status(404).json({ error: 'No leaderboard found' });
    }
});

router.post('/add', (req, res) => {
    const leaderboard = parse(jsonDbPath);
    const { username, level, time } = req.body;

    let leaderboardFound;
    leaderboard.forEach((leaderboardElement) => {
        if (leaderboardElement.username === username) {
            leaderboardFound = leaderboardElement;
        }
    });

    if (leaderboardFound) {
        let levelFound;
        leaderboardFound.levels.forEach((levelElement) => {
            if (levelElement.level === level) {
                levelFound = levelElement;
            }
        });
        if (levelFound) {
            if (levelFound.time > time) {
                levelFound.time = time;
            }
            const index = leaderboardFound.levels.indexOf(levelFound);
            leaderboardFound.levels.splice(index, 1);
            leaderboardFound.levels.push(levelFound);
        } else {
            leaderboardFound.levels.push({ level, time });
        }
        const index = leaderboard.indexOf(leaderboardFound);
        leaderboard.splice(index, 1);
        leaderboard.push(leaderboardFound);
    } else {
        leaderboard.push({
            username: username,
            levels: [
                {
                    level: level,
                    time: time
                }
            ]
        })
    }

    serialize(jsonDbPath, leaderboard);
    return res.sendStatus(200);
});

module.exports = router;
