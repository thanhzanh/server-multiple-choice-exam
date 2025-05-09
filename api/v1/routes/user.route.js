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

router.get("/getUser", authMiddleware.requireAuth, controller.getUser);

router.put("/profile/info", authMiddleware.requireAuth, controller.updateProfile);

router.post("/profile/change-password", authMiddleware.requireAuth, controller.changePassword);

router.get('/me', authMiddleware.requireAuth, (req, res) => {
    res.json({
      success: true,
      user: res.locals.user // đã được gán trong middleware
    });
  });

module.exports = router;