const fs = require("fs");
const pdf = require("pdf-parse");

function normalizeLine(line) {
  return line.replace(/\s+/g, " ").trim();
}

function cleanPageText(text, repeatedLines = new Set()) {
  if (!text) return "";

  const lines = String(text)
    .split(/\r?\n/)
    .map((line) => normalizeLine(line))
    .filter(Boolean)
    .filter((line) => line.length > 2);

  const cleanedLines = lines.filter((line) => {
    if (repeatedLines.has(line)) return false;
    if (/^page\s+\d+(\s+of\s+\d+)?$/i.test(line)) return false;
    if (/^\d+\s*\/\s*\d+$/.test(line)) return false;
    return true;
  });

  return cleanedLines.join(" ").replace(/\s+/g, " ").trim();
}

function approxTokenCount(text) {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.ceil(words * 1.3);
}

function chunkTextByTokens(text, {
  chunkSize = 1000,
  overlap = 100,
} = {}) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  const approxWordsPerChunk = Math.max(120, Math.floor(chunkSize / 1.3));
  const approxWordsOverlap = Math.max(20, Math.floor(overlap / 1.3));
  const step = Math.max(1, approxWordsPerChunk - approxWordsOverlap);

  const chunks = [];
  for (let start = 0; start < words.length; start += step) {
    const slice = words.slice(start, start + approxWordsPerChunk);
    if (!slice.length) continue;

    const chunk = slice.join(" ").trim();
    if (!chunk) continue;

    chunks.push({
      text: chunk,
      tokens: approxTokenCount(chunk),
    });

    if (start + approxWordsPerChunk >= words.length) break;
  }

  return chunks;
}

const extractTextFromPDF = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const data = await pdf(buffer);

  const pages = String(data.text || "").split(/\f/);

  const lineFrequency = new Map();
  pages.forEach((pageText) => {
    String(pageText)
      .split(/\r?\n/)
      .map((line) => normalizeLine(line))
      .filter(Boolean)
      .forEach((line) => {
        lineFrequency.set(line, (lineFrequency.get(line) || 0) + 1);
      });
  });

  const repeatedLines = new Set();
  lineFrequency.forEach((count, line) => {
    if (count >= 3 && line.length <= 120) {
      repeatedLines.add(line);
    }
  });

  return pages
    .map((pageText, idx) => ({
      page: idx + 1,
      text: cleanPageText(pageText, repeatedLines),
    }))
    .filter((page) => page.text && page.text.length > 20);
};

module.exports = { extractTextFromPDF, chunkTextByTokens, cleanPageText, approxTokenCount };
