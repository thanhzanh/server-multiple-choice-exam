const User = require("../api/v1/models/user.model");

module.exports.requireAuth = async (req, res, next) => {

    const token = req.cookies.token;
    console.log("TOKEN: ", token);
    
    try {
        const user = await User.findOne({
            token: token,
            deleted: false
        }).select("-password");        

        if (!user) {
            res.status(401).json({
                code: 401,
                message: "Bạn chưa đăng nhập, vui lòng đăng nhập"
            });
            return;
        }

        // login by user (Thong tin user)
        res.locals.user = user; // Gán user vào request để các route sau có thể dùng

        next();
    } catch (error) {
        return res.status(400).json({
            code: 400,
            message: "Phiên đăng nhập đã hết hạn"
        });
    }
}