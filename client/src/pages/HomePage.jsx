import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Layers,
  Cpu,
  Database,
  Cloud,
  Scale,
  MessageSquare,
  FileText,
  CheckCircle2,
  Server,
} from 'lucide-react';
import AiEngineVisualizer from '../components/AiEngineVisualizer';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('legal');

  const demoScenarios = {
    legal: {
      fileName: 'Enterprise_Master_Service_Agreement_2026.pdf',
      category: 'Legal Contract',
      riskScore: 18,
      riskLevel: 'Low Risk',
      riskColor: 'text-[#47E0A6]',
      badgeBg: 'bg-[#47E0A6]/10 text-[#47E0A6] border-[#47E0A6]/30',
      summary:
        'Mutual enterprise SaaS agreement with standard 1x Annual Contract Value liability cap, 30-day termination without cause, and Delaware governing jurisdiction.',
      keyClauses: [
        'Capped Liability at 100% ARR (Fair)',
        'Mutual IP Protection & Indemnity',
        'GDPR & SOC-2 Compliance Attestation',
      ],
      actionItems: [
        'Execute Schedule A Appendix with Security Officer',
        'Confirm Net-30 Payment Escrow Integration',
      ],
      metrics: {
        latency: '0.64s',
        tokens: '1,420 Tokens',
        cacheHit: 'SHA-256 Hit',
      },
    },
    financial: {
      fileName: 'Q4_FY2025_Consolidated_Financial_10K.pdf',
      category: 'Financial Report',
      riskScore: 42,
      riskLevel: 'Moderate Exposure',
      riskColor: 'text-[#FFB020]',
      badgeBg: 'bg-[#FFB020]/10 text-[#FFB020] border-[#FFB020]/30',
      summary:
        'Audited Q4 earnings release reporting 34% YoY revenue growth. Identified significant FX foreign currency headwinds and a covenant clause requiring $15M minimum liquidity balance.',
      keyClauses: [
        'EBITDA Margin compressed by 2.4% via R&D expenditure',
        'Senior Debt Covenant: $15M minimum liquidity',
        'Deferred Revenue: $48.2M remaining on balance sheet',
      ],
      actionItems: [
        'Stress-test liquidity against Q1 FX currency volatility',
        'Verify debt ratio calculations with treasury team',
      ],
      metrics: {
        latency: '0.88s',
        tokens: '3,890 Tokens',
        cacheHit: 'Computed Fresh',
      },
    },
    resume: {
      fileName: 'Senior_Staff_AI_Engineer_Resume.pdf',
      category: 'Resume / HR Screening',
      riskScore: 8,
      riskLevel: 'Top Tier Match (96%)',
      riskColor: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      summary:
        'Exceptional senior profile with 8+ years distributed systems & LLM agent engineering experience. Strong mastery of Python, Node.js, PyTorch, LangChain, and BullMQ Redis orchestration.',
      keyClauses: [
        'Deep RAG Architecture & Vector Indexing expertise',
        'Engineered high-throughput event queues (15k ops/sec)',
        'Prior Senior Technical Lead at Fortune 500 AI Lab',
      ],
      actionItems: [
        'Schedule Technical Architecture Stage 2 Interview',
        'Align salary band with Staff L6 compensation benchmark',
      ],
      metrics: {
        latency: '0.52s',
        tokens: '980 Tokens',
        cacheHit: 'SHA-256 Hit',
      },
    },
    compliance: {
      fileName: 'SOC2_Type_II_Cloud_Security_Audit.pdf',
      category: 'Compliance & Audit',
      riskScore: 12,
      riskLevel: 'Certified Compliant',
      riskColor: 'text-[#47E0A6]',
      badgeBg: 'bg-[#47E0A6]/10 text-[#47E0A6] border-[#47E0A6]/30',
      summary:
        'Clean SOC-2 Type II audit report covering Security, Availability, and Confidentiality trust principles with 0 critical exceptions across AWS production clusters.',
      keyClauses: [
        'AES-256 Encryption at Rest & TLS 1.3 in Transit',
        'Automated 90-day IAM key rotation enforced',
        'Zero trust network access (ZTNA) verified on all endpoints',
      ],
      actionItems: [
        'File annual compliance certificate with enterprise vendor portal',
        'Schedule Q3 simulated disaster recovery drill',
      ],
      metrics: {
        latency: '0.71s',
        tokens: '2,400 Tokens',
        cacheHit: 'SHA-256 Hit',
      },
    },
  };

  const currentDoc = demoScenarios[activeTab];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24 relative z-10">
      {/* 1. HERO SECTION (2-Column AI Engineered Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-6 lg:pt-12">
        {/* Left Column: Heading, Subtitle, & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Status Chip */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121A2E]/80 border border-[#262F4C] text-[#EDEFF7] text-xs font-semibold backdrop-blur-xl shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#47E0A6] shadow-[0_0_8px_#47E0A6] animate-pulse" />
            <span className="font-mono text-[#47E0A6] text-[11px] font-bold tracking-wider">LIVE V2.0 ENGINE</span>
            <span className="text-[#8D96B3]">|</span>
            <span className="text-slate-300 text-[11px]">Gemini 2.0 + Groq LLaMA Dual-Core</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white font-display">
            Transform Raw Documents into{' '}
            <span className="text-gradient-ai">Autonomous Intelligence</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-[#8D96B3] max-w-2xl leading-relaxed font-normal">
            Enterprise document analysis engine with asynchronous BullMQ Redis queues, dual-engine LLM reasoning, Zod schema validation, SHA-256 token deduplication, and vector-grade PDF synthesis.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <Link
              to="/upload"
              className="btn-ignition px-7 py-3.5 rounded-2xl flex items-center justify-center gap-2.5 shadow-xl text-sm font-bold font-display group"
            >
              <Sparkles className="w-4 h-4 text-[#0A0E1A] group-hover:rotate-12 transition-transform" />
              <span>Launch Analysis Studio</span>
              <ArrowRight className="w-4 h-4 text-[#0A0E1A] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/compare"
              className="px-6 py-3.5 rounded-2xl font-bold text-sm text-slate-200 hover:text-white glass-card hover:bg-white/10 border border-[#262F4C] flex items-center justify-center gap-2 transition-all duration-200"
            >
              <Scale className="w-4 h-4 text-purple-400" />
              <span>Compare 2 Contracts</span>
            </Link>
          </div>

          {/* Micro Telemetry Bar */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#8D96B3] font-mono border-t border-[#262F4C]/60">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#47E0A6]" />
              <span><strong className="text-white">0.6s</strong> Avg Ingest</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB020]" />
              <span><strong className="text-white">99.4%</strong> Extraction Precision</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span><strong className="text-white">100%</strong> Cache Deduplication</span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Neural Engine Visualizer */}
        <div className="lg:col-span-5 w-full">
          <AiEngineVisualizer />
        </div>
      </div>

      {/* 2. FOUR-STAGE TRAJECTORY PIPELINE WAYPOINT RAIL */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full pill-accent text-xs font-mono font-bold tracking-wider uppercase">
            <span>Execution Pipeline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
            The 4-Stage Document Intelligence Lifecycle
          </h2>
          <p className="text-xs sm:text-sm text-[#8D96B3] max-w-xl mx-auto">
            From raw multipart file upload to verifiable structured reasoning and semantic search.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {/* Stage 01 */}
          <div className="glass-card rounded-2xl p-5 border border-[#262F4C] space-y-3 relative overflow-hidden group hover:border-cyan-500/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black font-mono text-cyan-400 tracking-wider">STAGE 01</span>
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Cloud className="w-4 h-4" />
              </span>
            </div>
            <h3 className="text-sm font-bold text-white font-display">Ingestion & Pre-flight</h3>
            <p className="text-xs text-[#8D96B3] leading-relaxed">
              Cloudinary multi-part stream storage, SHA-256 cryptographic hashing, and automated duplicate cache resolution.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-mono text-cyan-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero LLM Waste</span>
            </div>
          </div>

          {/* Stage 02 */}
          <div className="glass-card rounded-2xl p-5 border border-[#262F4C] space-y-3 relative overflow-hidden group hover:border-amber-500/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black font-mono text-amber-400 tracking-wider">STAGE 02</span>
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Server className="w-4 h-4" />
              </span>
            </div>
            <h3 className="text-sm font-bold text-white font-display">Asynchronous Queue</h3>
            <p className="text-xs text-[#8D96B3] leading-relaxed">
              BullMQ + Upstash Redis workers orchestrate OCR extraction and concurrency with instant status polling endpoints.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-mono text-amber-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Non-Blocking I/O</span>
            </div>
          </div>

          {/* Stage 03 */}
          <div className="glass-card rounded-2xl p-5 border border-[#262F4C] space-y-3 relative overflow-hidden group hover:border-[#47E0A6]/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black font-mono text-[#47E0A6] tracking-wider">STAGE 03</span>
              <span className="p-1.5 rounded-lg bg-[#47E0A6]/10 text-[#47E0A6] border-[#47E0A6]/20">
                <Cpu className="w-4 h-4" />
              </span>
            </div>
            <h3 className="text-sm font-bold text-white font-display">Dual LLM Reasoning</h3>
            <p className="text-xs text-[#8D96B3] leading-relaxed">
              Gemini 2.0 Flash and Groq LLaMA 3.3 70B execute strict Zod JSON schemas for risk scores, clauses, and actions.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-mono text-[#47E0A6]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Strict Schema Mode</span>
            </div>
          </div>

          {/* Stage 04 */}
          <div className="glass-card rounded-2xl p-5 border border-[#262F4C] space-y-3 relative overflow-hidden group hover:border-purple-500/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black font-mono text-purple-400 tracking-wider">STAGE 04</span>
              <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Layers className="w-4 h-4" />
              </span>
            </div>
            <h3 className="text-sm font-bold text-white font-display">Vector RAG & PDF Export</h3>
            <p className="text-xs text-[#8D96B3] leading-relaxed">
              Cosine similarity chunk search enables instant interactive Q&A citations and vector-rendered PDF reports.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-mono text-purple-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Direct Passage Citations</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE DOCUMENT INTELLIGENCE SHOWCASE */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#262F4C] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full pill-mint text-xs font-mono font-bold tracking-wider uppercase mb-2">
              <span>Interactive Telemetry Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              Live Multi-Domain Document Analysis
            </h2>
            <p className="text-xs sm:text-sm text-[#8D96B3]">
              Switch personas below to view live AI risk evaluation, executive synthesis, and detected legal clauses.
            </p>
          </div>

          {/* Domain Category Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'legal', label: 'Legal Contract', icon: '⚖️' },
              { id: 'financial', label: 'Financial 10-K', icon: '📊' },
              { id: 'resume', label: 'AI Engineer Resume', icon: '👤' },
              { id: 'compliance', label: 'SOC-2 Compliance', icon: '🛡️' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'btn-ignition'
                    : 'glass-card text-[#8D96B3] hover:text-white border-[#262F4C]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Document Preview Card */}
        <div className="relative">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#262F4C] space-y-6 shadow-2xl bg-gradient-to-b from-[#121A2E]/90 to-[#0A0E1A]/95">
            {/* Document Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262F4C] pb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display flex flex-wrap items-center gap-2">
                    <span>{currentDoc.fileName}</span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-mono font-bold ${currentDoc.badgeBg}`}>
                      {currentDoc.category}
                    </span>
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[#8D96B3] font-mono mt-1">
                    <span>Latency: <strong className="text-white">{currentDoc.metrics.latency}</strong></span>
                    <span>•</span>
                    <span>Tokens: <strong className="text-white">{currentDoc.metrics.tokens}</strong></span>
                    <span>•</span>
                    <span className="text-[#47E0A6]">{currentDoc.metrics.cacheHit}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-[#0A0E1A] p-3 rounded-2xl border border-[#262F4C]">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono font-bold text-[#8D96B3] block">Calculated Risk</span>
                  <p className={`text-lg font-black font-display ${currentDoc.riskColor}`}>
                    {currentDoc.riskScore}/100 <span className="text-xs font-normal">({currentDoc.riskLevel})</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Document Content Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Executive Summary */}
              <div className="glass-card rounded-2xl p-5 space-y-2 border border-[#262F4C] bg-[#121A2E]/50">
                <span className="text-[11px] font-bold font-mono text-[#FFB020] uppercase tracking-wider block">
                  Executive Synthesis
                </span>
                <p className="text-xs text-[#EDEFF7] leading-relaxed">
                  {currentDoc.summary}
                </p>
              </div>

              {/* Detected Key Clauses */}
              <div className="glass-card rounded-2xl p-5 space-y-2 border border-[#262F4C] bg-[#121A2E]/50">
                <span className="text-[11px] font-bold font-mono text-[#47E0A6] uppercase tracking-wider block">
                  Identified Key Clauses
                </span>
                <ul className="text-xs text-slate-300 space-y-2">
                  {currentDoc.keyClauses.map((clause, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#47E0A6] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-200">{clause}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actionable Checklist */}
              <div className="glass-card rounded-2xl p-5 space-y-2 border border-[#262F4C] bg-[#121A2E]/50">
                <span className="text-[11px] font-bold font-mono text-cyan-400 uppercase tracking-wider block">
                  Actionable Checklist
                </span>
                <ul className="text-xs text-slate-300 space-y-2">
                  {currentDoc.actionItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0 mt-1.5" />
                      <span className="text-xs text-slate-200">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SIX CORE ARCHITECTURAL PILLARS */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full pill-accent text-xs font-mono font-bold tracking-wider uppercase">
            <span>Production Engineering</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
            Engineered for Scalability & Fault Tolerance
          </h2>
          <p className="text-xs sm:text-sm text-[#8D96B3] max-w-xl mx-auto">
            Clean decoupling between ingestion endpoints, queue workers, AI reasoning cores, and client real-time telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="glass-card rounded-2xl p-6 space-y-3 border border-[#262F4C] hover:border-amber-500/40">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-display">Async BullMQ + Redis Workers</h3>
            <p className="text-xs sm:text-sm text-[#8D96B3] leading-relaxed">
              Heavy PDF parsing and AI inferences execute in background jobs with configurable concurrency and automatic retry backoff.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3 border border-[#262F4C] hover:border-indigo-500/40">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-display">Strict Zod Schema Enforcement</h3>
            <p className="text-xs sm:text-sm text-[#8D96B3] leading-relaxed">
              Guaranteed JSON validation protects downstream analytics from LLM hallucination or schema drift.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3 border border-[#262F4C] hover:border-[#47E0A6]/40">
            <div className="w-12 h-12 rounded-2xl bg-[#47E0A6]/10 border border-[#47E0A6]/20 text-[#47E0A6] flex items-center justify-center shadow-lg shadow-[#47E0A6]/10">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-display">SHA-256 Token Deduplication</h3>
            <p className="text-xs sm:text-sm text-[#8D96B3] leading-relaxed">
              Cryptographic content hashes stored in Redis cache eliminate 100% of redundant LLM token costs on identical uploads.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3 border border-[#262F4C] hover:border-purple-500/40">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/10">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-display">Multi-Doc Contract Comparison</h3>
            <p className="text-xs sm:text-sm text-[#8D96B3] leading-relaxed">
              Compare 2 agreements side-by-side with structured clause matrix, difference severities, and risk deltas.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3 border border-[#262F4C] hover:border-cyan-500/40">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-display">Interactive RAG Document Chat</h3>
            <p className="text-xs sm:text-sm text-[#8D96B3] leading-relaxed">
              Query documents in real time with Cosine similarity passage retrieval and verbatim quoted citations.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3 border border-[#262F4C] hover:border-rose-500/40">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/10">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-display">Vector PDF Report Export</h3>
            <p className="text-xs sm:text-sm text-[#8D96B3] leading-relaxed">
              Generate publication-grade downloadable PDF reports complete with corporate branding and risk visualizers.
            </p>
          </div>
        </div>
      </div>

      {/* 5. TECH STACK & INFRASTRUCTURE BADGES */}
      <div className="p-8 rounded-3xl glass-panel border border-[#262F4C] text-center space-y-6 backdrop-blur-xl">
        <h4 className="text-xs uppercase font-bold font-mono tracking-widest text-[#8D96B3]">
          POWERED BY PRODUCTION-GRADE CLOUD & AI INFRASTRUCTURE
        </h4>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold text-slate-300 font-mono">
          <span className="px-4 py-2 rounded-xl bg-[#0A0E1A] border border-[#262F4C]">⚛️ React 18 + Vite</span>
          <span className="px-4 py-2 rounded-xl bg-[#0A0E1A] border border-[#262F4C]">🎨 Custom Canvas Physics</span>
          <span className="px-4 py-2 rounded-xl bg-[#0A0E1A] border border-[#262F4C]">🟢 Node.js + Express</span>
          <span className="px-4 py-2 rounded-xl bg-[#0A0E1A] border border-[#262F4C]">🍃 MongoDB Atlas</span>
          <span className="px-4 py-2 rounded-xl bg-[#0A0E1A] border border-[#262F4C]">⚡ Upstash Redis + BullMQ</span>
          <span className="px-4 py-2 rounded-xl bg-[#0A0E1A] border border-[#262F4C]">🤖 Gemini 2.0 + Groq LLaMA</span>
          <span className="px-4 py-2 rounded-xl bg-[#0A0E1A] border border-[#262F4C]">☁️ Cloudinary Storage</span>
        </div>
      </div>
    </div>
  );
}
