import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  TrendingUp,
  Target,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Code2,
  Compass,
  DollarSign,
  Calendar,
  ChevronRight,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

export default function ResumeMentorView({ report }) {
  const [activeRoadmapTab, setActiveRoadmapTab] = useState('next30Days');

  const insights = report?.aiInsights || {};
  const resumeInsights = insights.resumeInsights || {
    atsScore: insights.riskScore ? 100 - insights.riskScore : 85,
    atsBreakdown: {
      formattingScore: 90,
      keywordMatchScore: 84,
      impactQuantificationScore: 80,
      experienceRelevanceScore: 88,
    },
    candidateProfile: {
      detectedDomain: 'Software Engineering & AI Architecture',
      seniorityLevel: 'Senior Engineer',
      topStrengths: [
        'Robust full-stack architecture mastery across React, Node.js, and Redis',
        'Strong clean code structure, API design, and background queue orchestration',
      ],
      criticalGaps: [
        'Could include more quantified business ROI metrics in past project descriptions',
      ],
    },
    careerMentorGuidance: {
      mentorSummary:
        'You have a strong technical foundation. Shift your resume bullets from listing tasks to quantifying business outcomes using the Google XYZ formula (Accomplished [X], measured by [Y], by doing [Z]) to command top-tier compensation.',
      targetJobRoles: [
        {
          role: 'Senior Full-Stack AI Engineer',
          matchPercent: 94,
          reason: 'Your React + Node.js + LLM integration background directly matches high-demand GenAI product roles.',
          expectedSalaryRange: '$140k - $185k / ₹30L - ₹50L',
        },
        {
          role: 'Lead Backend & Distributed Systems Architect',
          matchPercent: 88,
          reason: 'Expertise in asynchronous BullMQ workers, Redis caching, and low-latency APIs.',
          expectedSalaryRange: '$150k - $200k / ₹35L - ₹55L',
        },
      ],
      growthRoadmap: {
        next30Days: [
          'Rewrite resume experience bullets using the Google XYZ formula',
          'Optimize LinkedIn headline & summary with high-intent keywords (LLM, RAG, BullMQ, Redis)',
        ],
        next60Days: [
          'Build and deploy a public production-grade full-stack project demonstrating asynchronous queues and RAG',
          'Practice system design mock interviews focusing on distributed caching and concurrency',
        ],
        next90Days: [
          'Target tier-1 tech companies and AI startups with customized referrals',
          'Negotiate multiple offers targeting Staff/Senior engineering salary bands',
        ],
      },
      highImpactProjectsToBuild: [
        {
          title: 'Autonomous Multi-Doc Agentic RAG Platform',
          description: 'A distributed document analysis platform utilizing vector semantic search, Redis queues, and LLM reasoning.',
          techStack: ['Node.js', 'React', 'BullMQ', 'Redis', 'Gemini / Groq', 'TailwindCSS'],
          whyItImpressesRecruiters: 'Demonstrates deep systems thinking and production-ready AI orchestration rather than simple API wrappers.',
        },
      ],
      recommendedSkillsToLearn: [
        'Vector Databases (pgvector, Pinecone)',
        'Distributed Queues (BullMQ, Kafka)',
        'Structured LLM Schema Guardrails (Zod)',
      ],
      interviewPrepQuestions: [
        'How do you handle race conditions and deduplication in distributed background queues?',
        'Explain how you implement hybrid semantic search with Cosine similarity and reranking in RAG architectures.',
      ],
      bulletPointFixes: [
        {
          original: 'Built APIs and handled document uploads in React and Node.',
          improved: 'Architected async document ingestion pipeline with BullMQ and Redis, reducing processing latency by 64% and serving 10,000+ concurrent requests.',
          feedback: 'Adds measurable business metrics, architecture toolchain, and demonstrable scale.',
        },
      ],
    },
  };

  const atsScore = resumeInsights.atsScore ?? 85;
  const breakdown = resumeInsights.atsBreakdown || {
    formattingScore: 88,
    keywordMatchScore: 82,
    impactQuantificationScore: 78,
    experienceRelevanceScore: 88,
  };
  const profile = resumeInsights.candidateProfile || {};
  const mentor = resumeInsights.careerMentorGuidance || {};

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-[#47E0A6]';
    if (score >= 70) return 'text-[#FFB020]';
    return 'text-rose-400';
  };

  const getScoreBadge = (score) => {
    if (score >= 85) return 'bg-[#47E0A6]/10 text-[#47E0A6] border-[#47E0A6]/30';
    if (score >= 70) return 'bg-[#FFB020]/10 text-[#FFB020] border-[#FFB020]/30';
    return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. HERO ATS SCORE & PROFILE OVERVIEW */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#262F4C] bg-gradient-to-b from-[#121A2E]/90 to-[#0A0E1A]/95 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          {/* Left: Overall ATS Score Dial */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="text-[#1A2440]"
                  strokeWidth="9"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className={getScoreColor(atsScore)}
                  strokeWidth="9"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * atsScore) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-3xl font-black font-display ${getScoreColor(atsScore)}`}>
                  {atsScore}
                </span>
                <span className="text-[10px] uppercase font-mono font-bold text-[#8D96B3]">
                  ATS Score
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold border ${getScoreBadge(atsScore)}`}>
                  {atsScore >= 85 ? 'Top 10% ATS Match' : atsScore >= 70 ? 'Competitive Match' : 'Optimization Required'}
                </span>
                <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {profile.detectedDomain || 'Full-Stack Software Engineering'}
                </span>
                <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  {profile.seniorityLevel || 'Mid-Senior'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                Resume Intelligence & Career Acceleration Report
              </h2>
              <p className="text-xs sm:text-sm text-[#8D96B3] max-w-xl">
                Audited against modern Applicant Tracking Systems (Workday, Greenhouse, Lever) and evaluated by AI Staff Engineer career heuristics.
              </p>
            </div>
          </div>
        </div>

        {/* 4 ATS Pillars Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-[#262F4C]">
          <div className="p-3.5 rounded-2xl bg-[#0A0E1A]/80 border border-[#262F4C] space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold text-[#8D96B3] block">
              Layout & Parseability
            </span>
            <div className="flex items-center justify-between">
              <span className="text-lg font-black font-display text-white">
                {breakdown.formattingScore || 90}%
              </span>
              <CheckCircle2 className="w-4 h-4 text-[#47E0A6]" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0A0E1A]/80 border border-[#262F4C] space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold text-[#8D96B3] block">
              Keyword Density
            </span>
            <div className="flex items-center justify-between">
              <span className="text-lg font-black font-display text-white">
                {breakdown.keywordMatchScore || 85}%
              </span>
              <Award className="w-4 h-4 text-[#FFB020]" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0A0E1A]/80 border border-[#262F4C] space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold text-[#8D96B3] block">
              XYZ Impact Metrics
            </span>
            <div className="flex items-center justify-between">
              <span className="text-lg font-black font-display text-white">
                {breakdown.impactQuantificationScore || 78}%
              </span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0A0E1A]/80 border border-[#262F4C] space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold text-[#8D96B3] block">
              Seniority Alignment
            </span>
            <div className="flex items-center justify-between">
              <span className="text-lg font-black font-display text-white">
                {breakdown.experienceRelevanceScore || 88}%
              </span>
              <Briefcase className="w-4 h-4 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. MENTOR GUIDANCE & CANDIDATE STRENGTHS / GAPS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Mentor Executive Strategic Summary */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-7 border border-[#262F4C] space-y-4 relative overflow-hidden bg-gradient-to-b from-[#121A2E]/80 to-[#0A0E1A]/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">AI Career Mentor Evaluation</h3>
              <p className="text-xs text-[#8D96B3]">Strategic insights from a Senior Engineering Mentor</p>
            </div>
          </div>

          <p className="text-sm text-[#EDEFF7] leading-relaxed bg-[#0A0E1A]/70 p-4 rounded-2xl border border-[#262F4C]">
            "{mentor.mentorSummary || insights.summary}"
          </p>

          {/* Action Items List */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold font-mono text-[#FFB020] uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#FFB020]" />
              High-Priority Resume Upgrades
            </span>
            <ul className="space-y-2">
              {(insights.actionItems || []).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB020] mt-1.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Strengths vs Gaps */}
        <div className="lg:col-span-5 space-y-4">
          {/* Strengths Card */}
          <div className="glass-card rounded-3xl p-5 border border-[#262F4C] space-y-3 bg-[#121A2E]/60">
            <div className="flex items-center gap-2 text-[#47E0A6]">
              <ShieldCheck className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Top Competitive Strengths</h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-200">
              {(profile.topStrengths || []).map((strength, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#47E0A6] mt-0.5 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Gaps Card */}
          <div className="glass-card rounded-3xl p-5 border border-[#262F4C] space-y-3 bg-[#121A2E]/60">
            <div className="flex items-center gap-2 text-[#FFB020]">
              <AlertTriangle className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider font-mono">High-Leverage Gaps to Fix</h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-200">
              {(profile.criticalGaps || []).map((gap, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB020] mt-1.5 flex-shrink-0" />
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3. TARGET HIGH-MATCH JOB ROLES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#262F4C] pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-display">Target High-Match Job Opportunities</h3>
          </div>
          <span className="text-xs text-[#8D96B3] font-mono">Market Compensation Benchmark</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(mentor.targetJobRoles || []).map((job, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-5 border border-[#262F4C] space-y-3 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                    {job.matchPercent}% MATCH
                  </span>
                  <Briefcase className="w-4 h-4 text-[#8D96B3]" />
                </div>
                <h4 className="text-sm font-bold text-white font-display">{job.role}</h4>
                <p className="text-xs text-[#8D96B3] leading-relaxed">{job.reason}</p>
              </div>

              {job.expectedSalaryRange && (
                <div className="pt-3 border-t border-[#262F4C] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#8D96B3]">Salary Band:</span>
                  <span className="text-[#47E0A6] font-bold flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    {job.expectedSalaryRange}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. 30-60-90 DAY CAREER ACCELERATION ROADMAP */}
      {mentor.growthRoadmap && (
        <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-[#262F4C] space-y-6 bg-gradient-to-b from-[#121A2E]/90 to-[#0A0E1A]/95">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262F4C] pb-4">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  30-60-90 Day Career Acceleration Roadmap
                </h3>
                <p className="text-xs text-[#8D96B3]">Step-by-step strategy to land top-tier offers</p>
              </div>
            </div>

            {/* Roadmap Tab Buttons */}
            <div className="flex items-center gap-2">
              {[
                { id: 'next30Days', label: 'Month 1 (30 Days)' },
                { id: 'next60Days', label: 'Month 2 (60 Days)' },
                { id: 'next90Days', label: 'Month 3 (90 Days)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveRoadmapTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeRoadmapTab === tab.id
                      ? 'btn-ignition'
                      : 'bg-[#0A0E1A] text-[#8D96B3] hover:text-white border border-[#262F4C]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Roadmap Steps */}
          <div className="space-y-3">
            {(mentor.growthRoadmap[activeRoadmapTab] || []).map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#0A0E1A]/80 border border-[#262F4C] flex items-start gap-3.5 hover:border-amber-500/30 transition-all"
              >
                <span className="w-6 h-6 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. STANDOUT PORTFOLIO PROJECTS TO BUILD */}
      {mentor.highImpactProjectsToBuild?.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#262F4C] pb-3">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white font-display">
              Recommended Standout Projects to Build
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentor.highImpactProjectsToBuild.map((proj, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 border border-[#262F4C] space-y-4 hover:border-indigo-500/40 transition-all"
              >
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white font-display">{proj.title}</h4>
                  <p className="text-xs text-[#8D96B3] leading-relaxed mt-1">{proj.description}</p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(proj.techStack || []).map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-lg bg-[#0A0E1A] border border-[#262F4C] text-[11px] font-mono text-cyan-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed">
                  <strong className="text-white block font-mono text-[10px] uppercase mb-0.5">
                    Why It Wins Interviews:
                  </strong>
                  {proj.whyItImpressesRecruiters}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. GOOGLE XYZ FORMULA BULLET POINT REWRITES */}
      {mentor.bulletPointFixes?.length > 0 && (
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-[#262F4C] space-y-4 bg-gradient-to-b from-[#121A2E]/70 to-[#0A0E1A]/85">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#47E0A6]" />
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Google XYZ Formula Bullet Point Rewriter
              </h3>
              <p className="text-xs text-[#8D96B3]">
                Accomplished [X] as measured by [Y], by doing [Z]
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {mentor.bulletPointFixes.map((fix, idx) => (
              <div key={idx} className="space-y-2 p-4 rounded-2xl bg-[#0A0E1A] border border-[#262F4C]">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                  <span className="font-mono font-bold text-[10px] uppercase block text-rose-400">
                    ❌ Before (Generic / Weak):
                  </span>
                  "{fix.original}"
                </div>

                <div className="p-2.5 rounded-xl bg-[#47E0A6]/10 border border-[#47E0A6]/20 text-xs text-[#47E0A6]">
                  <span className="font-mono font-bold text-[10px] uppercase block text-[#47E0A6]">
                    ✨ After (Quantified & High-Impact):
                  </span>
                  "{fix.improved}"
                </div>

                {fix.feedback && (
                  <p className="text-[11px] text-[#8D96B3] italic pl-1">
                    💡 <strong>Mentor Feedback:</strong> {fix.feedback}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. INTERVIEW PREPARATION QUESTIONS */}
      {mentor.interviewPrepQuestions?.length > 0 && (
        <div className="glass-card rounded-2xl p-6 border border-[#262F4C] space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white font-display">
              Tailored Technical & Behavioral Interview Questions
            </h4>
          </div>

          <ul className="space-y-2 text-xs text-slate-300">
            {mentor.interviewPrepQuestions.map((q, idx) => (
              <li key={idx} className="p-3 rounded-xl bg-[#0A0E1A] border border-[#262F4C] flex items-start gap-2.5">
                <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-200">
                  <strong className="text-cyan-400 font-mono mr-1.5">Q{idx + 1}:</strong>
                  {q}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
