/**
 * Smart Token-Aware Document Chunker
 * Splits large documents exceeding LLM context windows using sliding windows with overlap,
 * preserving natural paragraph and sentence boundaries.
 */

const DEFAULT_CHUNK_SIZE = 4000; // ~1,000 tokens
const DEFAULT_CHUNK_OVERLAP = 400; // ~100 tokens

/**
 * Split text into semantic chunks
 * @param {string} text - Cleaned document text
 * @param {number} maxChunkSize - Maximum character length per chunk
 * @param {number} overlap - Overlapping character count between adjacent chunks
 * @returns {Array<{ chunkIndex: number, text: string, charCount: number, estimatedTokens: number }>}
 */
const chunkDocument = (
  text,
  maxChunkSize = DEFAULT_CHUNK_SIZE,
  overlap = DEFAULT_CHUNK_OVERLAP
) => {
  if (!text || typeof text !== 'string') return [];

  // If text is smaller than chunk size, return single chunk
  if (text.length <= maxChunkSize) {
    return [
      {
        chunkIndex: 0,
        text,
        charCount: text.length,
        estimatedTokens: Math.ceil(text.length / 4),
      },
    ];
  }

  const chunks = [];
  let startIndex = 0;
  let chunkIndex = 0;

  while (startIndex < text.length) {
    let endIndex = startIndex + maxChunkSize;

    // If this is the last chunk
    if (endIndex >= text.length) {
      const chunkText = text.slice(startIndex).trim();
      if (chunkText.length > 0) {
        chunks.push({
          chunkIndex,
          text: chunkText,
          charCount: chunkText.length,
          estimatedTokens: Math.ceil(chunkText.length / 4),
        });
      }
      break;
    }

    // Try to find a natural boundary near endIndex:
    // Priority 1: Double newline (paragraph break)
    let splitIndex = text.lastIndexOf('\n\n', endIndex);

    // Priority 2: Single newline (line break)
    if (splitIndex <= startIndex || splitIndex < endIndex - 800) {
      splitIndex = text.lastIndexOf('\n', endIndex);
    }

    // Priority 3: Sentence period ('. ')
    if (splitIndex <= startIndex || splitIndex < endIndex - 800) {
      splitIndex = text.lastIndexOf('. ', endIndex);
      if (splitIndex !== -1) splitIndex += 1; // include period
    }

    // Priority 4: Space character
    if (splitIndex <= startIndex || splitIndex < endIndex - 800) {
      splitIndex = text.lastIndexOf(' ', endIndex);
    }

    // Fallback: Hard split at endIndex if no natural boundary found
    if (splitIndex <= startIndex) {
      splitIndex = endIndex;
    }

    const chunkText = text.slice(startIndex, splitIndex).trim();
    if (chunkText.length > 0) {
      chunks.push({
        chunkIndex,
        text: chunkText,
        charCount: chunkText.length,
        estimatedTokens: Math.ceil(chunkText.length / 4),
      });
      chunkIndex++;
    }

    // Move startIndex forward with overlap
    startIndex = Math.max(splitIndex - overlap, startIndex + 1);
  }

  return chunks;
};

module.exports = {
  chunkDocument,
  DEFAULT_CHUNK_SIZE,
  DEFAULT_CHUNK_OVERLAP,
};
