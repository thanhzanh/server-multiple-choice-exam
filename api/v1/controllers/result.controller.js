const Result = require('../models/result.model');
const User = require('../models/user.model');
const Exam = require('../models/exam.model');
const Question = require('../models/question.model');

// [POST] /api/v1/results/submit
module.exports.submitExamResult = async (req, res) => {
    console.log("Chi tiet ket qua bai thi: ", req.body);
    const { userId, examId, timeSelected, answers } = req.body;

    // Kiểm tra người dùng có trong database không
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({
            message: "Người dùng không tồn tại"
        });
    }

    // Kiểm tra đề thi có trong database không
    const exam = await Exam.findById(examId);
    console.log("Exam: ", exam);
    
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
        const isCorrect = answer.selectedOption === correctAnswer;
        if (isCorrect) correctAnswers++; // Nếu có đáp án đúng thì câu trả lời đúng tăng lên

        // Chi tiết câu hỏi 
        answerDetail.push({
            questionId: answer.questionId,
            selectedOption: answer.selectedOption,
            correctOption: correctAnswer,
            isCorrect
        });
        console.log("Answer detail: ", answerDetail);
        
    }

    // Điểm số
    const totalQuestions = examQuestions.length;
    const scores = Math.round((correctAnswers / totalQuestions) * 10); // Thang điểm 10

    // Lưu vào database
    const result = await Result.create({
        userId: userId,
        examId: examId,
        timeSelected,
        totalQuestions,
        correctAnswers,
        scores,
        submittedAt: new Date(),
        answers: answerDetail
    });

    res.json({
        code: 200,
        message: "Thông thi kết quả bài làm",
        result
    });
};