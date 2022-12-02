const jwt = require('jsonwebtoken');
const path = require('node:path');
const bcrypt = require('bcrypt');
const { parse, serialize } = require('../utils/json');


const jwtSecret = 'DamsLePlusBö!';
const lifetimeJwt = 24 * 60 * 60 * 1000; // in ms : 24 * 60 * 60 * 1000 = 24h

const saltRounds = 10;

const jsonDbPath = path.join(__dirname, '/../data/users.json');

const defaultUsers = [
  {
    id: 1,
    username: 'michele',
    password: bcrypt.hashSync('michele', saltRounds),
  },
];

async function login(username, password) {
  const userFound = readOneUserFromUsername(username);
  if (!userFound) return undefined;

  const passwordMatch = await bcrypt.compare(password, userFound.password);
  if (!passwordMatch) return undefined;

  const token = jwt.sign(
    { username }, // session data added to the payload (payload : part 2 of a JWT)
    jwtSecret, // secret used for the signature (signature part 3 of a JWT)
    { expiresIn: lifetimeJwt }, // lifetime of the JWT (added to the JWT payload)
  );

  const authenticatedUser = {
    username,
    token,
  };

  return authenticatedUser;
}

async function register (username, password) {
  const userFound = readOneUserFromUsername(username);
  if (userFound) return undefined;

  await createOneUser(username, password);

  const token = jwt.sign(
    { username },
    jwtSecret,
    { expiresIn: lifetimeJwt},
  );
  const authenticatedUser = {
    username,
    token,
  };

  return authenticatedUser;
};

function readOneUserFromUsername(username) {
  const users = parse(jsonDbPath, defaultUsers);
  const indexOfUserFound = users.findIndex((user) => user.username === username);
  if (indexOfUserFound < 0) return undefined;

  return users[indexOfUserFound];
};

async function createOneUser(username, password) {
  const auth = parse(jsonDbPath, defaultUsers);

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const createdUser = {
    id: getNextId(),
    username,
    password: hashedPassword,
  };

  auth.push(createdUser);

  serialize(jsonDbPath, auth);

  return createdUser;
}

function getNextId() {
  const auth = parse(jsonDbPath, defaultUsers);
  const lastIndex = auth?.length !== 0 ? auth.length - 1 : undefined;
  if (lastIndex === undefined) return 1;
  const lastId = auth[lastIndex]?.id;
  const nextId = lastId + 1;
  return nextId;
}

module.exports = {
  login,
  register,
  readOneUserFromUsername,
};