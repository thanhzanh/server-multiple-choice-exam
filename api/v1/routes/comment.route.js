const express = require("express");
const router = express.Router();

const controller = require("../controllers/comment.controller");
const authMiddleware = require("../../../middlewares/auth.middleware");

router.post("/", authMiddleware.requireAuth, controller.sendComment);

router.get("/exam/:examId", authMiddleware.requireAuth, controller.getCommentByExam);

module.exports = router;