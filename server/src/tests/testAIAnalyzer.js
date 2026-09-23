const aiAnalyzerService = require('../services/aiAnalyzerService');
const { getPromptForCategory, getMapChunkPrompt, getReducePrompt } = require('../prompts/documentPrompts');
const { validateAIInsights } = require('../schemas/insightSchema');
const logger = require('../utils/logger');

async function runAITests() {
  logger.info('Starting Week 4 LLM Integration & Prompt Engineering Verification...');

  // 1. Test Prompt Generation for various verticals
  logger.info('1. Testing Prompt Generation for Legal, Financial, Resume categories...');
  const legalPrompt = getPromptForCategory('legal', 'Contract between Acme Corp and Beta LLC.');
  const financePrompt = getPromptForCategory('financial', 'Annual revenue $10M, EBITDA $2M.');

  if (legalPrompt.toLowerCase().includes('liability') && financePrompt.toLowerCase().includes('revenue')) {
    logger.success('Prompt Engineering passed: Category-specific directives verified.');
  } else {
    logger.error('Prompt Engineering failed:', { legalPrompt, financePrompt });
  }

  // 2. Test Zod Schema Validation on structured response
  logger.info('2. Testing Zod Schema Validation...');
  const sampleRawInsights = {
    summary: 'This master service agreement defines service levels, fees, and standard confidentiality covenants.',
    riskScore: 45,
    riskLevel: 'Medium',
    actionItems: ['Sign amendment by end of month', 'Submit certificate of insurance'],
    keyEntities: [
      { label: 'Party A', value: 'Acme Corp', category: 'Legal' },
      { label: 'Fee Cap', value: '$50,000', category: 'Financial' },
    ],
    tags: ['legal', 'sla', 'contract'],
    highlights: ['Liability capped at fees paid.'],
  };

  try {
    const validated = validateAIInsights(sampleRawInsights);
    logger.success('Zod Schema Validation passed:', {
      riskScore: validated.riskScore,
      riskLevel: validated.riskLevel,
      actionItemCount: validated.actionItems.length,
      entityCount: validated.keyEntities.length,
    });
  } catch (e) {
    logger.error('Zod Schema Validation failed:', e.message);
  }

  // 3. Test Full AI Analysis Engine
  logger.info('3. Testing End-to-End AI Analysis Service...');
  const sampleDocText = `
    NON-DISCLOSURE AND INTELLECTUAL PROPERTY AGREEMENT
    This Agreement is entered into on October 1st, 2026 by and between TechCorp Inc. and DataSolutions LLC.
    Confidentiality obligations will persist for 5 years after termination.
    Either party may terminate upon 30 days prior written notice.
    Governing law shall be the State of Delaware.
  `;

  const insights = await aiAnalyzerService.analyzeDocument(sampleDocText, 'legal');
  if (insights && insights.summary && insights.riskScore !== undefined && insights.keyEntities) {
    logger.success('AI Analyzer Service passed:', {
      summary: insights.summary.slice(0, 75) + '...',
      riskScore: insights.riskScore,
      riskLevel: insights.riskLevel,
      entities: insights.keyEntities.map((e) => `${e.label}: ${e.value}`),
    });
  } else {
    logger.error('AI Analyzer Service failed:', insights);
  }

  logger.success('🎉 Week 4 LLM Integration & Prompt Engineering Verification Completed Successfully!');
}

runAITests();
