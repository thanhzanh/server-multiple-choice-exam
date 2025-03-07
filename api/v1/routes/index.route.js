const userRoutes = require("../routes/user.route");
const examRoutes = require("../routes/exam.route");
const questionRoutes = require("../routes/question.route");

module.exports = (app) => {
    const version = "/api/v1";

    app.use(version + "/users", userRoutes);

    app.use(version + "/exams", examRoutes);

    app.use(version + "/questions", questionRoutes);

};