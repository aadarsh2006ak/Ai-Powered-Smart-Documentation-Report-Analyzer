const mongoose = require('mongoose');

const KeyEntitySchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
  category: { type: String, default: 'General' },
});

const ReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalFile: {
      fileName: { type: String, required: true },
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
      fileType: { type: String, required: true }, // 'application/pdf', 'image/png', etc.
      sizeBytes: { type: Number, required: true },
      contentHash: { type: String, index: true }, // SHA-256 for Redis duplicate caching
    },
    documentCategory: {
      type: String,
      enum: ['legal', 'financial', 'academic', 'resume', 'compliance', 'general'],
      default: 'general',
      index: true,
    },
    status: {
      type: String,
      enum: ['queued', 'processing', 'done', 'failed'],
      default: 'queued',
      index: true,
    },
    jobId: {
      type: String,
    },
    extractedText: {
      type: String,
      default: '',
    },
    aiInsights: {
      summary: { type: String, default: '' },
      riskScore: { type: Number, min: 0, max: 100, default: 0 },
      riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
      actionItems: [{ type: String }],
      keyEntities: [KeyEntitySchema],
      tags: [{ type: String }],
      highlights: [{ type: String }],
      financialMetrics: {
        revenue: String,
        expenses: String,
        profitMargin: String,
        anomalies: [String],
      },
      legalClauses: {
        governingLaw: String,
        terminationClause: String,
        indemnityRisk: String,
        obligations: [String],
      },
      legalInsights: { type: mongoose.Schema.Types.Mixed },
      financialInsights: { type: mongoose.Schema.Types.Mixed },
      academicInsights: { type: mongoose.Schema.Types.Mixed },
      complianceInsights: { type: mongoose.Schema.Types.Mixed },
      resumeInsights: {
        atsScore: { type: Number, default: 75 },
        atsBreakdown: {
          formattingScore: { type: Number, default: 80 },
          keywordMatchScore: { type: Number, default: 75 },
          impactQuantificationScore: { type: Number, default: 70 },
          experienceRelevanceScore: { type: Number, default: 80 },
        },
        candidateProfile: {
          detectedDomain: { type: String, default: 'Software Engineering & AI' },
          seniorityLevel: { type: String, default: 'Mid-Level' },
          topStrengths: [{ type: String }],
          criticalGaps: [{ type: String }],
        },
        careerMentorGuidance: {
          mentorSummary: { type: String, default: '' },
          targetJobRoles: [
            {
              role: String,
              matchPercent: Number,
              reason: String,
              expectedSalaryRange: String,
            },
          ],
          growthRoadmap: {
            next30Days: [String],
            next60Days: [String],
            next90Days: [String],
          },
          highImpactProjectsToBuild: [
            {
              title: String,
              description: String,
              techStack: [String],
              whyItImpressesRecruiters: String,
            },
          ],
          recommendedSkillsToLearn: [String],
          interviewPrepQuestions: [String],
          bulletPointFixes: [
            {
              original: String,
              improved: String,
              feedback: String,
            },
          ],
        },
      },
    },
    isCachedResult: {
      type: Boolean,
      default: false,
    },
    exportedPdfUrl: {
      type: String,
    },
    errorMessage: {
      type: String,
    },
    processingTimeMs: {
      type: Number,
      default: 0,
    },
    telemetry: {
      provider: { type: String, default: 'Groq Cloud LPU' },
      modelUsed: { type: String, default: 'qwen/qwen3.8-27b' },
      promptTokens: { type: Number, default: 0 },
      completionTokens: { type: Number, default: 0 },
      totalTokens: { type: Number, default: 0 },
      inferenceLatencyMs: { type: Number, default: 0 },
      charsFiltered: { type: Number, default: 0 },
      tokenSavingsPercent: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high performance querying
ReportSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Report', ReportSchema);
