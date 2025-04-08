const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {       
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, // Lưu người bình luận
        },
        examId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
            required: true, // Lưu bài thi người dùng bình luận
        },
        comment_text: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0, // mặc định nếu người dùng không đánh giá
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

const Comment = mongoose.model('Comment', commentSchema, "comments"); // comments: tên collection trong database

module.exports = Comment;