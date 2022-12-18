const express = require('express');
const path = require("node:path");
const { authorize } = require('../utils/auth');
const { parse, serialize } = require("../utils/json");

const router = express.Router();
const jsonDbPath = path.join(__dirname, '/../data/leaderboard.json');

const MAX_LEVEL = 6;

/**
 * @returns the leaderboard sorted by time or an error if there is no time registered in the leaderboard
 */
router.post('/', (req, res) => {
    const leaderboard = parse(jsonDbPath);

    let newRepresentation = [];
    leaderboard.forEach((leaderboardElement) => {
        if (leaderboardElement.levels.length === MAX_LEVEL) {
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
        return res.status(200).json(newRepresentation); // OK
    }

    return res.status(404).json({ error: 'No leaderboard found' }); // Not Found
});

/**
 * add a new time to the leaderboard
 * @param {middleware} authorize this middleware verify if the request is authorized before allowing it to proceed
 */
router.post('/add', authorize, (req, res) => {
    const leaderboard = parse(jsonDbPath);
    const { username, level, time } = req.body;

    let leaderboardFound;
    leaderboard.forEach((leaderboardElement) => {
        if (leaderboardElement.username === username)
            leaderboardFound = leaderboardElement;
    });

    if (leaderboardFound) {
        let levelFound;
        leaderboardFound.levels.forEach((levelElement) => {
            if (levelElement.level === level)
                levelFound = levelElement;
        });
        if (levelFound) {
            if (levelFound.time > time)
                levelFound.time = time;

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
            username,
            levels: [
                {
                    level,
                    time
                }
            ]
        })
    }

    serialize(jsonDbPath, leaderboard);
    return res.sendStatus(200); // OK
});

module.exports = router;
