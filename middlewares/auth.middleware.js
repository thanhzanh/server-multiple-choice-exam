const User = require("../api/v1/models/user.model");

module.exports.requireAuth = async (req, res, next) => {

    if (req.headers.authorization) {
        const token = req.cookies.token;
        
        const user = await User.findOne({
            token: token,
            deleted: false
        }).select("-password");

        if (!user) {
            res.status(400).json({
                code: 400,
                message: "Bạn chưa đăng nhập"
            });
            return;
        }

        // login by user (Thong tin user)
        req.user = user;

        next();
    } else {
        return res.status(400).json({
            code: 400,
            message: "Phiên đăng nhập đã hết hạn"
        });
    }
}