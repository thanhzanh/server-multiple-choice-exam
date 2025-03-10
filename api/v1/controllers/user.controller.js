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

    if (!fullName) {
        res.json({
            code: 400,
            message: "Vui lòng nhập tên người dùng"
        });
    }

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

// // [POST] /api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if (!result) {
        res.json({
            code: 400,
            message: "Mã OTP không hợp lệ"
        });
        return;
    }

    // lấy ra user đúng otp gửi lên
    const user = await User.findOne({
        email: email
    });

    const token = user.token;
    res.cookie("token", token);

    res.json({
        code: 200,
        message: "Xác thực thành công",
        token: token
    });

};

// [POST] /api/v1/users/password/reset
module.exports.resetPassword = async (req, res) => {
    const token = req.body.token;
    const password = req.body.password;

    // lấy ra user theo token
    const user = await User.findOne({
        token: token,
    });

    if (!user) {
        return res.status(404).json({
            code: 404,
            message: "Token không hợp lệ hoặc người dùng không tồn tại",
        });
    }

    // Kiểm tra mật khẩu mới có trùng với mật khẩu cũ không
    if (md5(password) === user.password) {
        res.json({
            code: 400,
            message: "Vui lòng nhập mật khẩu khác mật khẩu cũ"
        });
        return;
    }

    // lưu vào database
    await User.updateOne({
        token: token
    }, {
        password: md5(password)
    });

    res.json({
        code: 200,
        message: "Đổi mật khẩu thành công",
        token: token
    });

};

// 
module.exports.googleLogin = async (req, res) => {
    try {
        const user = req.user; // Lấy thông tin user từ Passport
        const token = user.token;
        res.cookie("token", token);
        res.json({
            code: 200,
            message: "Đăng nhập Google thành công",
            user,
            token,
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: "Lỗi server!" });
    }
};