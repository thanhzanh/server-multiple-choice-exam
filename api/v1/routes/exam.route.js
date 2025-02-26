const express = require("express");
const router = express.Router();

const controller = require("../controllers/exam.controller");

router.get("/index", controller.index);

router.get("/detail/:id", controller.detail);

router.patch("/change-status/:id", controller.changeStatus);

router.post("/create", controller.create);

module.exports = router;