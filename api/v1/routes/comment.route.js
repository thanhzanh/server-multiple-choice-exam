const express = require("express");
const router = express.Router();

const controller = require("../controllers/comment.controller");

router.post("/", controller.sendComment);

router.get("/exam/:examId", controller.getCommentByExam);

module.exports = router;