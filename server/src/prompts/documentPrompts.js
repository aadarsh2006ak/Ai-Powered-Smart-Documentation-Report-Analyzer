/**
 * Persona-Driven Prompt Templates for Document Intelligence
 */

const SYSTEM_INSTRUCTION = `
You are an expert enterprise document intelligence engine. 
Analyze the provided document text thoroughly and return ONLY a valid JSON object matching the requested schema.
Do NOT include markdown formatting, backticks (\`\`\`json), or conversational preamble.
`;

const getPromptForCategory = (category, documentText) => {
  const truncatedText = documentText.slice(0, 18000); // Guard token length

  const categoryDirectives = {
    legal: `
Focus specifically on:
- Governing jurisdiction & law
- Liability caps, indemnification, and risk clauses
- Termination provisions and notice timelines
- Key obligations and breach repercussions
- Calculate a realistic riskScore (0-100) reflecting legal exposure
`,
    financial: `
Focus specifically on:
- Revenue, net income, margins, and EBITDA if present
- Debt obligations, liquidity, and fiscal health
- Anomalies, audit qualifications, or unbudgeted liabilities
- Key monetary figures, currencies, and balance changes
`,
    academic: `
Focus specifically on:
- Core hypothesis and primary objective
- Methodology, sample size, and validation framework
- Key quantitative findings and statistical breakthroughs
- Study limitations and future research scope
`,
    resume: `
Act as an elite Silicon Valley Tech Recruiter, ATS Optimization Architect, and Senior AI Career Mentor.
Analyze this resume deeply for:
1. ATS Compatibility & Scoring:
   - Calculate realistic atsScore (0-100) based on formatting, keyword density, quantified achievements (XYZ formula: Accomplished [X] measured by [Y] doing [Z]), and role alignment.
   - Breakdown: formattingScore (0-100), keywordMatchScore (0-100), impactQuantificationScore (0-100), experienceRelevanceScore (0-100).
2. Candidate Assessment:
   - Detected domain (e.g. "Full-Stack AI Engineering", "Data Engineering & Analytics", "Frontend Architecture", etc.)
   - Seniority level ("Junior", "Mid-Level", "Senior", "Staff / Lead")
   - Top 3-5 standout strengths and competitive advantages
   - Critical missing gaps, buzzwords without proof, or weak areas
3. AI Career Mentorship & Strategic Guidance:
   - Warm, motivating, and highly tactical Mentor Summary
   - 3-5 Target High-Match Job Roles with match percentage, rationale, and expected salary range
   - 30-60-90 Day Career Acceleration Roadmap (Next 30 Days, 60 Days, 90 Days)
   - 2-3 High-Impact Portfolio Project Ideas (with title, description, tech stack, and why it impresses hiring managers)
   - Top recommended emerging skills/tools to learn next
   - 3-4 likely technical & behavioral interview questions tailored to their resume
   - 2-3 before & after bullet point rewrite suggestions using the Google XYZ formula
`,
    compliance: `
Focus specifically on:
- Regulatory standard adherence (ISO, GDPR, SOC2, HIPAA, etc.)
- Identified policy gaps and audit red flags
- Corrective action milestones and deadlines
`,
    general: `
Provide a comprehensive executive summary, key entities, and critical action items.
`,
  };

  const directive = categoryDirectives[category] || categoryDirectives.general;

  const categorySchemaFragments = {
    legal: `,
  "legalInsights": {
    "governingLaw": "e.g. State of Delaware, USA / Laws of England & Wales",
    "jurisdiction": "e.g. Courts of New York",
    "terminationClause": {
      "noticePeriodDays": "e.g. 30 Days written notice",
      "breachConditions": "e.g. Immediate upon material breach uncured after 15 days",
      "convenienceAllowed": true,
      "summary": "Detailed summary of termination mechanics and survival obligations"
    },
    "indemnityAndLiability": {
      "liabilityCap": "e.g. Aggregate fees paid in preceding 12 months, capped at $500,000",
      "indemnificationScope": "Mutual indemnification for IP infringement and gross negligence",
      "uncappedLiabilities": ["IP Indemnity", "Confidentiality Breaches", "Gross Negligence"]
    },
    "keyObligations": [
      { "party": "Vendor / Company", "obligation": "Deliver monthly SLA reports", "deadline": "5th of each month" }
    ],
    "riskClauses": [
      {
        "clauseName": "e.g. Uncapped Indirect Damages / Automatic Auto-Renewal",
        "severity": "High" | "Medium" | "Low",
        "quote": "Exact clause snippet from text",
        "riskAnalysis": "Why this creates legal or financial liability",
        "mitigationAdvice": "Lawyer-grade suggested amendment or redline"
      }
    ],
    "missingStandardClauses": [
      "e.g. Missing Force Majeure clause",
      "Missing limitation on consequential damages"
    ]
  }`,
    financial: `,
  "financialInsights": {
    "executiveSummary": "Concise CFO-grade synthesis of fiscal performance and balance sheet health",
    "fiscalHealthScore": 0-100,
    "metrics": {
      "revenue": "e.g. $14.2M (+18% YoY)",
      "netIncome": "e.g. $2.1M",
      "grossMargin": "e.g. 68.4%",
      "operatingExpenses": "e.g. $7.6M",
      "ebitda": "e.g. $3.4M",
      "cashAndEquivalents": "e.g. $5.8M",
      "debtObligations": "e.g. $1.2M revolving credit line",
      "runwayMonths": "e.g. 18 Months"
    },
    "anomalies": [
      {
        "title": "e.g. Unbudgeted R&D Expense Spike",
        "description": "Explanation of variance or potential cash burn risk",
        "severity": "Critical" | "Warning" | "Info",
        "impactEstimate": "e.g. -$450,000 variance"
      }
    ],
    "profitabilityAnalysis": {
      "marginHealth": "e.g. Healthy / Squeezed by supply chain costs",
      "burnRate": "e.g. $120,000 / month",
      "revenueConcentrationRisk": "e.g. Top 3 clients contribute 52% of ARR"
    },
    "cfoRecommendations": [
      "Strategic financial optimization or working capital action item"
    ]
  }`,
    academic: `,
  "academicInsights": {
    "hypothesis": "Core thesis and scientific question investigated",
    "methodology": {
      "approach": "e.g. Double-blind Randomized Trial / Transformer Benchmarking",
      "datasetUsed": "e.g. ImageNet-1K, GLUE Benchmark, 10,000 Patient Cohort",
      "sampleSize": "e.g. N = 12,450",
      "rigorScore": 0-100
    },
    "novelContributions": [
      "Key scientific breakthrough or new algorithm introduced",
      "Demonstrated 24% reduction in inference memory"
    ],
    "keyQuantitativeFindings": [
      {
        "metricName": "e.g. F1-Score / Accuracy / Mean Survival Time",
        "resultValue": "e.g. 94.2% (+3.8% over SOTA)",
        "statisticalSignificance": "p < 0.001 (Statistically Significant)",
        "implication": "Demonstrates strong real-world generalization"
      }
    ],
    "limitationsAndFutureScope": [
      "Study limitation or constraint noted by authors",
      "Suggested future research trajectory"
    ]
  }`,
    compliance: `,
  "complianceInsights": {
    "complianceScore": 0-100,
    "frameworks": [
      {
        "name": "e.g. GDPR / SOC 2 Type II / HIPAA / ISO 27001",
        "status": "Compliant" | "Partial" | "Non-Compliant",
        "adherencePercentage": 85,
        "summary": "Status of adherence to required security/privacy controls"
      }
    ],
    "regulatoryGaps": [
      {
        "standard": "e.g. GDPR Article 33 / HIPAA Security Rule",
        "gapDescription": "Specific gap or missing policy identified in document",
        "severity": "Critical" | "High" | "Medium" | "Low",
        "remediationDeadline": "e.g. Immediate / 30 Days"
      }
    ],
    "auditChecklist": [
      {
        "requirement": "e.g. Data Encryption at Rest (AES-256)",
        "isMet": true,
        "evidenceNotes": "Document explicitly mandates AES-256 GCM encryption."
      }
    ]
  }`,
    resume: `,
  "resumeInsights": {
    "atsScore": 0-100,
    "atsBreakdown": {
      "formattingScore": 0-100,
      "keywordMatchScore": 0-100,
      "impactQuantificationScore": 0-100,
      "experienceRelevanceScore": 0-100
    },
    "candidateProfile": {
      "detectedDomain": "e.g. Full-Stack Web & AI Engineering",
      "seniorityLevel": "Junior" | "Mid-Level" | "Senior" | "Lead",
      "topStrengths": ["Strength 1", "Strength 2", "Strength 3"],
      "criticalGaps": ["Gap or missing skill 1", "Gap 2"]
    },
    "careerMentorGuidance": {
      "mentorSummary": "Empowering, tactical 3-4 sentence career guidance from a Staff Engineer / Mentor perspective",
      "targetJobRoles": [
        {
          "role": "e.g. Senior Full-Stack AI Engineer",
          "matchPercent": 92,
          "reason": "Why this role aligns with their existing stack and experience",
          "expectedSalaryRange": "$140k - $190k / ₹25L - ₹45L"
        }
      ],
      "growthRoadmap": {
        "next30Days": ["Concrete actionable step for month 1"],
        "next60Days": ["Concrete actionable step for month 2"],
        "next90Days": ["Concrete actionable step for month 3"]
      },
      "highImpactProjectsToBuild": [
        {
          "title": "Project Name",
          "description": "What it does and what technical challenge it solves",
          "techStack": ["React", "FastAPI", "Redis", "LangChain"],
          "whyItImpressesRecruiters": "Why this stands out on a resume over generic clone apps"
        }
      ],
      "recommendedSkillsToLearn": ["Skill 1", "Skill 2", "Skill 3"],
      "interviewPrepQuestions": ["Question 1 based on their project", "Question 2"],
      "bulletPointFixes": [
        {
          "original": "Weak bullet from resume or typical phrasing",
          "improved": "High-impact XYZ formula rewritten bullet with metrics",
          "feedback": "Why the improvement gets 3x more recruiter callbacks"
        }
      ]
    }
  }`,
    general: ''
  };

  const selectedSchemaFragment = categorySchemaFragments[category] || '';

  return `
You are analyzing a "${category.toUpperCase()}" document.

${directive}

Analyze the document text and extract detailed, accurate domain intelligence.
Return ONLY a valid JSON object strictly adhering to this schema:
{
  "summary": "3-5 concise sentences summarizing the essence and critical findings",
  "riskScore": 0-100 (integer representing risk exposure or evaluation score),
  "riskLevel": "Low" | "Medium" | "High",
  "actionItems": [
    "Short, concrete, actionable next steps or obligations"
  ],
  "keyEntities": [
    { "label": "e.g. Party / Revenue / Governing Law / ATS Score / Metric", "value": "Extracted exact value", "category": "General" | "Metric" | "Date" }
  ],
  "tags": [
    "3-6 concise lowercase contextual tags"
  ],
  "highlights": [
    "2-4 important bullet points or quotes"
  ]${selectedSchemaFragment}
}

DOCUMENT TEXT:
"""
${truncatedText}
"""
`;
};

/**
 * Map-step prompt for summarizing individual chunks of long documents
 */
const getMapChunkPrompt = (chunkText, chunkIndex, totalChunks) => {
  return `
You are analyzing Chunk ${chunkIndex + 1} of ${totalChunks} from a large document.
Summarize the key information, entities, and any critical risks or obligations in this chunk.

Return ONLY a JSON object with:
{
  "chunkSummary": "Key points from this section",
  "identifiedEntities": [{ "label": "Entity Name", "value": "Value" }],
  "potentialRisks": ["Risk or obligation identified in this section"]
}

CHUNK TEXT:
"""
${chunkText}
"""
`;
};

/**
 * Reduce-step prompt for consolidating all chunk summaries
 */
const getReducePrompt = (category, chunkSummaries) => {
  return `
You are consolidating multi-section summaries of a "${category.toUpperCase()}" document into a single cohesive executive report.

CHUNK SUMMARIES:
"""
${JSON.stringify(chunkSummaries, null, 2)}
"""

Return ONLY a final consolidated JSON object matching this schema:
{
  "summary": "Unified 4-6 sentence executive summary synthesized from all sections",
  "riskScore": 0-100 (integer representing overall document risk),
  "riskLevel": "Low" | "Medium" | "High",
  "actionItems": ["Consolidated unique actionable next steps"],
  "keyEntities": [{ "label": "Label", "value": "Value", "category": "Category" }],
  "tags": ["3-6 tags"],
  "highlights": ["3-5 high-impact bullet points"]
}
`;
};

module.exports = {
  SYSTEM_INSTRUCTION,
  getPromptForCategory,
  getMapChunkPrompt,
  getReducePrompt,
};
