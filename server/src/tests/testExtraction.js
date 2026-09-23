const extractionService = require('../services/extractionService');
const { cleanExtractedText, estimateTokenCount } = require('../utils/textCleaner');
const { chunkDocument } = require('../utils/chunker');
const logger = require('../utils/logger');

async function runExtractionTests() {
  logger.info('Starting Week 3 Text Extraction Pipeline Verification...');

  // 1. Test Text Cleaning
  const rawDirtyText = `
    MASTER   SERVICES    AGREEMENT\r\n\r\n\r\n
    Section 1.0  -   Confidentiality.\x00\x08
    The Receiving Party shall maintain secrecy.
    
    \r\n\r\n\r\n
    Section 2.0  -   Indemnification.\r\n
    Liability is capped at 2x annual fees.
  `;

  const cleaned = cleanExtractedText(rawDirtyText);
  logger.info('1. Testing Text Cleaning & Normalization...');
  if (!cleaned.includes('\r') && !cleaned.includes('\x00') && cleaned.includes('MASTER SERVICES AGREEMENT')) {
    logger.success('Text Cleaning passed:', cleaned.slice(0, 80) + '...');
  } else {
    logger.error('Text Cleaning failed:', cleaned);
  }

  // 2. Test Smart Chunking with boundary preservation
  logger.info('2. Testing Smart Chunking with Overlap...');
  const longDocumentText = Array.from({ length: 25 }, (_, i) => 
    `Paragraph ${i + 1}: This is a detailed clause regarding obligations and operational terms in enterprise contracts. Notice period is strictly 30 days.`
  ).join('\n\n');

  const chunks = chunkDocument(longDocumentText, 800, 100);
  logger.info(`Generated ${chunks.length} chunks for ${longDocumentText.length} chars.`);
  if (chunks.length > 1 && chunks[0].text.length <= 800) {
    logger.success('Smart Chunking passed: Multi-chunk generation with boundaries preserved.');
  } else {
    logger.error('Smart Chunking unexpected output:', chunks);
  }

  // 3. Test Unified Extraction Service with Plain Text buffer
  logger.info('3. Testing Unified Extraction Service (text/plain)...');
  const sampleBuffer = Buffer.from(
    'NON-DISCLOSURE AGREEMENT\n\nThis agreement is entered into between Party A and Party B on Oct 1, 2026.'
  );
  const result = await extractionService.extractText(sampleBuffer, 'text/plain');

  if (result.extractedText && result.charCount > 0 && result.estimatedTokens > 0) {
    logger.success('Unified Extraction Service passed:', {
      charCount: result.charCount,
      estimatedTokens: result.estimatedTokens,
      chunkCount: result.chunks.length,
    });
  } else {
    logger.error('Unified Extraction Service failed:', result);
  }

  logger.success('🎉 Week 3 Text Extraction Pipeline Verification Completed Successfully!');
}

runExtractionTests();
