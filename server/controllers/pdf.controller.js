const path = require("path");
const { extractTextFromPDF } = require("../utilities/pdfProcessor.utility");
const { embedGemini } = require("../utilities/geminiClient.utility");
const PDF = require("../models/pdf.model");
const Notebook = require('../models/notebook.model');
const { toNotebookResponse } = require('./notebook.controller');
const asyncHandler = require("../utilities/asyncHandler.utility");
const redis = require("../db/redis");
const { storePDFChunks } = require("../utilities/vectorStore.utility");

async function attachSourceToNotebook(notebookId, userId, sourceName, pdfId) {
  if (!notebookId) return null;

  const notebook = await Notebook.findOne({ _id: notebookId, owner: userId });
  if (!notebook) return null;

  const existing = notebook.sources.find((source) => String(source.pdfId) === String(pdfId));
  if (existing) {
    notebook.updatedAt = new Date();
    await notebook.save();
    return {
      notebook,
      source: {
        id: existing._id,
        name: existing.name,
        type: existing.type || 'PDF',
        addedAt: existing.addedAt,
        pdfId: existing.pdfId,
      },
    };
  }

  notebook.sources.unshift({
    name: sourceName,
    type: 'PDF',
    pdfId,
    addedAt: new Date(),
  });
  await notebook.save();

  const added = notebook.sources[0];
  return {
    notebook,
    source: {
      id: added._id,
      name: added.name,
      type: added.type || 'PDF',
      addedAt: added.addedAt,
      pdfId: added.pdfId,
    },
  };
}

const uploadPDF = asyncHandler(async (req, res, next) => {
  const notebookId = req.body.notebookId;

  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const pdfPath = path.join(__dirname, "..", "uploads", req.file.filename);

  // ✅ Redis cache check
  const cached = await redis.get(`pdf:${req.file.filename}`);
  if (cached) {
    const cachedDoc = JSON.parse(cached);
    const attachment = await attachSourceToNotebook(notebookId, req.user.id, req.file.originalname, cachedDoc._id);

    return res.status(200).json({
      success: true,
      message: "Loaded PDF embeddings from cache",
      pdfId: cachedDoc._id,
      source: attachment?.source,
      notebook: attachment?.notebook ? toNotebookResponse(attachment.notebook) : undefined,
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

  const attachment = await attachSourceToNotebook(notebookId, req.user.id, req.file.originalname, pdfDoc._id);

  res.status(201).json({
    success: true,
    message: "✅ PDF uploaded & processed successfully",
    pdfId: pdfDoc._id,
    source: attachment?.source,
    notebook: attachment?.notebook ? toNotebookResponse(attachment.notebook) : undefined,
  });
});

module.exports = { uploadPDF };
