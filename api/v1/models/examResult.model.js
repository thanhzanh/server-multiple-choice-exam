const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const examResultSchema = new mongoose.Schema(
    {       
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true, // Lưu người làm bài
        },
        exam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
            require: true, // Lưu bài thi user làm
        },
        model: {
            type: String,
            enum: ["on_thi", "thi_thu"],
            require: true, // Chức năng ôn thi hay thi thử
        },
        timeSelected: {
            type: Number,
            require: true, // Thời gian chọn làm bài (phút)
        },
        totalQuestions: {
            type: Number,
            require: true, // Tổng số câu hỏi của đề bài
        },
        correctAnswers: {
            type: Number,
            defaultl: 0, // Số câu trả lời đúng
        },
        scores: {
            type: Number,
            default: 0, // Điểm số
        },
        submittedAt: {
            type: Date,
            default: Date.now(), // Thời gian nộp bài
        },
        answers: [
            {
                questionId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Question", // Tham chiếu đến bảng câu hỏi
                    require: true
                },
                selectedOption: String, // Đáp án người dùng chọn
                correctOption: String, // Đáp án đúng của câu hỏi
                isCorrect: Boolean, // Người dùng trả lời đúng hay không
            }
        ]
    }, 
    {
        timestamps: true
    }
);

const ExamResult = mongoose.model('ExamResult', examResultSchema, "exam-results"); // exam-results: tên collection trong database

module.exports = ExamResult;