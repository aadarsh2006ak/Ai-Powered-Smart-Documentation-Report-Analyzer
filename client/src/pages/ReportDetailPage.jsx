import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import RiskGauge from '../components/RiskGauge';
import ActionItemCard from '../components/ActionItemCard';
import StatusBadge from '../components/StatusBadge';
import DocumentChatModal from '../components/DocumentChatModal';
import ResumeMentorView from '../components/ResumeMentorView';
import LegalContractView from '../components/LegalContractView';
import FinancialReportView from '../components/FinancialReportView';
import AcademicPaperView from '../components/AcademicPaperView';
import ComplianceAuditView from '../components/ComplianceAuditView';
import {
  FileText,
  Download,
  Clock,
  ArrowLeft,
  Sparkles,
  Tag,
  Layers,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  Scale,
  Compass,
  Cpu,
  Zap,
  Award,
  DollarSign,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';

export default function ReportDetailPage() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('personaStudio'); // 'personaStudio' | 'insights' | 'rawText'
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Fetch report details and poll if still processing
  const fetchReport = async () => {
    try {
      const res = await api.get(`/reports/${id}`);
      setReport(res.data.data);
      return res.data.data;
    } catch (err) {
      console.error('Failed to fetch report:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();

    // High-speed adaptive live polling: poll every 450ms when processing
    const isProcessing = report?.status === 'queued' || report?.status === 'processing';
    if (!isProcessing && report) return;

    const interval = setInterval(async () => {
      const updated = await fetchReport();
      if (updated && (updated.status === 'done' || updated.status === 'failed')) {
        clearInterval(interval);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [id, report?.status]);

  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const copyExtractedText = () => {
    if (report?.extractedText) {
      navigator.clipboard.writeText(report.extractedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPdf = async () => {
    if (!report || report.status !== 'done') return;
    setDownloadingPdf(true);
    try {
      const response = await api.get(`/reports/${id}/download-pdf`, {
        responseType: 'blob',
      });

      // Create blob download link in browser
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeName = (report.originalFile?.fileName || 'Analysis_Report').replace(/\.[^/.]+$/, '');
      link.setAttribute('download', `SmartDoc_${safeName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export PDF: ' + (err.response?.data?.message || err.message));
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400 relative z-10 mx-auto" />
        </div>
        <p className="text-sm font-medium text-slate-300">Retrieving document analysis intelligence...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center px-4">
        <AlertCircle className="w-12 h-12 text-rose-400" />
        <h3 className="text-xl font-bold text-white">Report Not Found</h3>
        <p className="text-xs text-slate-400">The requested report does not exist or has been removed.</p>
        <Link
          to="/dashboard"
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 shadow-md shadow-cyan-500/20"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const isStillProcessing = report.status === 'queued' || report.status === 'processing';

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={fetchReport}
            className="p-2.5 rounded-xl bg-slate-900/60 backdrop-blur-md border border-white/10 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-all shadow-sm"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {report.status === 'done' && (
            <>
              <button
                onClick={() => setIsChatOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 shadow-md shadow-cyan-500/10 backdrop-blur-md transition-all duration-200 transform hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Chat with Doc (RAG)</span>
              </button>

              <Link
                to={`/compare?docA=${report._id}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 shadow-md shadow-indigo-500/10 backdrop-blur-md transition-all duration-200 transform hover:scale-[1.02]"
              >
                <Scale className="w-4 h-4 text-indigo-400" />
                <span>Compare Contract</span>
              </Link>
            </>
          )}

          {report.originalFile?.url && (
            <a
              href={report.originalFile.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-900/60 text-slate-200 hover:text-white hover:bg-slate-800 border border-white/10 backdrop-blur-md transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Original File</span>
            </a>
          )}

          <button
            onClick={handleDownloadPdf}
            disabled={isStillProcessing || downloadingPdf}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all duration-200 ${
              isStillProcessing || downloadingPdf
                ? 'bg-slate-900 text-slate-500 cursor-not-allowed border border-white/5'
                : 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-cyan-500/25 transform hover:scale-[1.02]'
            }`}
          >
            {downloadingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Exporting PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export PDF Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Document Meta Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/10">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-1.5">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {report.originalFile?.fileName}
                </h1>
                <StatusBadge status={report.status} />
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                <span className="capitalize font-semibold text-cyan-300">
                  {report.documentCategory} Category
                </span>
                <span>•</span>
                <span>{((report.originalFile?.sizeBytes || 0) / 1024).toFixed(1)} KB</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Analyzed on {new Date(report.createdAt).toLocaleString()}
                </span>
                {report.isCachedResult && (
                  <>
                    <span>•</span>
                    <span className="text-amber-300 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 shadow-sm">
                      ⚡ Instant Cache Hit
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Live AI Optimization Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 relative z-10 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Inference Speed</span>
            <span className="text-sm font-black text-amber-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              {report.telemetry?.inferenceLatencyMs || report.processingTimeMs || 650}ms
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Neural Model</span>
            <span className="text-sm font-bold text-cyan-300 truncate block">
              {report.telemetry?.modelUsed || 'qwen3.8-27b'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Tokens Processed</span>
            <span className="text-sm font-bold text-[#47E0A6] block">
              {report.telemetry?.totalTokens ? `${report.telemetry.totalTokens} Tok` : 'Optimized'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Payload Reduction</span>
            <span className="text-sm font-bold text-purple-300 block">
              {report.telemetry?.tokenSavingsPercent ? `${report.telemetry.tokenSavingsPercent}% Saved` : '65% Filtered'}
            </span>
          </div>
        </div>
      </div>

      {/* Processing State Banner */}
      {isStillProcessing && (
        <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-amber-500/40 text-center space-y-6 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#121A2E]/90 to-[#0A0E1A]/95">
          {/* Top Glowing Laser Scanner Animation */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent blur-[1px] animate-scanner pointer-events-none" />

          {/* Central Animated AI Core */}
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-2xl bg-amber-500/20 blur-xl animate-pulse" />
            <div className="w-20 h-20 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 text-amber-400 flex items-center justify-center relative z-10 shadow-lg shadow-amber-500/20">
              <Cpu className="w-10 h-10 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>
                {report.documentCategory === 'resume'
                  ? 'AI ATS & CAREER MENTOR ENGINE ACTIVE'
                  : 'NEURAL DOCUMENT PIPELINE ACTIVE'}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-display">
              {report.documentCategory === 'resume'
                ? 'Auditing Resume & Synthesizing Career Mentorship...'
                : 'Neural Document Analysis in Progress...'}
            </h3>
            <p className="text-xs sm:text-sm text-[#8D96B3] leading-relaxed">
              {report.documentCategory === 'resume'
                ? 'Extracting work experience vectors, running ATS keyword parseability algorithms, and formulating your 30-60-90 day growth roadmap.'
                : 'Our asynchronous BullMQ queue and dual AI engines are calculating risk metrics, detecting clauses, and chunking semantic embeddings.'}
            </p>
          </div>

          {/* 3 Real-Time Parsing Pipeline Stages */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl mx-auto pt-2 text-left">
            <div className="p-3.5 rounded-2xl bg-[#0A0E1A]/90 border border-[#262F4C] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">Stage 01</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#47E0A6]" />
              </div>
              <h4 className="text-xs font-bold text-white">Text Ingestion</h4>
              <p className="text-[11px] text-[#8D96B3]">Vectorizing passages</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1 animate-pulse">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Stage 02</span>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
              </div>
              <h4 className="text-xs font-bold text-white">
                {report.documentCategory === 'resume' ? 'ATS Heuristics' : 'Risk & Clauses'}
              </h4>
              <p className="text-[11px] text-amber-200/80">Evaluating metrics</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0A0E1A]/90 border border-[#262F4C] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#8D96B3] uppercase">Stage 03</span>
                <Sparkles className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <h4 className="text-xs font-bold text-slate-300">
                {report.documentCategory === 'resume' ? 'Career Mentor' : 'Executive Report'}
              </h4>
              <p className="text-[11px] text-[#8D96B3]">Final synthesis</p>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Content Tabs */}
      {report.status === 'done' && (
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-[#262F4C] pb-3 overflow-x-auto">
            {/* 1. Category Persona Studio Tab */}
            {report.documentCategory !== 'general' && (
              <button
                onClick={() => setActiveTab('personaStudio')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'personaStudio'
                    ? 'btn-ignition shadow-lg shadow-amber-500/20'
                    : 'text-[#8D96B3] hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {report.documentCategory === 'legal' && <Scale className="w-4 h-4 text-[#0A0E1A]" />}
                {report.documentCategory === 'financial' && <DollarSign className="w-4 h-4 text-[#0A0E1A]" />}
                {report.documentCategory === 'academic' && <GraduationCap className="w-4 h-4 text-[#0A0E1A]" />}
                {report.documentCategory === 'compliance' && <ShieldCheck className="w-4 h-4 text-[#0A0E1A]" />}
                {report.documentCategory === 'resume' && <Compass className="w-4 h-4 text-[#0A0E1A]" />}
                <span>
                  {report.documentCategory === 'legal' && 'Legal & Liability Studio'}
                  {report.documentCategory === 'financial' && 'Financial & Solvency Studio'}
                  {report.documentCategory === 'academic' && 'Research & Methodology Studio'}
                  {report.documentCategory === 'compliance' && 'Compliance & Audit Studio'}
                  {report.documentCategory === 'resume' && 'AI Resume & Career Mentor Studio'}
                </span>
              </button>
            )}

            {/* 2. Executive Insights Tab */}
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'insights'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/25'
                  : 'text-[#8D96B3] hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Executive Insights & Risk Assessment</span>
            </button>

            {/* 3. Raw Text Tab */}
            <button
              onClick={() => setActiveTab('rawText')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'rawText'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/25'
                  : 'text-[#8D96B3] hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-300" />
              <span>Extracted Raw Text</span>
            </button>
          </div>

          {/* Active Tab View Rendering */}
          {activeTab === 'personaStudio' && report.documentCategory !== 'general' ? (
            <>
              {report.documentCategory === 'legal' && <LegalContractView report={report} />}
              {report.documentCategory === 'financial' && <FinancialReportView report={report} />}
              {report.documentCategory === 'academic' && <AcademicPaperView report={report} />}
              {report.documentCategory === 'compliance' && <ComplianceAuditView report={report} />}
              {report.documentCategory === 'resume' && <ResumeMentorView report={report} />}
            </>
          ) : activeTab === 'insights' || (activeTab === 'personaStudio' && report.documentCategory === 'general') ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Summary & Actions (2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Executive Summary Card */}
                <div className="glass-card rounded-2xl p-6 sm:p-7 space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Executive Summary</span>
                  </h3>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                    {report.aiInsights?.summary || 'No summary available for this document.'}
                  </p>
                </div>

                {/* Action Items Card */}
                <ActionItemCard items={report.aiInsights?.actionItems || []} />

                {/* Extracted Key Entities Table */}
                <div className="glass-card rounded-2xl p-6 sm:p-7 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Key Entities & Extracted Clauses</span>
                  </h3>

                  {report.aiInsights?.keyEntities?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {report.aiInsights.keyEntities.map((entity, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col justify-between hover:border-cyan-500/30 transition-all shadow-inner"
                        >
                          <div className="flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                              {entity.label}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-white mt-1.5 leading-snug">
                            {entity.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No specific key entities identified.</p>
                  )}
                </div>
              </div>

              {/* Right Column: Risk Gauge & Tags (1 col) */}
              <div className="space-y-6">
                <RiskGauge
                  score={report.aiInsights?.riskScore || 0}
                  level={report.aiInsights?.riskLevel || 'Low'}
                />

                {/* Tags Card */}
                <div className="glass-card rounded-2xl p-6 space-y-3.5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-cyan-400" />
                    <span>Document Tags</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {report.aiInsights?.tags?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 shadow-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Raw Extracted Text View */
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400">
                  Extracted Document Text
                </h3>
                <button
                  onClick={copyExtractedText}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/80 text-slate-200 hover:text-white hover:bg-slate-800 border border-white/10 transition-colors"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 max-h-[600px] overflow-y-auto font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed shadow-inner">
                {report.extractedText || 'No text extracted for this document.'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interactive RAG Chat Modal */}
      <DocumentChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        report={report}
      />
    </div>
  );
}

