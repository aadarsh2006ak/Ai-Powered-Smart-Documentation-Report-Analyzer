const { z } = require('zod');

/**
 * Zod Schema for Structured AI Document Insights
 */
const KeyEntitySchema = z.object({
  label: z.string().min(1, 'Entity label cannot be empty'),
  value: z.string().min(1, 'Entity value cannot be empty'),
  category: z.string().optional().default('General'),
});

const InsightSchema = z.object({
  summary: z.string().min(10, 'Summary must be at least 10 characters long'),
  riskScore: z.number().min(0).max(100).default(0),
  riskLevel: z.enum(['Low', 'Medium', 'High']).default('Low'),
  actionItems: z.array(z.string()).max(20).default([]),
  keyEntities: z.array(KeyEntitySchema).default([]),
  tags: z.array(z.string()).max(10).default([]),
  highlights: z.array(z.string()).optional().default([]),
  financialMetrics: z
    .object({
      revenue: z.string().optional(),
      expenses: z.string().optional(),
      profitMargin: z.string().optional(),
      anomalies: z.array(z.string()).optional(),
    })
    .optional(),
  legalClauses: z
    .object({
      governingLaw: z.string().optional(),
      terminationClause: z.string().optional(),
      indemnityRisk: z.string().optional(),
      obligations: z.array(z.string()).optional(),
    })
    .optional(),
  // 1. Legal Contract Specialized Insights
  legalInsights: z
    .object({
      governingLaw: z.string().default('Not Specified'),
      jurisdiction: z.string().default('General Courts'),
      terminationClause: z
        .object({
          noticePeriodDays: z.string().default('30 Days'),
          breachConditions: z.string().default('Immediate on material breach'),
          convenienceAllowed: z.boolean().default(false),
          summary: z.string().default('Standard termination upon written notice'),
        })
        .optional(),
      indemnityAndLiability: z
        .object({
          liabilityCap: z.string().default('12 months fees or $1,000,000'),
          indemnificationScope: z.string().default('Standard mutual indemnification'),
          uncappedLiabilities: z.array(z.string()).default([]),
        })
        .optional(),
      keyObligations: z
        .array(
          z.object({
            party: z.string().default('All Parties'),
            obligation: z.string(),
            deadline: z.string().optional(),
          })
        )
        .default([]),
      riskClauses: z
        .array(
          z.object({
            clauseName: z.string(),
            severity: z.enum(['High', 'Medium', 'Low']).default('Medium'),
            quote: z.string(),
            riskAnalysis: z.string(),
            mitigationAdvice: z.string(),
          })
        )
        .default([]),
      missingStandardClauses: z.array(z.string()).default([]),
    })
    .optional(),
  // 2. Financial / Excel Specialized Insights
  financialInsights: z
    .object({
      executiveSummary: z.string().default(''),
      fiscalHealthScore: z.number().min(0).max(100).default(75),
      metrics: z
        .object({
          revenue: z.string().default('N/A'),
          netIncome: z.string().default('N/A'),
          grossMargin: z.string().default('N/A'),
          operatingExpenses: z.string().default('N/A'),
          ebitda: z.string().default('N/A'),
          cashAndEquivalents: z.string().default('N/A'),
          debtObligations: z.string().default('N/A'),
          runwayMonths: z.string().default('N/A'),
        })
        .optional(),
      anomalies: z
        .array(
          z.object({
            title: z.string(),
            description: z.string(),
            severity: z.enum(['Critical', 'Warning', 'Info']).default('Warning'),
            impactEstimate: z.string().optional(),
          })
        )
        .default([]),
      profitabilityAnalysis: z
        .object({
          marginHealth: z.string().default('Stable'),
          burnRate: z.string().default('Sustainable'),
          revenueConcentrationRisk: z.string().default('Low'),
        })
        .optional(),
      cfoRecommendations: z.array(z.string()).default([]),
    })
    .optional(),
  // 3. Academic & Research Paper Specialized Insights
  academicInsights: z
    .object({
      hypothesis: z.string().default(''),
      methodology: z
        .object({
          approach: z.string().default('Empirical Analysis'),
          datasetUsed: z.string().default('Specified benchmark datasets'),
          sampleSize: z.string().default('N/A'),
          rigorScore: z.number().min(0).max(100).default(80),
        })
        .optional(),
      novelContributions: z.array(z.string()).default([]),
      keyQuantitativeFindings: z
        .array(
          z.object({
            metricName: z.string(),
            resultValue: z.string(),
            statisticalSignificance: z.string().default('p < 0.05'),
            implication: z.string(),
          })
        )
        .default([]),
      limitationsAndFutureScope: z.array(z.string()).default([]),
    })
    .optional(),
  // 4. Compliance & Audit Specialized Insights
  complianceInsights: z
    .object({
      complianceScore: z.number().min(0).max(100).default(80),
      frameworks: z
        .array(
          z.object({
            name: z.string(),
            status: z.enum(['Compliant', 'Partial', 'Non-Compliant']).default('Compliant'),
            adherencePercentage: z.number().default(90),
            summary: z.string(),
          })
        )
        .default([]),
      regulatoryGaps: z
        .array(
          z.object({
            standard: z.string(),
            gapDescription: z.string(),
            severity: z.enum(['Critical', 'High', 'Medium', 'Low']).default('Medium'),
            remediationDeadline: z.string().default('30 Days'),
          })
        )
        .default([]),
      auditChecklist: z
        .array(
          z.object({
            requirement: z.string(),
            isMet: z.boolean().default(true),
            evidenceNotes: z.string(),
          })
        )
        .default([]),
    })
    .optional(),
  // 5. Resume / ATS Mentor Specialized Insights
  resumeInsights: z
    .object({
      atsScore: z.number().min(0).max(100).default(75),
      atsBreakdown: z
        .object({
          formattingScore: z.number().min(0).max(100).default(80),
          keywordMatchScore: z.number().min(0).max(100).default(75),
          impactQuantificationScore: z.number().min(0).max(100).default(70),
          experienceRelevanceScore: z.number().min(0).max(100).default(80),
        })
        .optional(),
      candidateProfile: z
        .object({
          detectedDomain: z.string().default('Software Engineering & AI'),
          seniorityLevel: z.string().default('Mid-Level'),
          topStrengths: z.array(z.string()).default([]),
          criticalGaps: z.array(z.string()).default([]),
        })
        .optional(),
      careerMentorGuidance: z
        .object({
          mentorSummary: z.string().default(''),
          targetJobRoles: z
            .array(
              z.object({
                role: z.string(),
                matchPercent: z.number(),
                reason: z.string(),
                expectedSalaryRange: z.string().optional(),
              })
            )
            .default([]),
          growthRoadmap: z
            .object({
              next30Days: z.array(z.string()).default([]),
              next60Days: z.array(z.string()).default([]),
              next90Days: z.array(z.string()).default([]),
            })
            .optional(),
          highImpactProjectsToBuild: z
            .array(
              z.object({
                title: z.string(),
                description: z.string(),
                techStack: z.array(z.string()).default([]),
                whyItImpressesRecruiters: z.string().default(''),
              })
            )
            .default([]),
          recommendedSkillsToLearn: z.array(z.string()).default([]),
          interviewPrepQuestions: z.array(z.string()).default([]),
          bulletPointFixes: z
            .array(
              z.object({
                original: z.string(),
                improved: z.string(),
                feedback: z.string(),
              })
            )
            .default([]),
        })
        .optional(),
    })
    .optional(),
});

/**
 * Helper to safely validate raw AI responses
 */
const validateAIInsights = (rawJson) => {
  const result = InsightSchema.safeParse(rawJson);
  if (!result.success) {
    const errorDetails = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new Error(`AI Schema Validation Failed: ${errorDetails}`);
  }
  return result.data;
};

/**
 * User Auth Validation Schemas
 */
const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

module.exports = {
  InsightSchema,
  validateAIInsights,
  RegisterSchema,
  LoginSchema,
};
