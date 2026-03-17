// vectorStore.utility.js
const { embedGemini } = require("./geminiClient.utility");

// In-memory vector store (for fast retrieval)
// Structure: { pdfId: [{ chunk, embedding, page }] }
const vectorDB = {};

// ✅ Store chunks with embeddings (supports precomputed ones)
// Accepts items shaped like { text, chunk, page, embedding }
const storePDFChunks = async (pdfId, chunks, precomputed = false) => {
  vectorDB[pdfId] = [];

  for (const item of chunks) {
    // Support both 'text' (used in some places) and 'chunk' (DB schema)
    const text = item.text || item.chunk || "";
    const page = item.page || 1;
    let vector = item.embedding;

    // If no precomputed embedding → compute with Gemini
    if (!precomputed) {
      vector = await embedGemini(text);
    }

    if (!vector) continue;

    // Ensure we store a plain Array of Numbers (not a typed array)
    if (typeof vector.slice === "function") {
      // typed arrays and normal arrays both have slice; convert typed arrays safely
      vector = Array.from(vector);
    }

    vectorDB[pdfId].push({
      chunk: text || "EMPTY_CHUNK",
      embedding: vector,
      page,
    });
  }
};

// ✅ Cosine similarity
const cosineSimilarity = (a, b) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return normA && normB ? dot / (normA * normB) : 0;
};

// ✅ Retrieve top K relevant chunks
const searchChunks = async (pdfId, query, k = 3) => {
  const queryEmbedding = await embedGemini(query);
  if (!queryEmbedding || !vectorDB[pdfId]) return [];

  return vectorDB[pdfId]
    .map((item) => ({
      ...item,
      score: cosineSimilarity(queryEmbedding, item.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
};

module.exports = { storePDFChunks, searchChunks };
// Debug helper: expose vector data for a pdfId
const getVectorFor = (pdfId) => vectorDB[pdfId] || [];

module.exports = { storePDFChunks, searchChunks, getVectorFor };
