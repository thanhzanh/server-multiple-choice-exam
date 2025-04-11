const express = require("express");
const router = express.Router();

const controller = require("../controllers/question.controller");
const authMiddleware = require("../../../middlewares/auth.middleware");

router.get("/index", authMiddleware.requireAuth, controller.index);

router.post("/create", authMiddleware.requireAuth, controller.create);

router.get("/detail/:id", authMiddleware.requireAuth, controller.detail);

router.put("/edit/:id", authMiddleware.requireAuth, controller.edit);

router.get("/getQuestionsByExam/:examId", authMiddleware.requireAuth, controller.getQuestionsByExam);

router.get("/countQuestion/:examId", authMiddleware.requireAuth, controller.countQuestion);

module.exports = router;