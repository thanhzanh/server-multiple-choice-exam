const md5 = require("md5");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/user.model");
const ForgotPassword = require("../models/forgot-password.model");

const genareteHelper = require("../../../helpers/generate");
const sendMailHelper = require("../../../helpers/sendMail");
const { response } = require("express");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// [POST] /api/v1/users/register
module.exports.register = async(req, res) => {
    
    const { fullName, email, password, password_confirmation } = req.body;    

    const existEmail = await User.findOne({
        email: email,
        deleted: false
    });

    // Check email tồn tại chưa
    if (existEmail) {
        res.status(400).json({
            code: 400,
            err: "existEmail",
            message: "Email đã tồn tại"
        });
        return;
    } 
    
    if (!password || !password_confirmation) {
        res.status(400).json({
            code: 400,
            err: "missingPassword",
            message: "Vui lòng nhập mật khẩu và xác nhận mật khẩu"
        });
        return;
    }

    if (String(password) !== String(password_confirmation)) {
        res.status(400).json({
            code: 400,
            err: "confirmPassword",
            message: "Vui lòng nhập đúng mật khẩu ở trên"
        });
        return;
    }
    
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

    res.status(200).json({
        code: 200,
        message: "Tạo tài khoản thành công",
        token: token
    });
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
        res.status(400).json({
            code: 400,
            message: "Email không tồn tại!",
        });
        return;
    }

    if (md5(password) != user.password) {
        res.status(400).json({
            code: 400,
            message: "Sai mật khẩu!"
        });
        return;
    }

    const token = user.token;
    res.cookie("token", token, {
        secure: false, // Để false khi test, production thì dùng true
        sameSite: "strict", // Ngăn CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    res.status(200).json({
        code: 200,
        token: token
    });
};

// [POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

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

    // Thời gian hết hạn OTP (tính theo timestamp)
    const timeExpire = 5; // 5p

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expires: Date.now() + timeExpire * 60
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
    
    return res.status(200).json({ 
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

// [POST] /api/v1/users/auth/google
module.exports.authGoogle = async (req, res) => {
    try {
        const { token } = req.body; // Nhận token từ frontend
        
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Thiếu token"
            });
        }

        // Xác thực token từ Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload(); // Dữ liệu user từ Google

        // Lấy ra user theo email
        let user = await User.findOne({ email: payload.email });

        if (!user) {
            // Nếu user chưa tồn tại thì tạo mới
            user = new User({
                googleId: payload.sub,
                fullName: payload.name,
                email: payload.email,
                avatar: payload.picture,
                password: null
            });

            await user.save();
        }

        const authToken  = user.token;
        res.cookie("token", authToken,
            {
                secure: process.env.NODE_ENV === "production", // Chỉ bật trên HTTPS
                sameSite: "strict", // Giảm nguy cơ CSRF
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
            }
        );
        
        res.status(200).json({
            success: true,
            message: "Đăng nhập Google thành công",
            token: authToken,
            user: {
                id: user._id,
                name: user.fullName,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Lỗi xác thực Google", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
};

// [POST] /api/v1/users/logout
module.exports.logout = async (req, res) => {
    // xóa cookie ra khỏi trình duyệt
    res.clearCookie("token");
    res.json({ message: "Đăng xuất thành công" });
};

// [GET] /api/v1/users/getUser
module.exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(res.locals.user._id).select("-password");        

        if (!user) {
            return res.status(400).json({ message: "Người dùng không tồn tại" });
        }
    
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: "Không có token" });
    }
};

