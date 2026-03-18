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
const CHAT_HISTORY_TTL_SECONDS = Number(process.env.CHAT_HISTORY_CACHE_TTL || 1800);

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

function buildHistoryCacheKey(userId, notebookId) {
  return `chat:history:${userId}:${notebookId}`;
}

function buildRagCacheKey(userId, pdfIds, question) {
  return `chat:rag:${userId}:${pdfIds.sort().join(',')}:${String(question).trim().toLowerCase()}`;
}

function citationsMeta(citations) {
  if (!Array.isArray(citations) || !citations.length) return 'Citations unavailable';
  return `Citations: ${citations.map((citation) => `p.${citation.page}`).join(', ')}`;
}

function toMessagesFromHistory(history) {
  return history.flatMap((entry) => [
    { role: 'user', text: entry.question },
    {
      role: 'assistant',
      text: entry.answer,
      meta: citationsMeta(entry.citations),
    },
  ]);
}

async function readNotebookHistoryFromDb(userId, notebook, sourcePdfIds) {
  const chats = await Chat.find({
    user: userId,
    $or: [
      { notebook: notebook._id },
      { notebook: null, pdf: { $in: sourcePdfIds } },
    ],
  })
    .sort({ createdAt: 1 })
    .lean();

  return chats.map((chat) => ({
    question: chat.question,
    answer: chat.answer,
    citations: chat.citations || [],
    createdAt: chat.createdAt,
  }));
}

async function appendHistoryCache(userId, notebookId, entry) {
  const historyKey = buildHistoryCacheKey(userId, notebookId);
  const raw = await redis.get(historyKey);
  const history = raw ? JSON.parse(raw) : [];
  history.push(entry);
  await redis.set(historyKey, JSON.stringify(history), 'EX', CHAT_HISTORY_TTL_SECONDS);
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
  let notebookDoc = null;

  if (pdfId) {
    const doc = await PDF.findOne({ _id: pdfId, uploadedBy: req.user.id });
    if (!doc) {
      return next(new ErrorHandler('PDF not found.', 404));
    }
    targetPdfDocs = [doc];

    if (notebookId) {
      notebookDoc = await Notebook.findOne({ _id: notebookId, owner: req.user.id });
      if (!notebookDoc) {
        return next(new ErrorHandler('Notebook not found.', 404));
      }
    }
  } else {
    notebookDoc = await Notebook.findOne({ _id: notebookId, owner: req.user.id });
    if (!notebookDoc) {
      return next(new ErrorHandler('Notebook not found.', 404));
    }

    const sourcePdfIds = (notebookDoc.sources || []).map((source) => source.pdfId).filter(Boolean);
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
  const cacheKey = buildRagCacheKey(req.user.id, pdfIds, question);
  const cached = await redis.get(cacheKey);
  if (cached) {
    const cachedResponse = JSON.parse(cached);
    const cacheEntry = {
      question: String(question).trim(),
      answer: cachedResponse.answer,
      citations: cachedResponse.citations || [],
      createdAt: new Date().toISOString(),
    };

    if (notebookDoc?._id) {
      await appendHistoryCache(req.user.id, String(notebookDoc._id), cacheEntry);
    }

    const chatEntry = await Chat.create({
      user: req.user.id,
      pdf: targetPdfDocs[0]._id,
      notebook: notebookDoc?._id || null,
      question: cacheEntry.question,
      answer: cacheEntry.answer,
      citations: cacheEntry.citations.map((item) => ({ page: item.page, source: item.source })),
    });

    return res.status(200).json({ ...cachedResponse, chatId: chatEntry._id });
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

    const emptyHistoryEntry = {
      question: String(question).trim(),
      answer: emptyResponse.answer,
      citations: [],
      createdAt: new Date().toISOString(),
    };
    if (notebookDoc?._id) {
      await appendHistoryCache(req.user.id, String(notebookDoc._id), emptyHistoryEntry);
    }

    const emptyChatEntry = await Chat.create({
      user: req.user.id,
      pdf: targetPdfDocs[0]._id,
      notebook: notebookDoc?._id || null,
      question: String(question).trim(),
      answer: emptyResponse.answer,
      citations: [],
    });

    return res.status(200).json({ ...emptyResponse, chatId: emptyChatEntry._id });
  }

  const reranked = await rerankChunks(question, retrieved, RERANK_TOP_N);
  const prompt = buildPrompt(question, reranked);
  const answer = await generateAnswer(prompt);
  const citations = uniqueCitations(reranked);

  const response = {
    success: true,
    answer,
    citations,
  };

  await redis.set(cacheKey, JSON.stringify(response), 'EX', 600);

  const historyEntry = {
    question: String(question).trim(),
    answer,
    citations,
    createdAt: new Date().toISOString(),
  };
  if (notebookDoc?._id) {
    await appendHistoryCache(req.user.id, String(notebookDoc._id), historyEntry);
  }

  const chatEntry = await Chat.create({
    user: req.user.id,
    pdf: targetPdfDocs[0]._id,
    notebook: notebookDoc?._id || null,
    question: String(question).trim(),
    answer,
    citations: citations.map((item) => ({ page: item.page, source: item.source })),
  });

  response.chatId = chatEntry._id;
  return res.status(200).json(response);
});

const getNotebookChatHistory = asyncHandler(async (req, res, next) => {
  const { notebookId } = req.params;

  const notebook = await Notebook.findOne({ _id: notebookId, owner: req.user.id });
  if (!notebook) {
    return next(new ErrorHandler('Notebook not found.', 404));
  }

  const sourcePdfIds = (notebook.sources || []).map((source) => source.pdfId).filter(Boolean);
  const historyKey = buildHistoryCacheKey(req.user.id, notebookId);
  const cached = await redis.get(historyKey);

  if (cached) {
    const history = JSON.parse(cached);
    return res.status(200).json({
      success: true,
      source: 'redis',
      history,
      messages: toMessagesFromHistory(history),
    });
  }

  const history = await readNotebookHistoryFromDb(req.user.id, notebook, sourcePdfIds);
  await redis.set(historyKey, JSON.stringify(history), 'EX', CHAT_HISTORY_TTL_SECONDS);

  return res.status(200).json({
    success: true,
    source: 'db',
    history,
    messages: toMessagesFromHistory(history),
  });
});

module.exports = { chatWithPDF, getNotebookChatHistory };
