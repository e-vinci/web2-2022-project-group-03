const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const corsOptions = {
    origin: ['http://localhost:8080', 'https://e-vinci.github.io'],
}

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const leaderboardRouter = require('./routes/leaderboard');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/auth', cors(corsOptions), authRouter);
app.use('/users', cors(corsOptions), usersRouter);
app.use('/leaderboard', cors(corsOptions), leaderboardRouter);

module.exports = app;
