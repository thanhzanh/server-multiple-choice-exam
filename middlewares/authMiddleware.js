module.exports.checkSecurity = (req, res, next) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res.status(400).json({
            code: 400,
            err: "fullName",
            message: "Vui lòng nhập họ tên",
        });
    }

    if (fullName.length < 8) {
        return res.status(400).json({
            code: 400,
            err: "fullName",
            message: "Họ tên phải đủ 8 ký tự trở lên",
        });
    }

    if (!email) {
        return res.status(400).json({
            code: 400,
            err: "emailSame",
            message: "Vui lòng nhập email",
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            code: 400,
            err: "email",
            message: "Email không hợp lệ!",
        });
    }
    
    if (!password) {
        return res.status(400).json({
            code: 400,
            err: "password",
            message: "Vui lòng nhập mật khẩu",
        });
    }

    const lengthCondition = password.length >= 8;
    const upperCaseCondition = /[A-Z]/.test(password);
    const lowerCaseCondition = /[a-z]/.test(password);
    const numberCondition = /\d/.test(password);
    const specialCharCondition = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (
        !lengthCondition ||
        !upperCaseCondition ||
        !lowerCaseCondition ||
        !numberCondition ||
        !specialCharCondition
    ) {
        return res.status(400).json({
            code: 400,
            err: "password",
            message: "Mật khẩu không đủ mạnh",
        });
    }

    next(); // Gọi `next()` nếu không có lỗi
};
