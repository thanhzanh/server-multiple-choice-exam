const express = require('express');
require("dotenv").config();
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("./config/passport");
const database = require("./config/database");
const routeApiVer1 = require("./api/v1/routes/index.route");

const app = express();

// connect database
database.connect();

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Cấu hình express-session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Đặt true nếu dùng HTTPS
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, // 1 ngày
        },
    })
);

// Middleware Passport
app.use(passport.initialize());
app.use(passport.session());

// Cho phép tất cả các domain truy cập API
app.use(cors());

// upload ảnh
app.use("/uploads", express.static("uploads"));

// connect route
routeApiVer1(app);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
