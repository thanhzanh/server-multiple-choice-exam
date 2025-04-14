const express = require("express");
const router = express.Router();

const controller = require("../controllers/result.controller");
const authMiddleware = require("../../../middlewares/auth.middleware");

// Nộp bài thi
router.post("/submit", authMiddleware.requireAuth, controller.submitExamResult);

// Kết quả chi tiết của 1 bài thi 
router.get("/:resultId", authMiddleware.requireAuth, controller.getResultDetail);

module.exports = router;