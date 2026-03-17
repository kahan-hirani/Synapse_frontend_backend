const path = require("path");
const { extractTextFromPDF } = require("../utilities/pdfProcessor.utility");
const { embedGemini } = require("../utilities/geminiClient.utility");
const PDF = require("../models/pdf.model");
const asyncHandler = require("../utilities/asyncHandler.utility");
const redis = require("../db/redis");
const { storePDFChunks } = require("../utilities/vectorStore.utility");

const uploadPDF = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const pdfPath = path.join(__dirname, "..", "uploads", req.file.filename);

  // ✅ Redis cache check
  const cached = await redis.get(`pdf:${req.file.filename}`);
  if (cached) {
    return res.status(200).json({
      success: true,
      message: "Loaded PDF embeddings from cache",
      pdfId: JSON.parse(cached)._id,
    });
  }

  // ✅ Extract page-wise text
  const pageTexts = await extractTextFromPDF(pdfPath);
  console.log("Extracted pages:", pageTexts.length);

  if (!pageTexts.length) {
    return res.status(400).json({
      success: false,
      message: "❌ Could not extract text from PDF (maybe scanned/image-based).",
    });
  }

  const embeddings = [];

  for (const { page, text } of pageTexts) {
    if (!text) continue;

    // Further split long page into 500-word chunks
    const words = text.split(/\s+/);
    for (let i = 0; i < words.length; i += 500) {
      const chunkText = words.slice(i, i + 500).join(" ");
      if (!chunkText.trim()) continue;

      try {
        const embedding = await embedGemini(chunkText);
        if (embedding) {
          console.log(`✅ Stored embedding for page ${page}, chunk length: ${embedding.length}`);
          embeddings.push({
            chunk: chunkText,
            embedding,
            page
          });
        }
      } catch (err) {
        console.warn("⚠️ Skipping embedding for page:", page, err.message);
      }
    }
  }

  if (!embeddings.length) {
    return res.status(500).json({
      success: false,
      message: "❌ No embeddings could be generated. Try again later.",
    });
  }

  // ✅ Save to Mongo
  const pdfDoc = await PDF.create({
    filename: req.file.filename,
    path: pdfPath,
    uploadedBy: req.user.id,
    embeddings,
  });

  // ✅ Preload into in-memory VectorStore
  await storePDFChunks(pdfDoc._id.toString(), embeddings, true);

  // ✅ Cache in Redis
  await redis.set(`pdf:${req.file.filename}`, JSON.stringify(pdfDoc), "EX", 86400);

  res.status(201).json({
    success: true,
    message: "✅ PDF uploaded & processed successfully",
    pdfId: pdfDoc._id,
  });
});

module.exports = { uploadPDF };
