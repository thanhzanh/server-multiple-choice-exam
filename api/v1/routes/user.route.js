const express = require("express");
const router = express.Router();
const passport = require("passport");

const authMiddleware = require("../../../middlewares/authMiddleware");

const controller = require("../controllers/user.controller");

// Đăng ký
router.post("/register",authMiddleware.checkSecurity, controller.register);

// Đăng nhập
router.post("/login", controller.login);

// Quên mật khẩu
router.post("/password/forgot", controller.forgotPassword);

router.post("/password/otp", controller.otpPassword);

router.post("/password/reset", controller.resetPassword);

// Đăng nhập Google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    controller.googleLogin
);

module.exports = router;