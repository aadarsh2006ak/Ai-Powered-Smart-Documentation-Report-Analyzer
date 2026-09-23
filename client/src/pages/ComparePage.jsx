import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import {
  Scale,
  ArrowRightLeft,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Loader2,
  HelpCircle,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

export default function ComparePage() {
  const [searchParams] = useSearchParams();
  const [reports, setReports] = useState([]);
  const [docAId, setDocAId] = useState(searchParams.get('docA') || '');
  const [docBId, setDocBId] = useState('');
  const [loadingReports, setLoadingReports] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [comparisonData, setComparisonData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAvailableReports();
  }, []);

  const fetchAvailableReports = async () => {
    try {
      const res = await api.get('/reports?limit=50');
      const completed = (res.data.data || []).filter((r) => r.status === 'done');
      setReports(completed);
      if (completed.length >= 2 && !docAId) {
        setDocAId(completed[0]._id);
        setDocBId(completed[1]._id);
      } else if (completed.length >= 2 && docAId) {
        const other = completed.find((r) => r._id !== docAId);
        if (other) setDocBId(other._id);
      }
    } catch (err) {
      console.error('Failed to load reports for comparison:', err.message);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleRunComparison = async () => {
    if (!docAId || !docBId) {
      setError('Please select two documents to compare.');
      return;
    }
    if (docAId === docBId) {
      setError('Please select two different documents to compare.');
      return;
    }

    setError('');
    setComparing(true);

    try {
      const res = await api.post('/reports/compare', {
        reportAId: docAId,
        reportBId: docBId,
      });
      setComparisonData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Comparison failed. Please try again.');
    } finally {
      setComparing(false);
    }
  };

  const swapDocuments = () => {
    const temp = docAId;
    setDocAId(docBId);
    setDocBId(temp);
  };

  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30 shadow-sm shadow-rose-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-sm shadow-amber-500/20';
      default:
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-sm shadow-emerald-500/20';
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold backdrop-blur-md">
          <Scale className="w-3.5 h-3.5 text-cyan-400" />
          <span>Multi-Document Comparative Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Compare Contracts & Document <span className="text-gradient-ai">Versions</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Conduct deep side-by-side AI analysis between two contracts, vendors, or policy revisions to detect risk discrepancies, liability caps, and unfavorable covenants.
        </p>
      </div>

      {/* Document Selector Grid */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* Doc A Selection */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Document A (Baseline)</span>
            </label>
            <select
              value={docAId}
              onChange={(e) => setDocAId(e.target.value)}
              className="w-full glass-dropdown rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-all cursor-pointer"
              disabled={loadingReports}
            >
              <option value="" className="bg-slate-900 text-slate-400">Select Document A...</option>
              {reports.map((r) => (
                <option key={r._id} value={r._id} className="bg-slate-900 text-white">
                  {r.originalFile?.fileName} ({r.documentCategory} • Risk: {r.aiInsights?.riskScore || 0}%)
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center md:pt-6">
            <button
              onClick={swapDocuments}
              className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 transition-all shadow-md transform hover:scale-105"
              title="Swap Documents"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Doc B Selection */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>Document B (Comparison Target)</span>
            </label>
            <select
              value={docBId}
              onChange={(e) => setDocBId(e.target.value)}
              className="w-full glass-dropdown rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
              disabled={loadingReports}
            >
              <option value="" className="bg-slate-900 text-slate-400">Select Document B...</option>
              {reports.map((r) => (
                <option key={r._id} value={r._id} className="bg-slate-900 text-white">
                  {r.originalFile?.fileName} ({r.documentCategory} • Risk: {r.aiInsights?.riskScore || 0}%)
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleRunComparison}
            disabled={comparing || !docAId || !docBId || docAId === docBId}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-lg shadow-cyan-500/25 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {comparing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Synthesizing Comparative Delta...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run AI Contract Comparison</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Comparison Results Section */}
      {comparisonData && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Risk Delta Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Doc A Score Card */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-2">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Document A Exposure
              </span>
              <h3 className="text-lg font-bold text-white truncate">
                {comparisonData.docA?.fileName}
              </h3>
              <div className="flex items-center gap-3 pt-2">
                <span className="text-3xl font-black text-white">
                  {comparisonData.comparison?.riskComparison?.docARiskScore || 0}%
                </span>
                <span className="text-xs text-slate-400">Calculated Risk Factor</span>
              </div>
            </div>

            {/* Delta & Winner Banner */}
            <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30 bg-cyan-500/5 space-y-2 text-center flex flex-col justify-center items-center shadow-lg">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Recommended / Safer Option
              </span>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-black shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{comparisonData.comparison?.riskComparison?.saferDocument}</span>
              </div>
              <p className="text-xs text-slate-300 pt-1 leading-relaxed">
                {comparisonData.comparison?.riskComparison?.riskRationale}
              </p>
            </div>

            {/* Doc B Score Card */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-2">
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                Document B Exposure
              </span>
              <h3 className="text-lg font-bold text-white truncate">
                {comparisonData.docB?.fileName}
              </h3>
              <div className="flex items-center gap-3 pt-2">
                <span className="text-3xl font-black text-white">
                  {comparisonData.comparison?.riskComparison?.docBRiskScore || 0}%
                </span>
                <span className="text-xs text-slate-400">Calculated Risk Factor</span>
              </div>
            </div>
          </div>

          {/* High-Level Comparison Synthesis */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Comparative Executive Synthesis</span>
            </h3>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              {comparisonData.comparison?.comparisonSummary}
            </p>
          </div>

          {/* Clause Comparison Matrix Table */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" />
              <span>Structured Clause Comparison Matrix</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 uppercase text-[11px] font-bold">
                    <th className="pb-3 px-4">Clause Dimension</th>
                    <th className="pb-3 px-4">Document A Terms</th>
                    <th className="pb-3 px-4">Document B Terms</th>
                    <th className="pb-3 px-4 text-center">Severity</th>
                    <th className="pb-3 px-4 text-right">Favorable To</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(comparisonData.comparison?.clauseComparisonMatrix || []).map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-4 px-4 font-bold text-white whitespace-nowrap">
                        {row.clauseType}
                      </td>
                      <td className="py-4 px-4 text-slate-300 max-w-[240px] leading-relaxed">
                        {row.docAValue}
                      </td>
                      <td className="py-4 px-4 text-slate-300 max-w-[240px] leading-relaxed">
                        {row.docBValue}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getSeverityBadge(
                            row.differenceSeverity
                          )}`}
                        >
                          {row.differenceSeverity}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-cyan-300">
                        {row.favorableTo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Strategic Takeaways & Negotiation Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Takeaways */}
            <div className="glass-card rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Critical Discrepancies & Takeaways</span>
              </h3>
              <ul className="space-y-2.5">
                {(comparisonData.comparison?.keyTakeaways || []).map((item, i) => (
                  <li key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Negotiation Recommendations */}
            <div className="glass-card rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Legal & Negotiation Recommendations</span>
              </h3>
              <ul className="space-y-2.5">
                {(comparisonData.comparison?.negotiationRecommendations || []).map((rec, i) => (
                  <li key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

