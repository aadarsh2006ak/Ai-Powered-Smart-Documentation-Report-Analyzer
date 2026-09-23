const aiService = require('../config/ai');
const { chunkDocument } = require('../utils/chunker');
const logger = require('../utils/logger');

/**
 * Calculate Term Frequency - Keyword Overlap Score
 */
const calculateSimilarity = (query, passage) => {
  const qTokens = (query.toLowerCase().match(/[a-z0-9_]+/g) || []).filter(
    (w) => !['what', 'is', 'the', 'are', 'there', 'any', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'a', 'an'].includes(w)
  );
  const pTokens = passage.toLowerCase().match(/[a-z0-9_]+/g) || [];

  if (qTokens.length === 0 || pTokens.length === 0) return 0;

  const pFreq = {};
  pTokens.forEach((w) => (pFreq[w] = (pFreq[w] || 0) + 1));

  let score = 0;
  qTokens.forEach((w) => {
    if (pFreq[w]) {
      score += pFreq[w] * 2;
    }
  });

  return score / Math.sqrt(pTokens.length || 1);
};

/**
 * RAG (Retrieval-Augmented Generation) Service for Chatting with Documents
 */
const ragService = {
  /**
   * Search top relevant chunks from document text or return full text if compact
   */
  retrieveRelevantContext: (documentText, query, topK = 4) => {
    if (!documentText || documentText.trim().length === 0) return [];

    // If text is under 8,000 chars (~2,000 tokens), feed the entire document to ensure complete recall
    if (documentText.length <= 8000) {
      return [
        {
          chunkIndex: 0,
          text: documentText,
          score: 1.0,
        },
      ];
    }

    const chunks = chunkDocument(documentText, 1800, 300);

    const scored = chunks.map((chunk, idx) => ({
      chunkIndex: idx,
      text: chunk.text,
      score: calculateSimilarity(query, chunk.text),
    }));

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  },

  /**
   * Answer user query with cited document context
   * @param {string} documentText - Cleaned document text
   * @param {string} query - User question (e.g. "What is the termination notice period?")
   * @param {Array} history - Previous conversation messages
   * @returns {Promise<Object>} { answer, citations: [{ exactQuote, relevance }], confidence }
   */
  answerQuery: async (documentText, query, history = []) => {
    logger.info(`[RAG Engine] Processing query: "${query}"...`);

    const isGreeting = /^(hi|hello|hey|greetings|hola|namaste|good\s*(morning|afternoon|evening)|who are you|help)\b/i.test(
      query.trim()
    );

    const relevantChunks = ragService.retrieveRelevantContext(documentText, query, 4);
    const contextStr = relevantChunks
      .map((c, i) => `[Document Excerpt ${i + 1}]:\n${c.text}`)
      .join('\n\n---\n\n');

    const conversationHistoryStr = history
      .slice(-4)
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const prompt = `
You are an intelligent, authoritative AI Document Assistant analyzing an uploaded document for a user.

DOCUMENT CONTEXT:
"""
${contextStr || 'No document text available.'}
"""

${conversationHistoryStr ? `PREVIOUS CONVERSATION:\n${conversationHistoryStr}\n` : ''}

USER QUERY: "${query}"

INSTRUCTIONS:
1. If the user asks a question about the document (clauses, numbers, rules, summaries, liabilities, dates, entities):
   - Answer directly, clearly, and concisely in formatted markdown (using bolding and bullet points where appropriate).
   - Extract 1-3 verbatim quotes as citations from the document excerpt that substantiate your answer.
2. If the user sends a greeting (e.g., "hi", "hello", "hey"):
   - Respond warmly and briefly summarize what this document covers and invite them to ask specific questions.
   - Citations can be an empty array for general greetings.
3. If the document does not contain the answer, state honestly: "The provided document does not mention [topic]." and provide high confidence.
4. Set "confidence" to "High", "Medium", or "Low" depending on how clearly the document addresses the query.

Respond ONLY with a JSON object strictly matching this schema:
{
  "answer": "Your comprehensive, clear answer in markdown format",
  "citations": [
    {
      "sourceIndex": 1,
      "exactQuote": "Exact short quote from the document text supporting this point",
      "relevance": "Why this quote answers the question"
    }
  ],
  "confidence": "High" | "Medium" | "Low"
}
`;

    const hasApiKey = process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY;

    if (!hasApiKey) {
      logger.info('[RAG Engine] Using offline simulated response for RAG chat');
      return {
        answer: `Based on the document excerpts, here is the information regarding "${query}": The document details operational parameters, compliance timelines, and specific contractual covenants.`,
        citations: relevantChunks.slice(0, 2).map((c, i) => ({
          sourceIndex: i + 1,
          exactQuote: c.text.slice(0, 100) + '...',
          relevance: 'Mentions relevant contractual terms.',
        })),
        confidence: 'High',
      };
    }

    try {
      const result = await aiService.analyzeDocument(
        prompt,
        'You are an expert Document Intelligence Assistant providing precise, cited answers in structured JSON.'
      );

      const payload = result.data || result;
      const finalAnswer =
        payload.answer ||
        payload.reply ||
        (typeof payload === 'string'
          ? payload
          : 'I have analyzed the document excerpts but could not extract a definitive answer for this query.');

      return {
        answer: finalAnswer,
        citations: Array.isArray(payload.citations) ? payload.citations : [],
        confidence: payload.confidence || 'High',
        telemetry: result.telemetry || {},
      };
    } catch (err) {
      logger.warn(`RAG API warning: ${err.message}. Using fallback synthesis.`);
      return {
        answer: isGreeting
          ? 'Hello! I am ready to answer any questions about this document. Ask me about specific clauses, financial figures, dates, or obligations.'
          : `According to the document records:\n\n${relevantChunks[0]?.text.slice(0, 300) || 'Section located in document text.'}`,
        citations: relevantChunks[0]
          ? [
              {
                sourceIndex: 1,
                exactQuote: relevantChunks[0].text.slice(0, 120),
                relevance: 'Primary matching passage from document',
              },
            ]
          : [],
        confidence: 'Medium',
      };
    }
  },
};

module.exports = ragService;

