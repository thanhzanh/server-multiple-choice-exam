const express = require("express");
const router = express.Router();
const upload = require("../../../middlewares/multer");

const authMiddleware = require("../../../middlewares/auth.middleware");

const controller = require("../controllers/exam.controller");

router.get("/index", controller.index);

router.get("/detail/:id", authMiddleware.requireAuth, controller.detail);

router.patch("/change-status/:id", authMiddleware.requireAuth, controller.changeStatus);

router.post("/create", authMiddleware.requireAuth, upload.single("image"), controller.create);

router.patch("/edit/:id", authMiddleware.requireAuth, upload.single("image"), controller.edit);

router.delete("/delete/:id", authMiddleware.requireAuth, controller.delete);

module.exports = router;