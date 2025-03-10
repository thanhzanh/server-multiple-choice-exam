const mongoose = require('mongoose');
const generate = require('../../../helpers/generate');

const userSchema = new mongoose.Schema(
    {    
        googleId: {
            type: String,
            default: null
        },   
        fullName: String,
        email: String,
        password: String,
        avatar: String,
        token: {
            type: String,
            default: generate.generateRandomString(30)
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    }, 
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema, "users"); // users: tên table(collection) trong database

module.exports = User;