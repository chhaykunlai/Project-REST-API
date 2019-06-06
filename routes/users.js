const router = require('express').Router();
const User = require('../models').User;

router.get('/', (req, res) => {
    console.log(User);
    User.findOne({})
        .exec((err, user) => {
            res.status(200).json({
                status: 'OK',
                result: user
            });
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
            return next(err);
        }
        if (!user) {
            let error = new Error('Error occured during creating user');
            error.status = 401;
            return next(error);
        }
        res.status(201);
        res.location('/');
        res.json({});
    });
});

module.exports = router;