const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const User = require("../models/user.model");

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
        const hashedPassword = await bcrypt.hash(password, 10);

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