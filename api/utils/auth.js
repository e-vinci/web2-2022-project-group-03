const jwt = require('jsonwebtoken');
const { readOneUserFromUsername } = require('../models/auth');

const jwtSecret = 'DamsLePlusBö!';

const authorize = (req, res, next) => {
  const token = req.get('authorization');

  if (!token) return res.sendStatus(401); // unauthorized

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const { username } = decoded;

    const existingUser = readOneUserFromUsername(username);

    if (!existingUser) return res.sendStatus(401); // unauthorized

    req.user = existingUser; // request.user object is available in all other middleware functions
    return next();
  } catch (err) {
    // eslint-disable-next-line
    console.error('authorize: ', err);
    return res.sendStatus(401);
  }
};

module.exports = { authorize };
