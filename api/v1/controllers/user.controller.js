const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const md5 = require("md5");

const User = require("../models/user.model");
const ForgotPassword = require("../models/forgot-password.model");

const genareteHelper = require("../../../helpers/generate");
const sendMailHelper = require("../../../helpers/sendMail");

// [POST] /api/v1/users/register
module.exports.register = async(req, res) => {
    
    const { fullName, email, password } = req.body;

    const existEmail = await User.findOne({
        email: email,
        deleted: false
    });

    // Check email tồn tại chưa
    if (existEmail) {
        res.json({
            code: 400,
            message: "Email đã tồn tại"
        });
    } else {
        // Mã hóa password
        const hashedPassword = md5(password);

        const user = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword,
            avatar: "https://i.pravatar.cc/300" // avatar mặc định
        });

        // lưu vào database
        await user.save();

        // Lưu token
        const token = user.token;
        res.cookie("token", token);

        res.json({
            code: 200,
            message: "Tạo tài khoản thành công",
            token: token
        });

    }
};

// [POST] /api/v1/users/login
module.exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if (!user) {
        res.json({
            code: 400,
            message: "Email không tồn tại!",
        });
        return;
    }

    if (md5(password) != user.password) {
        res.json({
            code: 400,
            message: "Sai mật khẩu!"
        });
        return;
    }

    const token = user.token;
    res.cookie("token", token);

    res.json({
        code: 200,
        message: "Đăng nhập thành công",
        token: token
    });
};

// [POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if (!user) {
        res.json({
            code: 400,
            message: "Email không tồn tại!"
        });
        return;
    }

    // mã OPT
    const otp = genareteHelper.generateRandomNumber(8);

    // thời gian hết hạn
    const timeExpire = 5;

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expires: Date.now() + timeExpire*60
    };

    // lưu vào database
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    forgotPassword.save();

    // gửi otp qua email user
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
        Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b> (Sử dụng trong thời gian ${timeExpire} phút).
        Vui lòng không chia sẽ mã OTP với bất kỳ ai.
    `;
    sendMailHelper.sendMail(email, subject, html);
    
    res.json({
        code: 200,
        message: "Đã gửi mã OTP qua email"
    });


};