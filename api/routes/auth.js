const express = require('express');

const router = express.Router();

const path = require("node:path");

const Checker = require('password-checker');

const { register, login } = require('../models/auth');
const { parse } = require("../utils/json");

const jsonDbPath = path.join(__dirname, '/../data/users.json');

router.post('/register', async (req, res) => {
  const username = req?.body?.username?.length !== 0 ? req.body.username : undefined;
  const password = req?.body?.password?.length !== 0 ? req.body.password : undefined;

  if (!username || !password) return res.sendStatus(400);

  const checker = new Checker();
  checker.min_length = 8;
  checker.disallowPasswords(true, true, 3);

  if (!checker.check(password)) {
    const errors = [];
    checker.errors.forEach((error) => {
      errors.push({ error: error.message });
    });
    return res.json({ errors });
  }

  const users = parse(jsonDbPath);

  // eslint-disable-next-line consistent-return
  users.forEach((user) => {
    if (user.username === username) return res.sendStatus(409);
  });

  const authenticatedUser = await register(username, password);

  if (!authenticatedUser) return res.sendStatus(401);

  return res.json(authenticatedUser);
});

router.post('/login', async (req, res) => {
  const username = req?.body?.username?.length !== 0 ? req.body.username : undefined;
  const password = req?.body?.password?.length !== 0 ? req.body.password : undefined;

  if (!username || !password) return res.sendStatus(400);

  const authenticatedUser = await login(username, password);

  if (!authenticatedUser) return res.sendStatus(401);

  return res.json(authenticatedUser);
});

module.exports = router;
