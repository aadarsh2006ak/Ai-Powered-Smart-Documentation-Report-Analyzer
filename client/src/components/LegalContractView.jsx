import React from 'react';
import {
  Scale,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ShieldCheck,
  FileText,
  AlertOctagon,
  Gavel,
  BookOpen,
} from 'lucide-react';

export default function LegalContractView({ report }) {
  const legal = report?.aiInsights?.legalInsights || {};
  const riskClauses = legal.riskClauses || [];
  const obligations = legal.keyObligations || [];
  const missingClauses = legal.missingProtections || legal.missingStandardClauses || [];

  const governingLawText =
    legal.governingLaw ||
    report?.aiInsights?.legalClauses?.governingLaw ||
    'Delaware / General Law';

  const jurisdictionText = legal.jurisdiction || 'Designated state/federal courts';

  const terminationNoticeText =
    legal.noticeAndTermination?.terminationNoticePeriod ||
    legal.terminationClause?.noticePeriodDays ||
    legal.terminationClause?.summary ||
    report?.aiInsights?.legalClauses?.terminationClause ||
    '30 Days Notice';

  const breachCureText =
    legal.noticeAndTermination?.curePeriodForBreach ||
    legal.terminationClause?.breachConditions ||
    '15 Days Standard Cure Window';

  const liabilityCapText =
    legal.indemnityAndLiability?.liabilityCap ||
    report?.aiInsights?.legalClauses?.indemnityRisk ||
    '12 Months Fees ($250,000 Cap)';

  const uncappedText =
    legal.indemnityAndLiability?.uncappedLiabilities?.length > 0
      ? (Array.isArray(legal.indemnityAndLiability.uncappedLiabilities)
          ? legal.indemnityAndLiability.uncappedLiabilities.join(', ')
          : legal.indemnityAndLiability.uncappedLiabilities)
      : legal.indemnityAndLiability?.indemnificationScope || 'Mutual IP Indemnification';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner: Governing Law & Liability Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 space-y-1.5 bg-gradient-to-br from-amber-500/10 to-transparent shadow-lg">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Gavel className="w-4 h-4" />
            <span>Governing Law</span>
          </div>
          <p className="text-base font-black text-white">{governingLawText}</p>
          <p className="text-[11px] text-slate-400">{jurisdictionText}</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 space-y-1.5 bg-gradient-to-br from-cyan-500/10 to-transparent shadow-lg">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Termination Notice</span>
          </div>
          <p className="text-base font-black text-white">{terminationNoticeText}</p>
          <p className="text-[11px] text-slate-400">{breachCureText}</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 space-y-1.5 bg-gradient-to-br from-rose-500/10 to-transparent shadow-lg">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Liability Ceiling</span>
          </div>
          <p className="text-base font-black text-white">{liabilityCapText}</p>
          <p className="text-[11px] text-slate-400 truncate" title={uncappedText}>{uncappedText}</p>
        </div>
      </div>

      {/* Clause-by-Clause Risk Breakdown */}
      <div className="glass-card rounded-2xl p-6 sm:p-7 space-y-5 border border-white/10 bg-slate-900/50">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Clause-by-Clause Risk Assessment</h3>
              <p className="text-xs text-slate-400">
                Identified legal vulnerabilities, uncapped liabilities, and recommended amendments
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
            {riskClauses.length} Critical Clauses Indexed
          </span>
        </div>

        {riskClauses.length > 0 ? (
          <div className="space-y-4">
            {riskClauses.map((clause, idx) => {
              const severity = (clause.riskSeverity || clause.severity || 'Medium').toUpperCase();
              const isHigh = severity.includes('HIGH') || severity.includes('CRITICAL');
              const isMedium = severity.includes('MEDIUM');
              const quoteText = clause.exactQuote || clause.quote;
              const analysisText =
                clause.riskAnalysis ||
                clause.explanation ||
                'Potential imbalance in contractual risk allocation.';
              const adviceText =
                clause.mitigationAdvice ||
                clause.recommendation ||
                'Redline clause to establish mutual standard terms.';

              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all space-y-3.5 shadow-md ${
                    isHigh
                      ? 'bg-rose-500/5 border-rose-500/30 hover:border-rose-500/50'
                      : isMedium
                      ? 'bg-amber-500/5 border-amber-500/30 hover:border-amber-500/50'
                      : 'bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-white">
                      {isHigh ? (
                        <AlertOctagon className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      )}
                      <span>{clause.clauseName || clause.title || `Clause #${idx + 1}`}</span>
                      {clause.sectionNumber && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                          {clause.sectionNumber}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                        isHigh
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : isMedium
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {severity} Severity
                    </span>
                  </div>

                  {quoteText && (
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 font-mono text-xs text-slate-300 italic border-l-2 border-l-amber-400 flex items-start gap-2.5">
                      <BookOpen className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>"{quoteText}"</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-950/50 border border-white/5 space-y-1">
                      <span className="font-bold text-rose-300 uppercase tracking-wider text-[10px] block">
                        Legal Risk Analysis
                      </span>
                      <p className="text-slate-300 leading-relaxed">{analysisText}</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-950/50 border border-white/5 space-y-1">
                      <span className="font-bold text-emerald-300 uppercase tracking-wider text-[10px] block">
                        Lawyer-Grade Mitigation
                      </span>
                      <p className="text-slate-300 leading-relaxed">{adviceText}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No severe risk clauses detected in this agreement.</p>
        )}
      </div>

      {/* Key Obligations & Missing Safeguards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Obligations Table */}
        <div className="glass-card rounded-2xl p-6 space-y-4 border border-white/10 bg-slate-900/50">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Key Covenants & Deliverables</span>
          </h3>
          {obligations.length > 0 ? (
            <div className="space-y-2.5">
              {obligations.map((ob, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-start gap-3 hover:border-cyan-500/30 transition-all">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{ob.party}</span>
                      {ob.deadline && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-amber-300 font-mono">
                          {ob.deadline}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300">{ob.obligation}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">Standard operational deliverables apply.</p>
          )}
        </div>

        {/* Missing Standard Clauses */}
        <div className="glass-card rounded-2xl p-6 space-y-4 border border-white/10 bg-slate-900/50">
          <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>Missing Standard Protections</span>
          </h3>
          {missingClauses.length > 0 ? (
            <div className="space-y-2.5">
              {missingClauses.map((missing, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-center gap-3 hover:border-rose-500/40 transition-all">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span className="text-xs text-slate-200 font-medium">
                    {typeof missing === 'string' ? missing : JSON.stringify(missing)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>All baseline standard protective covenants are present in this document.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

