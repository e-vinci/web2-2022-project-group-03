const express = require('express');

const router = express.Router();

const { register, login } = require('../models/auth');

router.post('/register', async (req, res) => {
  const username = req?.body?.username?.length !== 0 ? req.body.username : undefined;
  const password = req?.body?.password?.length !== 0 ? req.body.password : undefined;

  if (!username || !password) return res.sendStatus(400);

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