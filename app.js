const express = require('express');
const nocache = require('nocache');
const util = require('util');
const cors = require('cors');

const profileAPI = require('./api');
const config = require('./lib/config');
const logger = require('./lib/utils/logger');
const { notFound } = require('./lib/errorManagement');

const app = express();

// Setup global app config
app.set('x-powered-by', false);

// Typical body parsers
app.use(express.json());

//Allow access control
app.use(cors());

// MIDDLEWARES
if (app.get('env') === 'development') {
    app.set('etag', false);
    app.use(nocache());
}

app.use((req, res, next) => {
    res.header('X-Service-Name', config.serviceName);
    next();
});

// ROUTES
app.use(`/${config.profileAPI.root}/${config.profileAPI.version}`, profileAPI);

// ERRORS HANDLER

// / catch 404 and forwarding to error handler
app.use((req, res, next) => {
    next(notFound({ message: 'Not Found' }));
});

app.use((err, req, res, next) => {
    logger.log('error', util.inspect(err, { depth: 5 , colors: true }));

    res.status(err.statusCode || err.status || 500).json(err);
    next();
});

module.exports = app;
