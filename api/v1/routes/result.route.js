const express = require("express");
const router = express.Router();

const controller = require("../controllers/result.controller");

router.post("/submit", controller.submitExamResult);

module.exports = router;