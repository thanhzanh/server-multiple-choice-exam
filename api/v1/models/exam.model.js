const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const examSchema = new mongoose.Schema(
    {       
        title: String,
        description: String,
        image: String,
        level: {
            type: String,
            enum: ["Tiểu học", "THCS", "THPT", "Cao đẳng", "Đại học"]
        },
        subject: String,
        topic: String,
        privacy: { type: String, enum: ["private", "public"], default: "private" },
        status: { type: String, enum: ["active", "inactive"], default: "active" },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true 
        },
        slug: {
            type: String,
            slug: "title",
            unique: true // DUY NHẤT
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

const Exam = mongoose.model('Exam', examSchema, "exams"); // exams: tên collection trong database

module.exports = Exam;