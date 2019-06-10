const router = require('express').Router();
const auth = require('basic-auth');
const Course = require('../models').Course;
const checkCredentials = require('../middlewares/checkCredentials');
const fields = [
    'title',
    'description'
];

router.get('/', checkCredentials, (req, res, next) => {
    Course.find({user: req.user._id})
        .exec((err, courses) => {
            if (err) {
                return next(err);
            }

            res.status(200).json({
                status: 'OK',
                results: {
                    courses: courses
                }
            });
        });
});

router.post('/', checkCredentials, (req, res, next) => {
    const courseData = {
        user: req.user._id,
        title: req.body.title,
        description: req.body.description,
        estimatedTime: req.body.estimatedTime,
        materialsNeeded: req.body.materialsNeeded
    };

    Course.create(courseData, (err, course) => {
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
        if (!course) {
            let error = new Error('Error occured during creating course');
            return next(error);
        }
        res.status(201);
        res.location('/');
        res.json();
    });
});

router.get('/:id', checkCredentials, (req, res) => {
    Course.findOne({user: req.user._id, _id: req.params.id})
        .exec((err, course) => {
            if (err) {
                return next(err);
            }

            res.status(200).json({
                status: 'OK',
                results: {
                    course: course
                }
            });
        });
});

router.put('/:id', checkCredentials, (req, res, next) => {
    const courseData = {
        user: req.user._id,
        title: req.body.title,
        description: req.body.description,
        estimatedTime: req.body.estimatedTime,
        materialsNeeded: req.body.materialsNeeded
    };
    const conditions = {
        user: req.user._id,
        _id: req.params.id
    };

    Course.findOneAndUpdate(conditions, courseData, {runValidators: true}, (err) => {
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
        res.status(204).json();
    });
});

router.delete('/:id', checkCredentials, (req, res, next) => {
    const conditions = {
        user: req.user._id,
        _id: req.params.id
    };

    Course.findOneAndDelete(conditions, (err) => {
        if (err) {
            return next(err);
        }
        res.status(204).json();
    });
});

module.exports = router;