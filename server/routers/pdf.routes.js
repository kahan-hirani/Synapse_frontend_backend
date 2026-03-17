const express = require("express");
const multer = require("multer");
const { uploadPDF } = require("../controllers/pdf.controller");
const isAuthenticated = require("../middlewares/auth.middlware");
const rateLimiter = require("../middlewares/rateLimiter.middleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post("/upload", isAuthenticated, rateLimiter(5, 60), upload.single("pdf"), uploadPDF);

module.exports = router;
