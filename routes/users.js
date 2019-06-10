const router = require('express').Router();
const auth = require('basic-auth');
const User = require('../models').User;
const checkCredentials = require('../middlewares/checkCredentials');
const bcrypt = require('bcrypt');
const fields = [
    'firstName',
    'lastName',
    'emailAddress',
    'password'
];

router.get('/', checkCredentials, (req, res) => {
    res.status(200).json({
        status: 'OK',
        result: req.user
    });
});

router.post('/', (req, res, next) => {
    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailAddress: req.body.emailAddress,
        password: req.body.password,
    }

    User.create(userData, (err, user) => {
        if (err) {
            if (err.name === 'ValidationError') {
                fields.forEach(field => {
                    if (err.errors[field]) {
                        let error = new Error(err.errors[field].message);
                        error.status = 400;
                        return next(error);
                    }
                });
            }
            if (err.name === 'MongoError' && err.code === 11000) {
                let error = new Error('Email address is already existed.');
                error.status = 400;
                return next(error);
            }
            return next(err);
        }
        if (!user) {
            let error = new Error('Error occured during creating user');
            return next(error);
        }
        res.status(201);
        res.location('/');
        res.json();
    });
});

router.put('/', checkCredentials, (req, res, next) => {
    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailAddress: req.body.emailAddress,
        password: req.body.password
    };
    bcrypt.hash(req.body.password, 10, function (error, hash) {
        if (error) {
            return next(err);
        }

        userData.password = hash;

        const conditions = {
            _id: req.body._id
        };

        User.findOneAndUpdate(conditions, userData, {runValidators: true}, (err, user) => {
            if (err) {
                if (err.name === 'ValidationError') {
                    fields.forEach(field => {
                        if (err.errors[field]) {
                            let error = new Error(err.errors[field].message);
                            error.status = 400;
                            return next(error);
                        }
                    });
                }
                return next(err);
            }
            if (!user) {
                let error = new Error('Incorrect user id');
                error.status = 400;
                return next(error);
            }
            res.status(204).json();
        });
    });
});

module.exports = router;