const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
    {       
        logoName: {
            type: String,
            default: "QuizSTU",
        },
        deleted: {
            type: Boolean,
            default: false
        },
    }, 
    {
        timestamps: true
    }
);

const Settings = mongoose.model('Settings', settingsSchema, "settings"); // settings: tên collection trong database

module.exports = Settings;