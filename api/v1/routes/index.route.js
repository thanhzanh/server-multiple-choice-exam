const userRoutes = require("../routes/user.route");
const examRoutes = require("../routes/exam.route");


module.exports = (app) => {
    const version = "/api/v1";

    app.use(version + "/users", userRoutes);

    app.use(version + "/exams", examRoutes);

};