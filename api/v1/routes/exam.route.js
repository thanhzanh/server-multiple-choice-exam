const express = require("express");
const router = express.Router();
const upload = require("../../../middlewares/multer");

const authMiddleware = require("../../../middlewares/auth.middleware");

const controller = require("../controllers/exam.controller");

router.get("/index", authMiddleware.requireAuth, controller.index);

router.get("/detail/:id", authMiddleware.requireAuth, controller.detail);

router.patch("/change-status/:id", controller.changeStatus);

router.post("/create", authMiddleware.requireAuth, upload.single("image"), controller.create);

router.patch("/edit/:id",  upload.single("image"), controller.edit);

router.delete("/delete/:id", controller.delete);

router.get("/levels", controller.getExamLevels);

module.exports = router;