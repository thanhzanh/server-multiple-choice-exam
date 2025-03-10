module.exports.checkSecurity = (req, res, next) => {
    const { email, password } = req.body;

    // Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
            code: 400,
            err: "email",
            message: "Email không hợp lệ!",
        });
    }
    
    if (password) {

        const lengthCondition = password.length >= 8;

        const upperCaseCondition = /[A-Z]/.test(password);
        const lowerCaseCondition = /[a-z]/.test(password);
        const numberCondition = /\d/.test(password);
        const specialCharCondition = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (
            lengthCondition &&
            upperCaseCondition &&
            lowerCaseCondition &&
            numberCondition &&
            specialCharCondition
        ) {
            next();
        } else {
            res.json({
                code: 400,
                err: "password",
                message: "Mật khẩu không đủ mạnh",
            });
        }
    } else {
        res.json({
            code: 400,
            err: "password",
            message: "Vui lòng nhập mật khẩu",
        });
    }
};
