import React from 'react';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  Zap,
  BarChart3,
  ShieldAlert,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  Flame,
} from 'lucide-react';

export default function FinancialReportView({ report }) {
  const fin = report?.aiInsights?.financialInsights || {};
  const metrics = fin.metrics || report?.aiInsights?.financialMetrics || {};

  // Extract anomalies safely across all schema variations
  const anomalies = Array.isArray(fin.anomalies) ? fin.anomalies : [];

  // Extract CFO recommendations / Action plans
  const recs = [
    ...(Array.isArray(fin.cfoRecommendations) ? fin.cfoRecommendations : []),
    ...(Array.isArray(fin.cfoActionPlan?.nearTermLiquidityActions) ? fin.cfoActionPlan.nearTermLiquidityActions : []),
    ...(Array.isArray(fin.cfoActionPlan?.longTermStrategicDirectives) ? fin.cfoActionPlan.longTermStrategicDirectives : []),
    ...(Array.isArray(report?.aiInsights?.actionItems) && !fin.cfoRecommendations ? report.aiInsights.actionItems : []),
  ];

  const cashRunwayValue =
    metrics.cashRunway ||
    metrics.runwayMonths ||
    metrics.runway ||
    (fin.profitabilityAnalysis?.burnRate ? `${fin.profitabilityAnalysis.burnRate}` : 'N/A');

  const kpis = [
    {
      label: 'Revenue',
      value: metrics.revenue || 'N/A',
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
    },
    {
      label: 'Net Income',
      value: metrics.netIncome || 'N/A',
      icon: TrendingUp,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/30',
    },
    {
      label: 'Gross Margin',
      value: metrics.grossMargin || 'N/A',
      icon: PieChart,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30',
    },
    {
      label: 'EBITDA',
      value: metrics.ebitda || 'N/A',
      icon: BarChart3,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/30',
    },
    {
      label: 'Cash Runway',
      value: cashRunwayValue,
      icon: Clock,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10 border-teal-500/30',
    },
    {
      label: 'Operating Expenses',
      value: metrics.operatingExpenses || metrics.expenses || 'N/A',
      icon: ArrowUpRight,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/30',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Executive Financial Summary */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 space-y-4 bg-gradient-to-br from-emerald-500/10 via-[#0A0E1A] to-transparent shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white font-display">
                Executive Financial & Solvency Analysis
              </h2>
              <p className="text-xs text-slate-400">
                Balance sheet health, margin dynamics, and anomaly detection
              </p>
            </div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Fiscal Health Score</span>
            <span className="text-base font-black text-emerald-300">
              {fin.fiscalHealthScore || 85}/100
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed pt-1">
          {fin.executiveSummary ||
            report?.aiInsights?.summary ||
            'Detailed balance sheet and operational financial audit analysis.'}
        </p>
      </div>

      {/* 6 Key Financial KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl glass-card border border-white/10 space-y-1.5 flex flex-col justify-between hover:border-white/20 transition-all bg-slate-900/60"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                  {kpi.label}
                </span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${kpi.bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${kpi.color}`} />
                </div>
              </div>
              <span className={`text-sm sm:text-base font-black ${kpi.color} tracking-tight`}>
                {kpi.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Anomalies & Discrepancies Radar */}
      <div className="glass-card rounded-2xl p-6 sm:p-7 space-y-5 border border-white/10 bg-slate-900/50">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Financial Anomalies & Variances</h3>
              <p className="text-xs text-slate-400">
                Detected discrepancies, unbudgeted expenditure spikes, and risk exposures
              </p>
            </div>
          </div>
          <span
            className={`text-xs font-mono px-3 py-1 rounded-full border font-bold ${
              anomalies.length > 0
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
            }`}
          >
            {anomalies.length} Flagged Variances
          </span>
        </div>

        {anomalies.length > 0 ? (
          <div className="space-y-3.5">
            {anomalies.map((anom, idx) => {
              const title =
                anom.title || anom.metricName || anom.anomalyType || `Anomaly #${idx + 1}`;
              const description =
                anom.description ||
                anom.explanation ||
                anom.riskAnalysis ||
                'Unbudgeted variance detected in operational expenditure.';
              const impact = anom.impactEstimate || anom.variance || anom.amount;
              const severity = (anom.severity || anom.significance || 'Warning').toUpperCase();

              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2.5 hover:border-rose-500/30 transition-all shadow-md"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-white">
                      {severity.includes('CRITICAL') || severity.includes('HIGH') ? (
                        <Flame className="w-4 h-4 text-rose-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      )}
                      <span>{title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {impact && (
                        <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                          Variance: {impact}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-lg border ${
                          severity.includes('CRITICAL') || severity.includes('HIGH')
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {severity}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{description}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white text-xs">No Critical Financial Variances Detected</p>
              <p className="text-[11px] text-emerald-300/80">
                All P&L balance lines, margins, and recurring operational expenditures conform to expected fiscal benchmarks.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* CFO Recommendations & Action Plan */}
      <div className="glass-card rounded-2xl p-6 sm:p-7 space-y-4 border border-white/10 bg-slate-900/50">
        <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Strategic CFO Action Plan</span>
        </h3>
        {recs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recs.map((rec, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex items-start gap-3 text-xs text-slate-200 leading-relaxed hover:border-cyan-500/30 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>{typeof rec === 'string' ? rec : rec.action || JSON.stringify(rec)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">Standard operating financial controls apply.</p>
        )}
      </div>
    </div>
  );
}

