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
        phone: {
            type: String,
            default: null
        },  
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            default: null
        },
        dateOfBirth: {
            type: Date,
            default: null
        },
        avatar: String,
        token: {
            type: String,
            default: generate.generateRandomString(30)
        },
        favoriteExams: [
            { 
                type: mongoose.Schema.Types.ObjectId, // Lưu ID bài thi yêu thích
                ref: "Exam"
            }
        ],
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