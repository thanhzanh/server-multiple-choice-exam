const express = require("express");
const router = express.Router();
const upload = require("../../../middlewares/multer");

const controller = require("../controllers/exam.controller");

router.get("/index", controller.index);

router.get("/detail/:id", controller.detail);

router.patch("/change-status/:id", controller.changeStatus);

router.post("/create", upload.single("image"), controller.create);

router.patch("/edit/:id", upload.single("image"), controller.edit);

router.delete("/delete/:id", controller.delete);

module.exports = router;