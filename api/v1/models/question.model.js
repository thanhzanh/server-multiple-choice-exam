const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
    {       
        examId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam"
        },
        questionText: String,
        type: {
            type: String,
            enum: ["single", "multiple", "fill_in_the_blank", "true_false"]
        },
        options: [
            { type: String }
        ],
        correctAnswer: [
            { type: String }
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

const Question = mongoose.model('Question', questionSchema, "questions"); // questions: tên collection trong database

module.exports = Question;