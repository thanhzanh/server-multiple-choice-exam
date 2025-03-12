const express = require("express");
const router = express.Router();
const passport = require("passport");

const accountMiddleware = require("../../../middlewares/accountMiddleware");
const authMiddleware = require("../../../middlewares/auth.middleware");

const controller = require("../controllers/user.controller");

// Đăng ký
router.post("/register",accountMiddleware.checkSecurity, controller.register);

// Đăng nhập
router.post("/login", controller.login);

// Quên mật khẩu
router.post("/password/forgot", controller.forgotPassword);

router.post("/password/otp", controller.otpPassword);

router.post("/password/reset", controller.resetPassword);

// Đăng nhập Google
router.post('/auth/google', controller.authGoogle);

router.post("/logout", controller.logout);

router.get("/getToken", authMiddleware.requireAuth, controller.getToken);

module.exports = router;