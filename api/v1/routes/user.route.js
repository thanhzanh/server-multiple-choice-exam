const express = require("express");
const router = express.Router();

const authMiddleware = require("../../../middlewares/authMiddleware");

const controller = require("../controllers/user.controller");

router.post("/register",authMiddleware.checkSecurity, controller.register);

router.post("/login", controller.login);

router.post("/password/forgot", controller.forgotPassword);

module.exports = router;