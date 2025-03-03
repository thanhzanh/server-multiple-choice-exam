const express = require("express");
const router = express.Router();

const controller = require("../controllers/question.controller");

router.get("/index", controller.index);

router.get("/create", controller.create);

module.exports = router;