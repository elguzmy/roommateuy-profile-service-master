const apiRoutes = require('express').Router();

const profileRouter = require('./profile');
const healthRouter = require('./health');

const config = require('../lib/config');

apiRoutes.use(`/${config.profileAPI.url}`, profileRouter);
apiRoutes.use('/profileHealth', healthRouter);

module.exports = apiRoutes;
