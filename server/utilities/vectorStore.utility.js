// Lightweight in-memory vector cache keyed by pdfId.
// MongoDB remains the source of truth for persistence.
const vectorDB = {};

function toNumberArray(vector) {
  if (!vector) return null;
  if (Array.isArray(vector)) return vector.map((value) => Number(value));
  if (typeof vector?.slice === 'function') return Array.from(vector).map((value) => Number(value));
  return null;
}

async function storePDFChunks(pdfId, chunks, precomputed = false, embedFn = null) {
  vectorDB[pdfId] = [];

  for (let idx = 0; idx < chunks.length; idx += 1) {
    const item = chunks[idx];
    const text = String(item.text || item.chunk || '').trim();
    if (!text) continue;

    const page = Number(item.page || 1);
    const source = item.source ? String(item.source) : '';
    const chunkId = item.chunkId || `${pdfId}_chunk_${idx + 1}`;

    let embedding = toNumberArray(item.embedding);
    if (!precomputed && !embedding && typeof embedFn === 'function') {
      embedding = await embedFn(text);
      embedding = toNumberArray(embedding);
    }

    if (!embedding || !embedding.length) continue;

    vectorDB[pdfId].push({
      chunkId,
      text,
      chunk: text,
      page,
      source,
      embedding,
    });
  }

  return vectorDB[pdfId];
}

function getVectorFor(pdfId) {
  return vectorDB[pdfId] || [];
}

function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i += 1) {
    const av = Number(a[i] || 0);
    const bv = Number(b[i] || 0);
    dot += av * bv;
    normA += av * av;
    normB += bv * bv;
  }

  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function searchChunksByVector(pdfId, queryEmbedding, k = 20) {
  const query = toNumberArray(queryEmbedding);
  if (!query || !query.length) return [];

  const rows = vectorDB[pdfId] || [];
  return rows
    .map((item) => ({
      ...item,
      score: cosineSimilarity(query, item.embedding),
      pdfId,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

function searchChunksAcrossPdfs(pdfIds, queryEmbedding, k = 20) {
  const all = [];
  (pdfIds || []).forEach((pdfId) => {
    const matches = searchChunksByVector(String(pdfId), queryEmbedding, k);
    all.push(...matches);
  });

  return all.sort((a, b) => b.score - a.score).slice(0, k);
}

module.exports = {
  storePDFChunks,
  getVectorFor,
  searchChunksByVector,
  searchChunksAcrossPdfs,
};
