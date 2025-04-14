const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
    {       
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, // Lưu người làm bài
        },
        examId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
            required: true, // Lưu bài thi user làm
        },
        totalQuestions: {
            type: Number,
            required: true, // Tổng số câu hỏi của đề bài
        },
        correctAnswers: {
            type: Number,
            default: 0, // Số câu trả lời đúng
        },
        scores: {
            type: Number,
            default: 0, // Điểm số
        },
        timeSelected: {
            type: Number,
            required: true, // Thời gian chọn làm bài (phút)
        },
        durationReal: Number,   // thời gian người dùng thực sự làm (giây)
        submittedAt: {
            type: Date,
            default: Date.now(), // Thời gian nộp bài
        },
        answers: [
            {
                questionId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Question", // Tham chiếu đến bảng câu hỏi
                    required: true
                },
                selectedOption: String, // Đáp án người dùng chọn
                correctOption: [String], // Đáp án đúng của câu hỏi
                isCorrect: Boolean, // Người dùng trả lời đúng hay không
            }
        ]
    }, 
    {
        timestamps: true
    }
);

const Result = mongoose.model('Result', resultSchema, "results"); // results: tên collection trong database

module.exports = Result;