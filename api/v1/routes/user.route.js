const express = require("express");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const controller = require("../controllers/user.controller");

router.post("/register", controller.register);

module.exports = router;