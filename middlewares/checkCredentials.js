const auth = require('basic-auth');
const User = require('../models').User;

const checkCredentials = (req, res, next) => {
    const credentials = auth.parse(req.get('Authorization'));
    if (!credentials) {
        let noCredentialError = new Error('Email and password are required');
        noCredentialError.status = 401;
        return next(noCredentialError);
    }
    User.authenticate(credentials.name, credentials.pass, (err, user) => {
        if (err || !user) {
            let notMatchError = new Error('Email and password are not matched');
            notMatchError.status = 401;
            return next(notMatchError);
        }
        req.user = user;
        return next();
    });
};

module.exports = checkCredentials;