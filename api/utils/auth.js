const jwt = require('jsonwebtoken');
const { readOneUserFromUsername } = require('../models/auth');

const jwtSecret = 'DamsLePlusBö!';

/**
 *  verifiy if the user who emit the request has the write to do so
 * @returns allow the request to proceed or return an error if the user is unallowed
 */
const authorize = (req, res, next) => {
    const token = req.get('authorization');

    if (!token) return res.sendStatus(401); // unauthorized

    try {
        const decoded = jwt.verify(token, jwtSecret);
        const { username } = decoded;

        const existingUser = readOneUserFromUsername(username);

        if (!existingUser) return res.sendStatus(401); // unauthorized

        req.user = existingUser;
        return next();
    } catch (err) {
        // eslint-disable-next-line
        console.error('authorize: ', err);
        return res.sendStatus(401); // unauthorized
    }
};

module.exports = { authorize };
