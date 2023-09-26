const request = require('request-promise');

const config = require('./config');
const { error } = require('./errorManagement');

const isAuthenticated = (req, res, next) => {
    const { headers: { authorization } } = req;
    const authorizationData = authorization && authorization.split(' ');

    if (authorizationData && authorizationData[0] && authorizationData[0].toLowerCase() === 'bearer' && authorizationData[1]) {
        request.post({
            uri: `${config.authEndpoint}/verifyToken`,
            body: { token: authorizationData[1] },
            json: true,
        })
            .then((data) => {
                if (!req.user && data && data.tokenPayload) {
                    req.user = data.tokenPayload;
                }

                next();
            })
            .catch(err => {
                if (err.response && err.response.body) {
                    const { body: { message, errorCode } } = err.response;

                    next(error({
                        message: message,
                        errorCode: errorCode,
                        statusCode: 401
                    }));
                } else {
                    next(error({
                        message: 'Unauthorized',
                        errorCode: 'ERR_UNAUTHORIZED',
                        statusCode: 401
                    }));
                }
            });
    } else {
        next(error({ message: 'Unauthorized', errorCode: 'ERR_UNAUTHORIZED', statusCode: 401 }));
    }
};

module.exports = {
    isAuthenticated,
};