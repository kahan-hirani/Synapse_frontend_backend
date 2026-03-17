const asyncHandler = require("../utilities/asyncHandler.utility");
const { embedGemini, askGemini } = require("../utilities/geminiClient.utility");
const { searchChunks, storePDFChunks } = require("../utilities/vectorStore.utility");
const PDF = require("../models/pdf.model");
const Chat = require("../models/chat.model");
const redis = require("../db/redis");

// Prompt builder
const buildPrompt = (context, question) => {
  if (!context || !context.trim()) {
    return `
You are a strict, helpful AI assistant.
The user asked: "${question}".
No PDF context is available.
Answer generally but keep it brief and structured.
    `;
  }

  return `
You are an expert AI assistant specialized in analyzing documents.
Your goal is to answer the user's question **strictly based on the provided PDF Context**.

**Rules:**
1. **Source of Truth:** Use ONLY the provided context. Do not use external knowledge.
2. **Structure:** Your answer must be well-structured using Markdown (bullet points, bold text).
3. **Relevance:** Answer ONLY what is asked. Do not add introductory fluff (like "Here is the summary...") or concluding remarks.
4. **Accuracy:** If the answer is not in the context, clearly state: "The document does not contain this information."
5. **Citations:** Where appropriate, mention the page number, e.g., (Page 1).

**PDF Context:**
${context}

**User Question:**
"${question}"

**Answer:**
  `;
};

const chatWithPDF = asyncHandler(async (req, res, next) => {
  const { pdfId, question } = req.body;

  if (!pdfId || !question) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  // Redis cache
  const cacheKey = `chat:${pdfId}:${question}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.status(200).json(JSON.parse(cached));
  }

  // Get PDF
  const pdfDoc = await PDF.findById(pdfId);
  if (!pdfDoc) {
    return res.status(404).json({ success: false, message: "PDF not found" });
  }

  // ✅ Try vectorStore first to see if data is loaded, but for Gemini Flash we want FULL context if possible.
  // Ideally, we just grab all chunks from the DB document if they are small enough.
  // Since we are using Gemini Flash (1M tokens), we can likely fit the whole 5-page PDF.

  let context = "";
  let citations = [];

  // Strategy: Pass ALL chunks sorted by page
  if (pdfDoc.embeddings && pdfDoc.embeddings.length > 0) {
    // Sort by page order
    const sortedChunks = pdfDoc.embeddings.sort((a, b) => (a.page || 1) - (b.page || 1));

    context = sortedChunks.map(
      (r, i) => `Chunk ${i + 1} (Page ${r.page || 1}): ${r.chunk}`
    ).join("\n\n");

    // For citations, we list all pages involved (or unique pages)
    const uniquePages = [...new Set(sortedChunks.map(c => c.page || 1))];
    citations = uniquePages.map(p => ({ page: p }));

    console.log(`[Chat] Passing full document context (${context.length} chars) to Gemini Flash.`);
  } else {
    // Fallback to RAG if no chunks in DB (repopulate logic omitted for brevity as DB usually has it)
    // Or try searchChunks if you prefer hybrid. But user asked "how do I know it reads all pages".
    // ... existing fallback or fail ...
    return res.status(200).json({
      success: true,
      answer: "⚠️ PDF content not ready. Please re-upload.",
      citations: [],
    });
  }

  // Build prompt
  const prompt = buildPrompt(context, question);

  // Ask Gemini
  const answer = await askGemini(prompt);

  // Save chat
  const chatEntry = await Chat.create({
    user: req.user.id,
    pdf: pdfDoc._id,
    question,
    answer,
    citations: citations,
  });

  const response = {
    success: true,
    answer,
    citations: citations,
    chatId: chatEntry._id,
  };

  await redis.set(cacheKey, JSON.stringify(response), "EX", 600);

  res.status(200).json(response);
});

module.exports = { chatWithPDF };
