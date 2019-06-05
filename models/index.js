'use strict';

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/sandbox');

const db = mongoose.connection;

db.on('error', error => {
    console.error('Connect error:', error);
});

db.once('open', () => {
    console.log('Database is successfully connected.');

    const Schema = mongoose.Schema;

    const CourseSchema = new Schema({
        
    });

    db.close(() => {
        console.log('Database connection is closed.');
    });
});