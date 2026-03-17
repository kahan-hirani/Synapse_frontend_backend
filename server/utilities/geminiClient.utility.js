const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY` automatically if set.
// or we can pass it explicitly: { apiKey: process.env.GEMINI_API_KEY }
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

/**
 * Generates embeddings using text-embedding-004
 * @param {string} text
 * @returns {Promise<number[] | null>}
 */
const embedGemini = async (text) => {
  if (!text || !text.trim()) return null;

  try {
    const response = await ai.models.embedContent({
      model: "text-embedding-004",
      contents: text,
    });

    // The new SDK structure for embeddings: response.embeddings[0].values
    if (response && response.embeddings && response.embeddings[0]) {
      return response.embeddings[0].values;
    }
    return null;
  } catch (err) {
    console.error("Embed error:", err.message);
    return null;
  }
};

/**
 * Chat with PDF context using Gemini Model
 * @param {string} prompt
 * @returns {Promise<string>}
 */
const askGemini = async (prompt) => {
  try {
    console.log(`[askGemini] Using model: ${GEMINI_MODEL}`);

    // Construct explicit content object to be safe (matching curl content structure)
    const contents = [
      {
        role: "user",
        parts: [
          { text: prompt }
        ]
      }
    ];

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: contents,
      config: {
        // Optional: add config if needed, though defaults are usually fine
      }
    });

    // Check if response has text
    // The SDK often exposes .text() as a helper, or properties
    if (response) {
      if (typeof response.text === 'function') {
        return response.text();
      }
      if (response.text) {
        return response.text;
      }
      // If direct text property isn't there, check candidates
      if (response.candidates && response.candidates[0] && response.candidates[0].content) {
        const parts = response.candidates[0].content.parts || [];
        return parts.map(p => p.text).join('') || "⚠️ Empty text in parts.";
      }
    }

    return "⚠️ Empty response from Gemini (No text found).";

  } catch (err) {
    console.error("[askGemini] Error details:");
    console.error(`- Model: ${GEMINI_MODEL}`);
    console.error(`- Message: ${err.message}`);
    if (err.response) {
      console.error(`- Response data: ${JSON.stringify(err.response, null, 2)}`);
    }
    return `⚠️ Gemini Error: ${err.message}`;
  }
};

module.exports = { embedGemini, askGemini };
