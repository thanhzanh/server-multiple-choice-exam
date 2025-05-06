const express = require("express");
const router = express.Router();

const controller = require("../controllers/setting.controller");
const authMiddleware = require("../../../middlewares/auth.middleware");

router.get("/", authMiddleware.requireAuth, controller.getSettings);

router.put("/", authMiddleware.requireAuth, controller.updateSettings);

module.exports = router;