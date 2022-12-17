const jwt = require('jsonwebtoken');
const path = require('node:path');
const bcrypt = require('bcrypt');
const { parse, serialize } = require('../utils/json');

const jwtSecret = 'DamsLePlusBö!';

const lifetimeJwt = 24 * 60 * 60 * 1000; // in ms : 24 * 60 * 60 * 1000 = 24h

const saltRounds = 10;

const jsonDbPath = path.join(__dirname, '/../data/users.json');

// Default user
const defaultUsers = [
    {
        id: 1,
        username: 'michele',
        password: bcrypt.hashSync('michele', saltRounds),
    },
];

/**
 * Logs a user in
 * @param {string} username The username of the user to log in
 * @param {string} password The password of the user to log in
 * @returns The token of the user and the username, or undefined if login failed
 */
async function login(username, password) {
    const userFound = readOneUserFromUsername(username);
    if (!userFound) return undefined;

    const passwordMatch = await bcrypt.compare(password, userFound.password);
    if (!passwordMatch) return undefined;

    const token = jwt.sign(
        { username },
        jwtSecret,
        { expiresIn: lifetimeJwt },
    );

    const authenticatedUser = {
        username,
        token,
    };

    return authenticatedUser;
};

/**
 * Registers a new user
 * @param {string} username The username of the new user
 * @param {string} password The password of the new user
 * @returns The token of the new user and the username or undefined if the user already exists
 */
async function register(username, password) {
    const userFound = readOneUserFromUsername(username);
    if (userFound) return undefined;

    await createOneUser(username, password);

    const token = jwt.sign(
        { username },
        jwtSecret,
        { expiresIn: lifetimeJwt },
    );
    const authenticatedUser = {
        username,
        token,
    };

    return authenticatedUser;
};

/**
 * search a user from the database by username
 * @param {string} username The username of the user to look for
 * @returns The user or undefined if no user with the given username was found
 */
function readOneUserFromUsername(username) {
    const users = parse(jsonDbPath, defaultUsers);
    const indexOfUserFound = users.findIndex((user) => user.username === username);
    if (indexOfUserFound < 0) return undefined;

    return users[indexOfUserFound];
};

/**
 * Creates a new user
 * @param {string} username The username of the new user
 * @param {string} password The password of the new user
 * @returns The newly created user
 */
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

/**
 * Generates the next ID for a new user
 * @returns The next ID for a new user
 */
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
