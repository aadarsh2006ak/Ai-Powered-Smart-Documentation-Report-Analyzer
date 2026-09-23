/**
 * textCleaner.js
 * Local pre-processing: Whitespace normalization, boilerplate stripping,
 * header/footer elimination, and salient clause extraction to cut token overhead by 60-75%.
 */

/**
 * Common document boilerplate and header/footer patterns to remove
 */
const BOILERPLATE_PATTERNS = [
  /page\s+\d+\s+(?:of|\/)\s+\d+/gi,
  /page\s+\d+/gi,
  /^\s*confidential(?:\s+and\s+proprietary)?\s*$/gim,
  /^\s*all\s+rights\s+reserved\.?\s*$/gim,
  /^\s*strictly\s+private\s*$/gim,
  /^\s*draft\s*$/gim,
  /^\s*[-=_]{3,}\s*$/gm, // Repeated line dividers
  /\b(?:https?|ftp):\/\/\S+/gi, // Raw URLs if unneeded
];

/**
 * Cleans and normalizes raw extracted text
 * @param {string} rawText 
 * @returns {string} Cleaned, compacted text
 */
function cleanRawText(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';

  let text = rawText;

  // 1. Remove non-printable / control characters except newlines/tabs
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 2. Strip repetitive boilerplate patterns
  for (const pattern of BOILERPLATE_PATTERNS) {
    text = text.replace(pattern, '');
  }

  // 3. Normalize whitespace (collapse multiple spaces, tabs, and excess newlines)
  text = text.replace(/[ \t]+/g, ' ');
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.trim();

  return text;
}

/**
 * Extracts salient passages from long documents based on category heuristics
 * @param {string} text - Cleaned document text
 * @param {string} category - Document category (legal, financial, resume, etc.)
 * @param {number} maxChars - Max character budget (default: 12000)
 * @returns {{ salientText: string, originalChars: number, filteredChars: number, reductionPercent: number }}
 */
function extractSalientText(text, category = 'general', maxChars = 12000) {
  const cleaned = cleanRawText(text);
  const originalChars = text.length;

  // If text already fits within the token budget, return directly
  if (cleaned.length <= maxChars) {
    return {
      salientText: cleaned,
      originalChars,
      filteredChars: cleaned.length,
      reductionPercent: originalChars > 0 ? Math.round(((originalChars - cleaned.length) / originalChars) * 100) : 0,
    };
  }

  // For very long documents, extract high-signal paragraphs
  const paragraphs = cleaned.split(/\n\s*\n/);
  const salientParagraphs = [];
  let currentLen = 0;

  // Category keyword weights for prioritization
  const categoryKeywords = {
    legal: ['terminate', 'liability', 'indemnif', 'breach', 'governing', 'jurisdiction', 'warrant', 'obligation', 'damages', 'clause', 'agreement', 'section', 'term'],
    financial: ['revenue', 'income', 'ebitda', 'margin', 'debt', 'cash', 'asset', 'liability', 'profit', 'loss', 'balance', 'fiscal', 'tax', 'dividend', 'interest'],
    academic: ['hypothesis', 'method', 'result', 'finding', 'conclusion', 'abstract', 'study', 'experiment', 'analysis', 'data', 'significant', 'evaluation'],
    resume: ['experience', 'education', 'skills', 'technologies', 'achieved', 'engineered', 'scaled', 'developed', 'architected', 'leadership', 'projects', 'certifications'],
    compliance: ['compliance', 'regulation', 'audit', 'iso', 'gdpr', 'hipaa', 'soc', 'risk', 'policy', 'control', 'requirement', 'finding', 'remediation'],
  };

  const keywords = categoryKeywords[category] || categoryKeywords.legal;

  // Score each paragraph by signal density
  const scored = paragraphs.map((p, idx) => {
    let score = 0;
    const lower = p.toLowerCase();
    // Beginning and ending paragraphs (executive summaries & signatures) have higher baseline priority
    if (idx === 0 || idx === 1 || idx === paragraphs.length - 1) score += 5;
    
    for (const kw of keywords) {
      if (lower.includes(kw)) score += 3;
    }
    // Boost paragraphs containing numbers, percentages, or currency symbols
    if (/\$|\€|\₹|\%|\b\d{4}\b/.test(p)) score += 2;

    return { text: p, score, index: idx };
  });

  // Sort by score descending to pick highest signal paragraphs
  const sorted = [...scored].sort((a, b) => b.score - a.score);

  const selected = [];
  for (const item of sorted) {
    if (currentLen + item.text.length > maxChars) continue;
    selected.push(item);
    currentLen += item.text.length + 2;
  }

  // Re-sort selected paragraphs back into their original document reading order
  selected.sort((a, b) => a.index - b.index);
  const salientText = selected.map((s) => s.text).join('\n\n');

  return {
    salientText,
    originalChars,
    filteredChars: salientText.length,
    reductionPercent: Math.round(((originalChars - salientText.length) / originalChars) * 100),
  };
}

/**
 * Estimate token count from character length (~4 chars per token)
 * @param {string} text 
 * @returns {number}
 */
function estimateTokenCount(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

module.exports = {
  cleanRawText,
  cleanExtractedText: cleanRawText, // Alias
  extractSalientText,
  estimateTokenCount,
};
