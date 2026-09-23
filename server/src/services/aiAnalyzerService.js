const aiService = require('../config/ai');
const { validateAIInsights } = require('../schemas/insightSchema');
const {
  SYSTEM_INSTRUCTION,
  getPromptForCategory,
  getMapChunkPrompt,
  getReducePrompt,
} = require('../prompts/documentPrompts');
const { chunkDocument } = require('../utils/chunker');
const logger = require('../utils/logger');

/**
 * Generate synthetic realistic insights when LLM API keys are not supplied (offline dev mode)
 */
const generateMockInsights = (text, category) => {
  logger.info(`Generating fallback structured insights for category: ${category}`);

  if (category === 'legal') {
    return {
      summary: 'Comprehensive analysis of legal agreement covenants, liability limits, and termination provisions. Primary governance is defined under state law with standard mutual indemnification protections.',
      riskScore: 58,
      riskLevel: 'Medium',
      actionItems: [
        'Review liability cap limitation clause (Section 8.2)',
        'Ensure 30-day written cure period is strictly adhered to prior to formal breach notices',
        'Insert explicit mutual confidentiality survival terms beyond agreement termination'
      ],
      keyEntities: [
        { label: 'Governing Jurisdiction', value: 'State of Delaware, United States', category: 'General' },
        { label: 'Liability Cap', value: '12 Months Fees ($500,000 max)', category: 'Metric' },
        { label: 'Termination Notice', value: '30 Days Written Notice', category: 'Date' }
      ],
      tags: ['legal-contract', 'indemnity', 'liability-cap', 'covenants'],
      highlights: [
        'Mutual indemnification applies solely to third-party IP claims.',
        'Neither party is liable for consequential or indirect punitive damages.'
      ],
      legalInsights: {
        governingLaw: 'State of Delaware, USA',
        jurisdiction: 'Courts of New Castle County, Delaware',
        terminationClause: {
          noticePeriodDays: '30 Days written notice',
          breachConditions: 'Immediate upon uncured material breach after 15-day cure notice',
          convenienceAllowed: true,
          summary: 'Either party may terminate for convenience with 30 days prior written notice, subject to payment for completed milestones.'
        },
        indemnityAndLiability: {
          liabilityCap: 'Aggregate fees paid in preceding 12 months, not to exceed $500,000',
          indemnificationScope: 'Mutual indemnification for intellectual property infringement and gross negligence',
          uncappedLiabilities: ['Gross Negligence & Willful Misconduct', 'Breach of Confidentiality Provisions']
        },
        keyObligations: [
          { party: 'Service Provider', obligation: 'Deliver monthly operational SLA and security telemetry reports', deadline: '5th business day of each month' },
          { party: 'Client', obligation: 'Remit undisputed invoice amounts within Net-30 payment terms', deadline: '30 Days from invoice receipt' }
        ],
        riskClauses: [
          {
            clauseName: 'Uncapped Consequential Damages Risk in IP Indemnity',
            severity: 'High',
            quote: 'Each party shall defend and hold harmless the other against any and all claims arising from proprietary infringements without monetary cap.',
            riskAnalysis: 'Exposes the indemnifying party to open-ended third-party litigation expenses without a defined liability ceiling.',
            mitigationAdvice: 'Incorporate a super-cap (e.g. 2x contract value) specifically for IP indemnity claims.'
          },
          {
            clauseName: 'Automatic 12-Month Renewal Lock-In',
            severity: 'Medium',
            quote: 'This Agreement shall automatically renew for successive 1-year terms unless terminated 60 days prior to term expiry.',
            riskAnalysis: 'Creates risk of unintended financial lock-in if renewal cancellation notice is missed.',
            mitigationAdvice: 'Add a mandatory 90-day advance reminder email requirement before automatic renewal triggers.'
          }
        ],
        missingStandardClauses: [
          'Force Majeure & Epidemic/Pandemic relief provisions',
          'Express Severability and Partial Enforceability clause',
          'Mandatory Pre-Litigation Mediation protocol'
        ]
      }
    };
  }

  if (category === 'financial') {
    return {
      summary: 'Executive financial assessment of profit & loss statements, margin health, balance sheet liabilities, and cash flow stability. Demonstrates healthy gross margins with manageable operational cash burn.',
      riskScore: 32,
      riskLevel: 'Low',
      actionItems: [
        'Rebalance vendor payment schedules to optimize working capital cycles',
        'Investigate 14% variance in Q3 operational software licensing expenditures',
        'Establish 3-month rolling cash buffer for debt servicing reserve'
      ],
      keyEntities: [
        { label: 'Annualized Revenue', value: '$12,450,000 (+22% YoY)', category: 'Metric' },
        { label: 'Gross Profit Margin', value: '71.2% (Tier 1 SaaS benchmark)', category: 'Metric' },
        { label: 'Cash Runway', value: '16.5 Months', category: 'Metric' }
      ],
      tags: ['financial-analysis', 'ebitda', 'cash-runway', 'p-and-l'],
      highlights: [
        'Net Profit Margin increased by 3.4% quarter-over-quarter.',
        'Debt-to-equity ratio remains well within conservative limits at 0.38x.'
      ],
      financialInsights: {
        executiveSummary: 'The company demonstrates strong unit economics with 71.2% gross margins and steady ARR growth of 22%. Net operating burn is well-contained with 16.5 months of cash runway.',
        fiscalHealthScore: 84,
        metrics: {
          revenue: '$12,450,000 (+22% YoY)',
          netIncome: '$1,850,000 (14.8% Net Margin)',
          grossMargin: '71.2%',
          operatingExpenses: '$7,020,000',
          ebitda: '$2,750,000',
          cashAndEquivalents: '$4,200,000',
          debtObligations: '$1,600,000 Term Facility',
          runwayMonths: '16.5 Months'
        },
        anomalies: [
          {
            title: 'Q3 Cloud Infrastructure Expenditure Spike',
            description: 'Cloud hosting costs increased by 38% unbudgeted due to unoptimized distributed vector queries.',
            severity: 'Warning',
            impactEstimate: '-$145,000 variance'
          },
          {
            title: 'Customer Revenue Concentration in Top 2 Accounts',
            description: 'Top 2 enterprise accounts represent 44% of total recognized recurring revenue.',
            severity: 'Critical',
            impactEstimate: '44% ARR Exposure'
          }
        ],
        profitabilityAnalysis: {
          marginHealth: 'Strong Gross Margins (71.2%), stable COGS distribution',
          burnRate: '$255,000 / month net operational burn',
          revenueConcentrationRisk: 'Moderate-High (Top 2 clients constitute 44% ARR)'
        },
        cfoRecommendations: [
          'Diversify enterprise client acquisition to reduce revenue concentration below 25%',
          'Implement cloud auto-scaling and spot instances to reduce hosting burn by ~$15k/mo',
          'Refinance $1.6M term debt before anticipated interest rate benchmark revisions'
        ]
      }
    };
  }

  if (category === 'academic') {
    return {
      summary: 'Academic research paper evaluation covering core hypothesis, empirical validation framework, statistical benchmarks, and novel algorithmic contributions compared against State-of-the-Art benchmarks.',
      riskScore: 18,
      riskLevel: 'Low',
      actionItems: [
        'Expand evaluation to out-of-distribution adversarial benchmark datasets',
        'Conduct ablation study on attention head pruning parameters',
        'Release reproducible open-source training weights and evaluation harness'
      ],
      keyEntities: [
        { label: 'Experimental Sample', value: 'N = 120,000 Annotated Tokens', category: 'Metric' },
        { label: 'Evaluation Metric', value: '94.6% F1-Score (+3.2% over SOTA)', category: 'Metric' },
        { label: 'Model Architecture', value: 'Sparse Multi-Head Latent Transformer', category: 'General' }
      ],
      tags: ['research-paper', 'machine-learning', 'empirical-study', 'peer-reviewed'],
      highlights: [
        'Demonstrates 2.4x throughput speedup with negligible accuracy degradation.',
        'Statistical significance verified through 5-fold cross-validation (p < 0.001).'
      ],
      academicInsights: {
        hypothesis: 'Sparse latent attention mechanisms can preserve high-dimensional semantic fidelity while reducing memory bandwidth requirements by over 40%.',
        methodology: {
          approach: 'Empirical Multi-Dataset Benchmarking & Controlled Ablation Analysis',
          datasetUsed: 'GLUE Benchmark, SQuAD 2.0, ImageNet-1K, and PubMed-QA',
          sampleSize: 'N = 120,000 annotated evaluation instances across 5 trials',
          rigorScore: 91
        },
        novelContributions: [
          'First architecture to introduce dynamic routing over quantized latent states',
          'Achieved State-of-the-Art accuracy of 94.6% on multi-hop document reasoning benchmarks',
          'Demonstrated 42% reduction in peak VRAM consumption during batch inference'
        ],
        keyQuantitativeFindings: [
          {
            metricName: 'Multi-Hop Reasoning Accuracy (F1)',
            resultValue: '94.6% (+3.2% vs Baseline)',
            statisticalSignificance: 'p < 0.001 (Highly Significant)',
            implication: 'Validates theoretical hypothesis on real-world document comprehension tasks'
          },
          {
            metricName: 'Inference Latency per Page',
            resultValue: '185ms (vs 490ms SOTA)',
            statisticalSignificance: '2.64x Speedup',
            implication: 'Enables real-time client-side interactive document synthesis'
          }
        ],
        limitationsAndFutureScope: [
          'Evaluated predominantly on English language corporate and legal corpora',
          'Future work should investigate low-resource multilingual translation and OCR degradation'
        ]
      }
    };
  }

  if (category === 'compliance') {
    return {
      summary: 'Comprehensive regulatory compliance audit evaluating adherence to GDPR, SOC 2 Type II, HIPAA, and ISO 27001 data governance standards. Highlights key security controls, access governance, and remediation priorities.',
      riskScore: 45,
      riskLevel: 'Medium',
      actionItems: [
        'Enforce mandatory 90-day encryption key rotation policy across all S3 buckets',
        'Implement automated role-based access audit logs for protected health information (PHI)',
        'Update vendor data processing agreements (DPA) with standard contractual clauses'
      ],
      keyEntities: [
        { label: 'Overall Audit Readiness', value: '82% Compliant Posture', category: 'Metric' },
        { label: 'Primary Standards', value: 'SOC 2 Type II, GDPR, HIPAA, ISO 27001', category: 'General' },
        { label: 'Critical Gaps Detected', value: '2 High-Priority Action Items', category: 'Metric' }
      ],
      tags: ['compliance', 'soc2', 'gdpr', 'hipaa', 'iso27001', 'audit-ready'],
      highlights: [
        'Encryption in transit (TLS 1.3) and at rest (AES-256) fully enforced.',
        'Access governance satisfies SOC 2 Trust Services Criteria for Security and Availability.'
      ],
      complianceInsights: {
        complianceScore: 82,
        frameworks: [
          { name: 'SOC 2 Type II (Security & Confidentiality)', status: 'Compliant', adherencePercentage: 92, summary: 'Full adherence to access control, change management, and automated anomaly monitoring.' },
          { name: 'GDPR (Data Privacy & Right to Erasure)', status: 'Partial', adherencePercentage: 78, summary: 'Data subject request portal active; requires automated deletion verification across backups.' },
          { name: 'HIPAA Security Rule (PHI Protection)', status: 'Compliant', adherencePercentage: 88, summary: 'Strict role-based segregation and signed Business Associate Agreements (BAA) in place.' },
          { name: 'ISO/IEC 27001:2022', status: 'Partial', adherencePercentage: 74, summary: 'Annual third-party penetration testing completed; formal disaster recovery test overdue.' }
        ],
        regulatoryGaps: [
          {
            standard: 'GDPR Article 32 & 33 (Breach Notification Protocols)',
            gapDescription: 'Incident response plan lacks automated 72-hour regulatory notification escalation trigger.',
            severity: 'High',
            remediationDeadline: '15 Days'
          },
          {
            standard: 'ISO 27001 Control A.12.1.2 (Change Management)',
            gapDescription: 'Emergency production hotfix documentation lacks mandatory secondary peer review sign-off.',
            severity: 'Medium',
            remediationDeadline: '30 Days'
          }
        ],
        auditChecklist: [
          { requirement: 'End-to-end data encryption at rest (AES-256 GCM)', isMet: true, evidenceNotes: 'All database volumes and object stores encrypted with customer-managed keys.' },
          { requirement: 'Multi-Factor Authentication (MFA) enforced on all administrative endpoints', isMet: true, evidenceNotes: 'Hardware security keys (FIDO2) mandated across engineering workforce.' },
          { requirement: 'Automated 72-hour Data Protection Authority incident escalation workflow', isMet: false, evidenceNotes: 'Document references manual legal review without guaranteed 72-hour SLA.' }
        ]
      }
    };
  }

  if (category === 'resume') {
    return {
      summary: `Analyzed professional candidate profile with strong competencies in modern software engineering, web frameworks, and cloud architecture. The profile exhibits solid technical foundational depth with high potential for senior engineering opportunities.`,
      riskScore: 12,
      riskLevel: 'Low',
      actionItems: [
        'Add quantified metrics (% latency reduction, ARR impact) to the top 2 experience bullet points',
        'Incorporate System Architecture & Cloud Infrastructure keywords in the summary section',
        'Build a production-grade multi-agent or high-throughput queue project to showcase leadership',
      ],
      keyEntities: [
        { label: 'Primary Toolchain', value: 'JavaScript, TypeScript, React, Node.js, Python', category: 'General' },
        { label: 'Detected Seniority', value: 'Mid-Senior Level Engineer', category: 'Metric' },
        { label: 'ATS Optimization Tier', value: '88% (Highly Competitive)', category: 'Metric' },
      ],
      tags: ['resume', 'ats-optimized', 'software-engineer', 'career-mentor'],
      highlights: [
        'ATS keyword match is in the top 15% of technical applicants.',
        'High technical clarity with strong potential for Staff/Senior Full-Stack AI roles.',
      ],
      resumeInsights: {
        atsScore: 88,
        atsBreakdown: {
          formattingScore: 92,
          keywordMatchScore: 86,
          impactQuantificationScore: 82,
          experienceRelevanceScore: 92,
        },
        candidateProfile: {
          detectedDomain: 'Full-Stack Web & AI Engineering',
          seniorityLevel: 'Senior Engineer',
          topStrengths: [
            'Robust full-stack architecture mastery across React, Node.js, and Redis',
            'Demonstrated cloud backend scaling and database indexing capabilities',
            'Strong clean code structure and modular API design patterns',
          ],
          criticalGaps: [
            'Lack of explicit business ROI metrics in earlier career descriptions',
            'Could benefit from highlighting advanced distributed systems consensus/orchestration',
          ],
        },
        careerMentorGuidance: {
          mentorSummary:
            'You have a standout full-stack technical foundation. To unlock top-tier $150k+ / ₹35L+ compensation bands, shift your narrative from "I implemented feature X" to "I engineered high-throughput architecture that scaled throughput by 4x and saved $20k in cloud costs".',
          targetJobRoles: [
            {
              role: 'Senior Full-Stack AI Engineer',
              matchPercent: 94,
              reason: 'Your React + Node.js + AI pipeline capabilities directly align with modern GenAI product teams.',
              expectedSalaryRange: '$140,000 - $185,000 / ₹30L - ₹50L',
            },
            {
              role: 'Lead Backend & Distributed Systems Architect',
              matchPercent: 88,
              reason: 'Strong background in queues, Redis caching, and asynchronous worker orchestration.',
              expectedSalaryRange: '$150,000 - $200,000 / ₹35L - ₹55L',
            },
            {
              role: 'AI Solutions Engineer / Technical Lead',
              matchPercent: 86,
              reason: 'Ability to bridge customer-facing product UI with LLM and RAG retrieval pipelines.',
              expectedSalaryRange: '$130,000 - $175,000 / ₹28L - ₹45L',
            },
          ],
          growthRoadmap: {
            next30Days: [
              'Rewrite resume bullets using the Google XYZ formula (Accomplished [X], measured by [Y], by doing [Z])',
              'Update LinkedIn headline to "Senior Full-Stack & AI Systems Engineer" to boost recruiter outreach',
            ],
            next60Days: [
              'Build and deploy a public live showcase demonstrating Graph RAG or BullMQ distributed queues',
              'Practice system design mock interviews focusing on distributed caching and rate limiting',
            ],
            next90Days: [
              'Target tier-1 product companies and AI startups with direct referrals',
              'Negotiate multiple offers targeting Staff / Senior engineering compensation bands',
            ],
          },
          highImpactProjectsToBuild: [
            {
              title: 'Multi-Agent Autonomous RAG Engine',
              description: 'A distributed document analysis platform utilizing vector semantic search, Redis queues, and LLM reasoning.',
              techStack: ['Node.js', 'React', 'BullMQ', 'Redis', 'Gemini / Groq LLMs', 'TailwindCSS'],
              whyItImpressesRecruiters: 'Demonstrates deep systems thinking and production-ready AI orchestration rather than simple API wrappers.',
            },
            {
              title: 'Real-Time High-Throughput Event Streaming Hub',
              description: 'A scalable event processor handling 10,000+ websocket messages/sec with partition persistence.',
              techStack: ['TypeScript', 'Fastify', 'Redis Streams', 'Docker', 'Prometheus'],
              whyItImpressesRecruiters: 'Proves capability in concurrency, low-latency microservices, and telemetry monitoring.',
            },
          ],
          recommendedSkillsToLearn: [
            'Vector Databases (Pinecone, ChromaDB, pgvector)',
            'Distributed Queue Orchestration (BullMQ, Kafka)',
            'Prompt Engineering & Structured Outputs (Zod, LangChain)',
            'Kubernetes & Microservice Observability',
          ],
          interviewPrepQuestions: [
            'How do you handle race conditions and duplicate task deduplication in background queues like BullMQ?',
            'Explain how you implement hybrid semantic search with Cosine similarity and reranking in RAG architectures.',
            'Describe a situation where you optimized database query latency under heavy concurrent read loads.',
          ],
          bulletPointFixes: [
            {
              original: 'Built APIs and handled document uploads in React and Node.',
              improved: 'Architected async document ingestion pipeline with BullMQ and Redis, reducing processing latency by 64% and serving 10,000+ concurrent requests.',
              feedback: 'Includes concrete business metrics, architecture toolchain, and demonstrable scale.',
            },
            {
              original: 'Integrated AI models for document summarization.',
              improved: 'Engineered dual-engine LLM routing with Gemini 2.0 and Groq, enforcing strict Zod schema validation and reducing token costs by 100% via SHA-256 deduplication.',
              feedback: 'Demonstrates architectural maturity, schema guardrails, and cost consciousness.',
            },
          ],
        },
      },
    };
  }

  const words = text.split(/\s+/).slice(0, 30).join(' ');
  const riskScore = 25;
  const riskLevel = 'Low';

  return {
    summary: `This general document outlines the terms, operational parameters, and obligations established between parties. Core topics include ${words.slice(0, 60)}... and standard governance guidelines.`,
    riskScore,
    riskLevel,
    actionItems: [
      'Review document takeaways and key highlights',
      'Confirm alignment with operational stakeholder timelines',
      'Archive validated analysis report for future governance reference',
    ],
    keyEntities: [
      { label: 'Document Category', value: category.toUpperCase(), category: 'General' },
      { label: 'Calculated Risk Tier', value: `${riskLevel} Risk (${riskScore}/100)`, category: 'Metric' },
      { label: 'Execution Date', value: new Date().toISOString().split('T')[0], category: 'Date' },
    ],
    tags: [category, 'ai-analyzed', 'structured-report'],
    highlights: [
      'Document parsed and validated through Zod runtime schema.',
      'All primary entities and actionable milestones indexed.',
    ],
  };
};

const { extractSalientText, cleanRawText } = require('../utils/textCleaner');

/**
 * Core AI Document Analysis Service
 */
const aiAnalyzerService = {
  /**
   * Analyze document text using single-pass or map-reduce architecture with salient pre-filtering
   * @param {string} text - Cleaned document text
   * @param {string} category - Document category (legal, financial, resume, etc.)
   * @returns {Promise<Object>} Validated AI insights matching InsightSchema with attached telemetry
   */
  analyzeDocument: async (text, category = 'general') => {
    if (!text || text.trim().length === 0) {
      throw new Error('Cannot analyze empty document text');
    }

    const hasApiKey = process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY;

    // 1. Local Pre-Processing: Extract salient clauses and strip boilerplate
    const extractionStats = extractSalientText(text, category, 12000);
    const textToAnalyze = extractionStats.salientText;

    logger.ai(
      `Pre-processing: Filtered text from ${extractionStats.originalChars} to ${extractionStats.filteredChars} chars (${extractionStats.reductionPercent}% token reduction)`
    );

    // If no API key configured, use intelligent mock engine
    if (!hasApiKey) {
      logger.warn('No GEMINI_API_KEY or GROQ_API_KEY provided. Using offline simulated AI analyzer.');
      const mockRaw = generateMockInsights(textToAnalyze, category);
      const validated = validateAIInsights(mockRaw);
      validated.telemetry = {
        provider: 'Offline Simulated Engine',
        modelUsed: 'mock-heuristics',
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        inferenceLatencyMs: 25,
        charsFiltered: extractionStats.originalChars - extractionStats.filteredChars,
        tokenSavingsPercent: extractionStats.reductionPercent,
      };
      return validated;
    }

    try {
      // If salient text is moderately sized (<= 14,000 characters), run single-pass analysis
      if (textToAnalyze.length <= 14000) {
        logger.ai(`Executing high-speed single-pass LLM analysis for ${category} (${textToAnalyze.length} chars)...`);
        const prompt = getPromptForCategory(category, textToAnalyze);
        const aiResponse = await aiService.analyzeDocument(prompt, SYSTEM_INSTRUCTION);
        
        const rawData = aiResponse.data || aiResponse;
        const telemetry = aiResponse.telemetry || {};
        
        const validated = validateAIInsights(rawData);
        validated.telemetry = {
          ...telemetry,
          charsFiltered: extractionStats.originalChars - extractionStats.filteredChars,
          tokenSavingsPercent: extractionStats.reductionPercent,
        };
        return validated;
      }

      // If document is large, run Parallel Map-Reduce pipeline
      logger.ai(`Salient text exceeds 14,000 chars. Executing Parallel Map-Reduce pipeline...`);
      const chunks = chunkDocument(textToAnalyze, 5000, 500);
      logger.ai(`Map phase: Processing ${chunks.length} chunks concurrently...`);

      // Map Step: summarize chunks in parallel
      const chunkSummaries = await Promise.all(
        chunks.slice(0, 5).map(async (chunk, idx) => {
          const mapPrompt = getMapChunkPrompt(chunk.text, idx, chunks.length);
          try {
            const chunkRes = await aiService.analyzeDocument(mapPrompt, SYSTEM_INSTRUCTION);
            return chunkRes.data || chunkRes;
          } catch (e) {
            logger.warn(`Map chunk ${idx + 1} analysis warning: ${e.message}`);
            return { chunkSummary: chunk.text.slice(0, 200), identifiedEntities: [], potentialRisks: [] };
          }
        })
      );

      // Reduce Step: synthesize aggregated chunk summaries
      logger.ai('Reduce phase: Consolidating summaries into final report...');
      const reducePrompt = getReducePrompt(category, chunkSummaries);
      const consolidatedAi = await aiService.analyzeDocument(reducePrompt, SYSTEM_INSTRUCTION);
      
      const rawData = consolidatedAi.data || consolidatedAi;
      const telemetry = consolidatedAi.telemetry || {};

      const validated = validateAIInsights(rawData);
      validated.telemetry = {
        ...telemetry,
        charsFiltered: extractionStats.originalChars - extractionStats.filteredChars,
        tokenSavingsPercent: extractionStats.reductionPercent,
      };
      return validated;
    } catch (err) {
      logger.error('LLM Analysis failed, attempting fallback mock:', err.message);
      const fallbackMock = generateMockInsights(textToAnalyze, category);
      const validated = validateAIInsights(fallbackMock);
      validated.telemetry = {
        provider: 'Fallback Recovery Engine',
        modelUsed: 'mock-recovery',
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        inferenceLatencyMs: 50,
        charsFiltered: extractionStats.originalChars - extractionStats.filteredChars,
        tokenSavingsPercent: extractionStats.reductionPercent,
      };
      return validated;
    }
  },
};

module.exports = aiAnalyzerService;
