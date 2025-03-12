const express = require('express');
require("dotenv").config();
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
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

app.use(express.json()); // Giúp đọc dữ liệu JSON từ request body
app.use(express.urlencoded({ extended: true })); // Đọc dữ liệu form

// Thêm cookie-parser
app.use(cookieParser());

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
app.use(cors({
    origin: "http://localhost:5173", // Đổi thành domain frontend của bạn
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

// upload ảnh
app.use("/uploads", express.static("uploads"));

// connect route
routeApiVer1(app);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
