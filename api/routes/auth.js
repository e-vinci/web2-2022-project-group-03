const express = require('express');

const router = express.Router();

const path = require("node:path");

const { register, login } = require('../models/auth');
const { parse } = require("../utils/json");

const jsonDbPath = path.join(__dirname, '/../data/users.json');

router.post('/register', async (req, res) => {
  const username = req?.body?.username?.length !== 0 ? req.body.username : undefined;
  const password = req?.body?.password?.length !== 0 ? req.body.password : undefined;

  if (!username || !password) return res.sendStatus(400);

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
