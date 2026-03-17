const express = require("express");
const { chatWithPDF } = require("../controllers/chat.controller");
const isAuthenticated = require("../middlewares/auth.middlware");
const rateLimiter = require("../middlewares/rateLimiter.middleware");

const router = express.Router();

router.post("/", isAuthenticated, rateLimiter(10, 60), chatWithPDF);

module.exports = router;
