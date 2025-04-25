const Result = require("../models/result.model");
const User = require("../models/user.model");
const Exam = require("../models/exam.model");
const Question = require("../models/question.model");

// function stripHtml(html) {
//     return html?.replace(/<\/?[^>]+(>|$)/g, "").trim();
// }

// [POST] /api/v1/results/submit
module.exports.submitExamResult = async (req, res) => {
  const { stripHtml } = await import("string-strip-html");
  const { userId, examId, timeSelected, answers, startTime } = req.body;

  const user = await User.findById(userId);
  if (!user)
    return res.status(404).json({ message: "Người dùng không tồn tại" });

  const exam = await Exam.findById(examId);
  if (!exam) return res.status(404).json({ message: "Bài thi không tồn tại" });

  const examQuestions = await Question.find({ examId, deleted: false });

  let correctAnswers = 0;
  let answerDetail = [];

  for (const answer of answers) {
    const question = await Question.findById(answer.questionId);
    if (!question) continue;

    const type = question.type;
    const userAnswer = answer.selectedOption;

    // Chuẩn hóa đáp án đúng
    let correctAnswer = question.correctAnswer;
    if (!correctAnswer) correctAnswer = type === "multiple" ? [] : "";

    // So sánh logic tùy theo loại câu hỏi
    let isCorrect = false;
    let normalizedUserAnswer, normalizedCorrectAnswer;

    switch (type) {
      case "single":
      case "true_false":
        normalizedUserAnswer = stripHtml(userAnswer?.toString().trim() || "");
        normalizedCorrectAnswer = stripHtml(
          (correctAnswer?.toString() || "").trim()
        ).result;
        isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
        break;

      case "multiple":
        const normalize = (arr) =>
          arr.map((o) => stripHtml(o.toString().trim()).result).sort();
        const userArr = Array.isArray(userAnswer) ? userAnswer : [];
        const correctArr = Array.isArray(correctAnswer) ? correctAnswer : [];

        normalizedUserAnswer = normalize(userArr);
        normalizedCorrectAnswer = normalize(correctArr);
        isCorrect =
          JSON.stringify(normalizedUserAnswer) ===
          JSON.stringify(normalizedCorrectAnswer);
        break;

      case "fill_in_the_blank":
        const strippedUser = stripHtml(userAnswer?.toString().trim() || "");
        const strippedCorrect = stripHtml(
          correctAnswer?.toString().trim() || ""
        );

        normalizedUserAnswer = (strippedUser?.result || "").toLowerCase();
        normalizedCorrectAnswer = (strippedCorrect?.result || "").toLowerCase();
        isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
        break;

      default:
        break;
    }

    if (isCorrect) correctAnswers++;

    answerDetail.push({
      questionId: answer.questionId,
      selectedOption: userAnswer,
      correctOption: correctAnswer,
      isCorrect,
    });
  }

  const totalQuestions = examQuestions.length;
  const scores = Math.round((correctAnswers / totalQuestions) * 10);

  const start = new Date(startTime);
  const end = new Date();
  const durationReal = Math.floor((end - start) / 1000);

  const result = await Result.create({
    userId,
    examId,
    totalQuestions,
    correctAnswers,
    scores,
    timeSelected,
    durationReal,
    submittedAt: end,
    answers: answerDetail,
  });

  res.json({
    code: 200,
    message: "Thông tin kết quả bài làm",
    result,
  });
};

// [GET] /api/v1/results/:resultId
module.exports.getResultDetail = async (req, res) => {
  try {
    const { resultId } = req.params;
    const userId = res.locals.user._id;

    const result = await Result.findById(resultId)
      .populate("userId", "fullName email")
      .populate("examId", "title")
      .populate("answers.questionId");

    // check xem có kết quả thi không
    if (!result) {
      return res.status(404).json({ error: "Bạn chưa có kết quả thi" });
    }

    // Chỉ xem kết quả thi của chính người dùng đăng nhập
    if (result.userId._id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Bạn không có quyền xem kết quả này" });
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
    return res
      .status(404)
      .json({ message: "Bạn chỉ được xem kết quả của chính bạn!" });
  }

  // Kiểm tra kết quả
  const results = await Result.find({ userId: userId })
    .populate("userId", "fullName email")
    .populate("examId", "title")
    .populate("answers.questionId");

  res.status(200).json(results);
};
