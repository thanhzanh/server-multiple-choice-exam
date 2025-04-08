const userRoutes = require("../routes/user.route");
const examRoutes = require("../routes/exam.route");
const questionRoutes = require("../routes/question.route");
const resultRoutes = require("../routes/result.route");
const commentRoutes = require("../routes/comment.route");

module.exports = (app) => {
    const version = "/api/v1";

    app.use(version + "/users", userRoutes);

    app.use(version + "/exams", examRoutes);

    app.use(version + "/questions", questionRoutes);

    app.use(version + "/results", resultRoutes);

    app.use(version + "/comments", commentRoutes);

};