const router = require('express').Router();
const auth = require('basic-auth');
const Course = require('../models').Course;
const checkCredentials = require('../middlewares/checkCredentials');

router.get('/', checkCredentials, (req, res, next) => {
    Course.find({user: req.user._id})
        .exec((err, courses) => {
            if (err) {
                return next(err);
            }

            res.status(200).json({
                status: 'OK',
                results: courses
            });
        });
});

router.post('/', (req, res) => {

});

router.get('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

module.exports = router;