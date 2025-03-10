const Question = require("../models/question.model");
const Exam = require("../models/exam.model");

// [GET] /api/v1/questions/index
module.exports.index = async(req, res) => {

    const find = {
        deleted: false
    };

    const questions = await Question.find(find);
    console.log(questions);
    

    res.json({
        code: 200
    });
};

// [POST] /api/v1/questions/create
module.exports.create = async(req, res) => {

    try {
        const { examId, questionText, type, options, correctAnswer } = req.body;
    
        const existExam = await Exam.findOne({
            _id: examId,
            deleted: false
        });

        // kiểm tra bài thi tồn tại không
        if (!existExam) {
            res.json({
                code: 200,
                message: "Bài thi không tồn tại"
            });
            return;
        }

        // lưu vào database
        const questions = new Question({
            examId,
            questionText,
            type,
            options: options || [],
            correctAnswer: correctAnswer || []
        });
        await questions.save();
        
        res.json({
            code: 200,
            message: "Tạo câu hỏi thành công",
            questions: questions
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Bài thi không tồn tại",
        });
    }
};

// [GET] /api/v1/questions/detail/:id
module.exports.detail = async(req, res) => {

    try {
        const id = req.params.id;
        
        const question = await Question.findOne({
            _id: id,
            deleted: false
        });

        res.json(question);
        
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tìm thấy",
        });
    }
};

// [PUT] /api/v1/questions/edit/:id
module.exports.edit = async(req, res) => {

    try {
        const examId = req.params.examId;
              
        // update data database
        const updateQuestion = await Question.findByIdAndUpdate(
            { _id: examId },
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );

        if (!updateQuestion) {
            return res.json({
                code: 400,
                message: "lỗi cập nhật câu hỏi"
            });
        }

        res.json({
            code: 200,
            message: "Cập nhật thành công",
            data: updateQuestion // trả về câu hỏi đã cập nhật
        });
        
    } catch (error) {
        res.json({
            code: 400,
            message: "Đã xảy ra lỗi",
        });
    }
};

// [GET] /api/v1/questions/getQuestionsByExam/:examId
module.exports.getQuestionsByExam = async(req, res) => {

    try {
        const examId = req.params.examId;
        
        /// lấy question từ data
        const questions = await Question.find({
            examId: examId,
            deleted: false
        });

        res.json({
            code: 200,
            data: questions || []
        });
        
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tìm thấy câu hỏi nào",
        });
    }
};

// [GET] /api/v1/questions/countQuestion/:examId
module.exports.countQuestion = async(req, res) => {

    try {
        const examId = req.params.examId;
              
        // đếm số câu hỏi của bài thi
        const countQuestion = await Question.countDocuments({
            examId: examId,
            deleted: false
        });

        res.json({
            code: 200,
            totalQuestion: countQuestion
        });
        
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tìm thấy câu hỏi nào",
        });
    }
};