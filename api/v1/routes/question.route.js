const express = require("express");
const router = express.Router();

const controller = require("../controllers/question.controller");

router.get("/index", controller.index);

router.post("/create", controller.create);

router.get("/detail/:id", controller.detail);

router.get("/getQuestionsByExam/:examId", controller.getQuestionsByExam);

module.exports = router;