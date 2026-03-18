const HF_BASE_URL = process.env.HF_INFERENCE_BASE_URL || 'https://router.huggingface.co/hf-inference/models';
const HF_CHAT_COMPLETIONS_URL = process.env.HF_CHAT_COMPLETIONS_URL || 'https://router.huggingface.co/v1/chat/completions';

const EMBEDDING_MODEL = process.env.HF_EMBEDDING_MODEL || 'BAAI/bge-large-en-v1.5';
const RERANKER_MODEL = process.env.HF_RERANKER_MODEL || 'BAAI/bge-reranker-large';
const LLM_MODEL = process.env.HF_LLM_MODEL || 'meta-llama/Meta-Llama-3-8B-Instruct';
const LLM_FALLBACK_MODELS = String(
  process.env.HF_LLM_FALLBACK_MODELS || 'Qwen/Qwen2.5-7B-Instruct,mistralai/Mistral-7B-Instruct-v0.3',
)
  .split(',')
  .map((model) => model.trim())
  .filter(Boolean);

function ensureApiKey() {
  const token = process.env.HUGGINGFACE_API_KEY;
  if (!token) {
    throw new Error('HUGGINGFACE_API_KEY is missing in environment variables.');
  }
  return token;
}

async function callInference(model, payload, { retries = 4 } = {}) {
  const token = ensureApiKey();
  const url = `${HF_BASE_URL}/${encodeURIComponent(model)}`;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const raw = await response.text();
    let data = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch {
      data = raw;
    }

    if (response.ok) return data;

    const errorMessage =
      (typeof data === 'object' && data?.error) ||
      (typeof data === 'string' ? data : `HTTP ${response.status}`);

    const estimated = typeof data === 'object' ? data?.estimated_time : null;
    if (estimated && attempt < retries) {
      const delayMs = Math.min(8000, Math.max(800, Math.round(Number(estimated) * 1000)));
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      continue;
    }

    if (response.status >= 500 && attempt < retries) {
      const delayMs = 800 * (attempt + 1);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      continue;
    }

    throw new Error(`HF inference failed for ${model}: ${errorMessage}`);
  }

  throw new Error(`HF inference failed for ${model}: retries exhausted`);
}

async function callRouterChatCompletions(model, prompt) {
  const token = ensureApiKey();

  const response = await fetch(HF_CHAT_COMPLETIONS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 512,
      temperature: 0.2,
      top_p: 0.9,
    }),
  });

  const raw = await response.text();
  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw;
  }

  if (!response.ok) {
    const errorMessage =
      (typeof data === 'object' && (data?.error?.message || data?.error)) ||
      (typeof data === 'string' ? data : `HTTP ${response.status}`);
    throw new Error(`HF chat completion failed for ${model}: ${errorMessage}`);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content || !String(content).trim()) {
    throw new Error(`HF chat completion returned empty content for ${model}`);
  }

  return String(content).trim();
}

function normalizeEmbedding(output) {
  if (!output) return null;
  if (Array.isArray(output) && typeof output[0] === 'number') return output;
  if (Array.isArray(output) && Array.isArray(output[0])) return output[0];
  if (Array.isArray(output?.embedding)) return output.embedding;
  if (Array.isArray(output?.embeddings?.[0])) return output.embeddings[0];
  return null;
}

async function embedText(text) {
  if (!text || !text.trim()) return null;

  const data = await callInference(EMBEDDING_MODEL, {
    inputs: text,
    options: { wait_for_model: true, use_cache: true },
  });

  const embedding = normalizeEmbedding(data);
  if (!embedding) {
    throw new Error('Embedding response did not contain a valid vector.');
  }
  return embedding;
}

function fallbackRerank(query, chunks) {
  const qTokens = new Set(query.toLowerCase().split(/\W+/).filter(Boolean));
  return chunks
    .map((chunk) => {
      const cTokens = new Set(String(chunk.text || '').toLowerCase().split(/\W+/).filter(Boolean));
      let overlap = 0;
      qTokens.forEach((token) => {
        if (cTokens.has(token)) overlap += 1;
      });
      const score = qTokens.size ? overlap / qTokens.size : 0;
      return { ...chunk, rerankScore: score };
    })
    .sort((a, b) => b.rerankScore - a.rerankScore);
}

function parseRerankScores(data, length) {
  if (!data) return null;

  if (Array.isArray(data) && data.length === length && typeof data[0] === 'number') {
    return data;
  }

  if (Array.isArray(data) && data.length === length && typeof data[0] === 'object') {
    return data.map((item) => {
      if (typeof item?.score === 'number') return item.score;
      if (Array.isArray(item) && typeof item[0]?.score === 'number') return item[0].score;
      return 0;
    });
  }

  if (Array.isArray(data) && data.length === 1 && Array.isArray(data[0]) && data[0].length === length) {
    return data[0].map((item) => Number(item?.score || 0));
  }

  return null;
}

async function rerankChunks(query, chunks, topN = 5) {
  if (!Array.isArray(chunks) || !chunks.length) return [];

  try {
    const pairInputs = chunks.map((chunk) => ({
      text: query,
      text_pair: chunk.text,
    }));

    const data = await callInference(RERANKER_MODEL, {
      inputs: pairInputs,
      options: { wait_for_model: true, use_cache: false },
    });

    const scores = parseRerankScores(data, chunks.length);
    if (!scores) {
      return fallbackRerank(query, chunks).slice(0, topN);
    }

    return chunks
      .map((chunk, idx) => ({ ...chunk, rerankScore: Number(scores[idx] || 0) }))
      .sort((a, b) => b.rerankScore - a.rerankScore)
      .slice(0, topN);
  } catch {
    return fallbackRerank(query, chunks).slice(0, topN);
  }
}

function parseGeneratedText(data) {
  if (!data) return '';
  if (typeof data === 'string') return data;
  if (Array.isArray(data) && typeof data[0]?.generated_text === 'string') return data[0].generated_text;
  if (typeof data?.generated_text === 'string') return data.generated_text;
  if (Array.isArray(data) && typeof data[0] === 'string') return data[0];
  return '';
}

async function generateAnswer(prompt) {
  const modelsToTry = [LLM_MODEL, ...LLM_FALLBACK_MODELS.filter((model) => model !== LLM_MODEL)];
  const errors = [];

  for (const model of modelsToTry) {
    try {
      try {
        const data = await callInference(model, {
          inputs: prompt,
          parameters: {
            max_new_tokens: 512,
            temperature: 0.2,
            top_p: 0.9,
            return_full_text: false,
          },
          options: { wait_for_model: true, use_cache: false },
        });

        const answer = parseGeneratedText(data).trim();
        if (!answer) {
          errors.push(`${model}: empty response`);
          continue;
        }

        return answer;
      } catch (hfInferenceError) {
        const message = String(hfInferenceError?.message || '');
        const shouldTryChatCompletions = /not found|404/i.test(message);
        if (!shouldTryChatCompletions) {
          throw hfInferenceError;
        }

        const chatAnswer = await callRouterChatCompletions(model, prompt);
        if (!chatAnswer) {
          errors.push(`${model}: empty chat-completions response`);
          continue;
        }

        return chatAnswer;
      }
    } catch (error) {
      errors.push(error.message || `${model}: unknown error`);
    }
  }

  throw new Error(`LLM generation failed across all models. ${errors.join(' | ')}`);
}

module.exports = {
  EMBEDDING_MODEL,
  RERANKER_MODEL,
  LLM_MODEL,
  embedText,
  rerankChunks,
  generateAnswer,
};
