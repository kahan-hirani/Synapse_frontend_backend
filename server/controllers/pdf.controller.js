const path = require('path');
const asyncHandler = require('../utilities/asyncHandler.utility');
const ErrorHandler = require('../utilities/errorHandler.utility');
const PDF = require('../models/pdf.model');
const Notebook = require('../models/notebook.model');
const redis = require('../db/redis');
const { toNotebookResponse } = require('./notebook.controller');
const { extractTextFromPDF, chunkTextByTokens } = require('../utilities/pdfProcessor.utility');
const { embedText } = require('../utilities/huggingfaceClient.utility');
const { storePDFChunks } = require('../utilities/vectorStore.utility');

const CHUNK_SIZE_TOKENS = Number(process.env.RAG_CHUNK_SIZE || 1000);
const CHUNK_OVERLAP_TOKENS = Number(process.env.RAG_CHUNK_OVERLAP || 100);

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
    return next(new ErrorHandler('No file uploaded', 400));
  }

  const pdfPath = path.join(__dirname, '..', 'uploads', req.file.filename);
  const cacheKey = `pdf:ingest:${req.user.id}:${req.file.originalname}:${req.file.size}`;
  const cachedPdfId = await redis.get(cacheKey);

  if (cachedPdfId) {
    const existingPdf = await PDF.findOne({ _id: cachedPdfId, uploadedBy: req.user.id });
    if (existingPdf) {
      await storePDFChunks(
        existingPdf._id.toString(),
        existingPdf.embeddings.map((row) => ({
          chunkId: row.chunkId,
          text: row.chunk,
          page: row.page,
          source: row.source || req.file.originalname,
          embedding: row.embedding,
        })),
        true,
      );

      const attachment = await attachSourceToNotebook(
        notebookId,
        req.user.id,
        req.file.originalname,
        existingPdf._id,
      );

      return res.status(200).json({
        success: true,
        message: 'Loaded indexed PDF from cache',
        pdfId: existingPdf._id,
        source: attachment?.source,
        notebook: attachment?.notebook ? toNotebookResponse(attachment.notebook) : undefined,
      });
    }
  }

  const pages = await extractTextFromPDF(pdfPath);
  if (!pages.length) {
    return next(new ErrorHandler('Could not extract text from PDF. If scanned, add OCR first.', 400));
  }

  const chunkRows = [];
  for (const pageRow of pages) {
    const chunks = chunkTextByTokens(pageRow.text, {
      chunkSize: CHUNK_SIZE_TOKENS,
      overlap: CHUNK_OVERLAP_TOKENS,
    });

    chunks.forEach((chunk, idx) => {
      chunkRows.push({
        chunkId: `${req.file.filename}_p${pageRow.page}_c${idx + 1}`,
        text: chunk.text,
        page: pageRow.page,
        source: req.file.originalname,
      });
    });
  }

  if (!chunkRows.length) {
    return next(new ErrorHandler('No useful text chunks were produced from this PDF.', 400));
  }

  const embeddings = [];
  for (const row of chunkRows) {
    const vector = await embedText(row.text);
    if (!vector?.length) continue;

    embeddings.push({
      chunkId: row.chunkId,
      chunk: row.text,
      embedding: vector,
      page: row.page,
      source: row.source,
    });
  }

  if (!embeddings.length) {
    return next(new ErrorHandler('No embeddings could be generated for this PDF.', 500));
  }

  const pdfDoc = await PDF.create({
    filename: req.file.filename,
    path: pdfPath,
    uploadedBy: req.user.id,
    embeddings,
  });

  await storePDFChunks(
    pdfDoc._id.toString(),
    embeddings.map((row) => ({
      chunkId: row.chunkId,
      text: row.chunk,
      page: row.page,
      source: row.source,
      embedding: row.embedding,
    })),
    true,
  );

  await redis.set(cacheKey, String(pdfDoc._id), 'EX', 86400);

  const attachment = await attachSourceToNotebook(notebookId, req.user.id, req.file.originalname, pdfDoc._id);

  return res.status(201).json({
    success: true,
    message: 'PDF uploaded and indexed successfully',
    pdfId: pdfDoc._id,
    source: attachment?.source,
    notebook: attachment?.notebook ? toNotebookResponse(attachment.notebook) : undefined,
  });
});

module.exports = { uploadPDF };
