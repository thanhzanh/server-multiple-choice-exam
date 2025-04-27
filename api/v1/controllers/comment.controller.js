const Comment = require('../models/comment.model');

// [POST] /api/v1/comments/
module.exports.sendComment = async (req, res) => {
    try {
        const { userId, examId, comment_text, rating } = req.body;

        const newComment = new Comment({
            userId,
            examId,
            comment_text,
            rating
        })

        const saveComment = await newComment.save();

        res.status(200).json(saveComment);
    } catch (error) {
        console.error("Lỗi khi tạo bình luận: ", error);
        res.status(400).json({ error: "Lỗi tạo bình luận" });
    }
};

// [GET] /api/v1/comments/exam/:examId
module.exports.getCommentByExam = async (req, res) => {
    try {
        const { examId } = req.params;

        const comments = await Comment.find({ examId: examId, deleted: false })
        .populate("userId", "fullName avatar") // populate userId là lấy thông tin collection user gồm fullName avatar
        .sort({ createdAt: -1 }); // Mới nhất trước

        res.status(200).json(comments);
    } catch (error) {
        console.error("Lỗi khi lấy bình luận: ", error);
        res.status(400).json({ error: "Lỗi tạo bình luận" });
    }
};