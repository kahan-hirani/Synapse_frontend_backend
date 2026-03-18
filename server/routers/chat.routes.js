const express = require("express");
const { chatWithPDF, getNotebookChatHistory } = require("../controllers/chat.controller");
const isAuthenticated = require("../middlewares/auth.middlware");
const rateLimiter = require("../middlewares/rateLimiter.middleware");

const router = express.Router();

router.post("/", isAuthenticated, rateLimiter(10, 60), chatWithPDF);
router.get('/history/:notebookId', isAuthenticated, rateLimiter(30, 60), getNotebookChatHistory);

module.exports = router;
