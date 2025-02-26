const userRoutes = require("../routes/user.route");

module.exports = (app) => {
    const version = "/api/v1";

    app.use(version + "/users", userRoutes);

};