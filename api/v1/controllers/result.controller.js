const Result = require('../models/result.model');
const User = require('../models/user.model');
const Exam = require('../models/exam.model');
const Question = require('../models/question.model');

// [POST] /api/v1/results/submit
module.exports.submitExamResult = async (req, res) => {
    const { userId, examId, timeSelected, answers, startTime  } = req.body;

    // Kiểm tra người dùng có trong database không
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({
            message: "Người dùng không tồn tại"
        });
    }

    // Kiểm tra đề thi có trong database không
    const exam = await Exam.findById(examId);
    
    if (!exam) {
        return res.status(404).json({
            message: "Bài thi không tồn tại"
        });
    }

    // Lấy tất cả câu hỏi của đề thi
    const examQuestions = await Question.find({ examId: examId, deleted: false });

    let correctAnswers = 0; // biến đếm câu trả lời đúng
    let answerDetail = [];

    // Duyệt qua từng câu hỏi
    for (const answer of answers) {

        const questionsData = await Question.findById(answer.questionId);
        console.log(questionsData);
        
        if (!questionsData) continue;

        // Tìm câu trả lời đúng
        const correctAnswer = Array.isArray(questionsData.correctAnswer) ? questionsData.correctAnswer[0] : questionsData.correctAnswer;
        
        // khi người dùng không chọn đáp án mà bấm nộp
        const isAnswered = answer.selectedOption !== null && answer.selectedOption !== undefined && answer.selectedOption !== "";
        const isCorrect = isAnswered && answer.selectedOption === correctAnswer;
        if (isCorrect) correctAnswers++; // Nếu có đáp án đúng thì câu trả lời đúng tăng lên

        // Chi tiết câu hỏi 
        answerDetail.push({
            questionId: answer.questionId,
            selectedOption: answer.selectedOption,
            correctOption: correctAnswer,
            isCorrect: isCorrect
        });
        console.log("Answer detail: ", answerDetail);
        
    }

    // Điểm số
    const totalQuestions = examQuestions.length;
    const scores = Math.round((correctAnswers / totalQuestions) * 10); // Thang điểm 10

    const start = new Date(startTime); // parse lại từ FE
    const end = new Date(); // thời điểm nộp bài
    const durationReal = Math.floor((end - start) / 1000); 

    // Lưu vào database
    const result = await Result.create({
        userId: userId,
        examId: examId,
        totalQuestions,
        correctAnswers,
        scores,
        timeSelected,
        durationReal,
        submittedAt: end,
        answers: answerDetail
    });

    res.json({
        code: 200,
        message: "Thông thi kết quả bài làm",
        result
    });
};

// [GET] /api/v1/results/:resultId
module.exports.getResultDetail = async (req, res) => {    
    try {
        const { resultId } = req.params;
        const userId = res.locals.user._id;
        
        const result = await Result.findById(resultId).populate("userId", "fullName email").populate("examId", "title").populate("answers.questionId");

        // check xem có kết quả thi không
        if (!result) {
            return res.status(404).json({ error: "Bạn chưa có kết quả thi" });
        }

        // Chỉ xem kết quả thi của chính người dùng đăng nhập
        if (result.userId._id.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Bạn không có quyền xem kết quả này" });
        }

        res.status(200).json(result);
        
    } catch (error) {
        console.error("Lỗi: ", error);
        res.status(500).json({ error: "Lỗi khi lấy kết quả bài thi" });
    }
};

// [GET] /api/v1/results/list/:userId
module.exports.getListResultDetail = async (req, res) => {
    const { userId } = req.params;
    
    // Kiểm tra người dùng
    const user = await User.findOne({ _id: userId, deleted: false });
    if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    if (res.locals.user._id.toString() !== userId) {
        return res.status(404).json({ message: "Bạn chỉ được xem kết quả của chính bạn!" });
    }

    // Kiểm tra kết quả
    const results = await Result.find({ userId: userId }).populate("userId", "fullName email").populate("examId", "title").populate("answers.questionId");
    
    res.status(200).json(results);
};
