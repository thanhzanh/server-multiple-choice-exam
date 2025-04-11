const express = require("express");
const router = express.Router();

const controller = require("../controllers/result.controller");
const authMiddleware = require("../../../middlewares/auth.middleware");

router.post("/submit", authMiddleware.requireAuth, controller.submitExamResult);

module.exports = router;