'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    emailAddress: {
        type: String,
        unique: [true, 'Email address exists'],
        required: [true, 'Email addresse is required'],
        trim: true
    },
    password:  {
        type: String,
        required: [true, 'Password is required'],
        trim: true
    }
});

// hash password before saving user
UserSchema.pre('save', function (next) {
    const User = this;
    bcrypt.hash(User.password, 10, function (error, hash) {
        if (error) {
            return next(err);
        }

        User.password = hash;
        next();
    });
});

const CourseSchema = new Schema({
    user: UserSchema,
    title:  {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description:  {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    estimatedTime:  {
        type: String,
        required: [true, 'Estimated time is required'],
        trim: true
    },
    materialsNeeded:  {
        type: String,
        required: [true, 'Materials needed is required'],
        trim: true
    }
});

const Course = mongoose.model('Course', CourseSchema);
const User = mongoose.model('User', UserSchema);

module.exports.Course = Course;
module.exports.User = User;