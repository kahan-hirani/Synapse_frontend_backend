const asyncHandler = require('../utilities/asyncHandler.utility');
const ErrorHandler = require('../utilities/errorHandler.utility');
const PDF = require('../models/pdf.model');
const Chat = require('../models/chat.model');
const Notebook = require('../models/notebook.model');
const redis = require('../db/redis');
const { embedText, rerankChunks, generateAnswer } = require('../utilities/huggingfaceClient.utility');
const { storePDFChunks, getVectorFor, searchChunksAcrossPdfs } = require('../utilities/vectorStore.utility');

const RETRIEVAL_TOP_K = Number(process.env.RAG_RETRIEVAL_TOP_K || 20);
const RERANK_TOP_N = Number(process.env.RAG_RERANK_TOP_N || 5);

function buildPrompt(question, chunks) {
  const sourceBlock = chunks
    .map((chunk, idx) => {
      const sourceName = chunk.source || 'source.pdf';
      const page = chunk.page || 1;
      return `[Source ${idx + 1} | ${sourceName} | Page ${page}]\n${chunk.text}`;
    })
    .join('\n\n');

  return [
    'You are a research assistant.',
    'Answer only using the supplied sources.',
    'If the answer is not present, clearly say the sources do not contain the answer.',
    'Use concise markdown bullet points when useful.',
    '',
    `Question:\n${question}`,
    '',
    'Sources:',
    sourceBlock,
    '',
    'Return your final answer first. Do not fabricate citations.',
  ].join('\n');
}

function uniqueCitations(chunks) {
  const seen = new Set();
  const citations = [];

  chunks.forEach((chunk) => {
    const page = Number(chunk.page || 1);
    const source = String(chunk.source || 'source.pdf');
    const key = `${source}::${page}`;
    if (seen.has(key)) return;
    seen.add(key);
    citations.push({ page, source });
  });

  return citations;
}

async function ensurePdfVectors(pdfDoc) {
  const pdfId = String(pdfDoc._id);
  if (getVectorFor(pdfId).length) return;

  await storePDFChunks(
    pdfId,
    (pdfDoc.embeddings || []).map((row, idx) => ({
      chunkId: row.chunkId || `${pdfId}_chunk_${idx + 1}`,
      text: row.chunk,
      page: row.page,
      source: row.source || pdfDoc.filename,
      embedding: row.embedding,
    })),
    true,
  );
}

const chatWithPDF = asyncHandler(async (req, res, next) => {
  const { pdfId, notebookId, question } = req.body;

  if (!question || !String(question).trim()) {
    return next(new ErrorHandler('Question is required.', 400));
  }

  if (!pdfId && !notebookId) {
    return next(new ErrorHandler('Either pdfId or notebookId is required.', 400));
  }

  let targetPdfDocs = [];

  if (pdfId) {
    const doc = await PDF.findOne({ _id: pdfId, uploadedBy: req.user.id });
    if (!doc) {
      return next(new ErrorHandler('PDF not found.', 404));
    }
    targetPdfDocs = [doc];
  } else {
    const notebook = await Notebook.findOne({ _id: notebookId, owner: req.user.id });
    if (!notebook) {
      return next(new ErrorHandler('Notebook not found.', 404));
    }

    const sourcePdfIds = (notebook.sources || []).map((source) => source.pdfId).filter(Boolean);
    if (!sourcePdfIds.length) {
      return next(new ErrorHandler('This notebook has no sources yet.', 400));
    }

    targetPdfDocs = await PDF.find({
      _id: { $in: sourcePdfIds },
      uploadedBy: req.user.id,
    });

    if (!targetPdfDocs.length) {
      return next(new ErrorHandler('No accessible PDFs found for this notebook.', 404));
    }
  }

  const pdfIds = targetPdfDocs.map((doc) => String(doc._id));
  const cacheKey = `chat:rag:${req.user.id}:${pdfIds.sort().join(',')}:${String(question).trim().toLowerCase()}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.status(200).json(JSON.parse(cached));
  }

  for (const doc of targetPdfDocs) {
    await ensurePdfVectors(doc);
  }

  const queryEmbedding = await embedText(question);
  const retrieved = searchChunksAcrossPdfs(pdfIds, queryEmbedding, RETRIEVAL_TOP_K)
    .map((chunk) => {
      const doc = targetPdfDocs.find((item) => String(item._id) === String(chunk.pdfId));
      return {
        ...chunk,
        source: chunk.source || doc?.filename || 'source.pdf',
      };
    });

  if (!retrieved.length) {
    const emptyResponse = {
      success: true,
      answer: 'I could not find relevant content in your uploaded sources for this question.',
      citations: [],
    };
    await redis.set(cacheKey, JSON.stringify(emptyResponse), 'EX', 300);
    return res.status(200).json(emptyResponse);
  }

  const reranked = await rerankChunks(question, retrieved, RERANK_TOP_N);
  const prompt = buildPrompt(question, reranked);
  const answer = await generateAnswer(prompt);
  const citations = uniqueCitations(reranked);

  const chatEntry = await Chat.create({
    user: req.user.id,
    pdf: targetPdfDocs[0]._id,
    question: String(question).trim(),
    answer,
    citations: citations.map((item) => ({ page: item.page, source: item.source })),
  });

  const response = {
    success: true,
    answer,
    citations,
    chatId: chatEntry._id,
  };

  await redis.set(cacheKey, JSON.stringify(response), 'EX', 600);
  return res.status(200).json(response);
});

module.exports = { chatWithPDF };
