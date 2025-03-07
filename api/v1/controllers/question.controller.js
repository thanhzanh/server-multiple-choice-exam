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

// [GET] /api/v1/questions/create
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
        const id = req.params.id;
        
        // update data database
        await Question.updateOne({
            _id: id,
        }, req.body);

        res.json({
            code: 200,
            message: "Cập nhật thành công"
        });
        
    } catch (error) {
        res.json({
            code: 400,
            message: "Đã xảy ra lỗi",
        });
    }
};