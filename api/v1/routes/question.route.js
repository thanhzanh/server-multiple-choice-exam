const express = require("express");
const router = express.Router();

const controller = require("../controllers/question.controller");

router.get("/index", controller.index);

router.get("/create", controller.create);

router.get("/detail/:id", controller.detail);

module.exports = router;