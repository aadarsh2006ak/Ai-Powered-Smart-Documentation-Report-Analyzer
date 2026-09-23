import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function RiskGauge({ score = 0, level = 'Low' }) {
  // Normalize score between 0 and 100
  const normalizedScore = Math.min(Math.max(score, 0), 100);

  const getRiskDetails = () => {
    if (normalizedScore >= 70 || level === 'High') {
      return {
        color: 'text-rose-400',
        strokeColor: '#f43f5e',
        glowColor: 'rgba(244, 63, 94, 0.4)',
        bgColor: 'bg-rose-500/10 border-rose-500/30',
        badgeColor: 'bg-rose-500/10 text-rose-300 border-rose-500/30 shadow-sm shadow-rose-500/20',
        icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
        label: 'High Risk Exposure',
        description: 'Requires immediate attention & legal/financial indemnification review.',
      };
    }
    if (normalizedScore >= 35 || level === 'Medium') {
      return {
        color: 'text-amber-400',
        strokeColor: '#f59e0b',
        glowColor: 'rgba(245, 158, 11, 0.4)',
        bgColor: 'bg-amber-500/10 border-amber-500/30',
        badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-sm shadow-amber-500/20',
        icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        label: 'Moderate Risk',
        description: 'Contains standard commercial clauses with moderate recurring obligations.',
      };
    }
    return {
      color: 'text-emerald-400',
      strokeColor: '#10b981',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30',
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-sm shadow-emerald-500/20',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      label: 'Low Risk Profile',
      description: 'Document adheres to standard safety guidelines with minimal liability exposure.',
    };
  };

  const details = getRiskDetails();
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
      <div className="flex items-center gap-5 relative z-10">
        {/* Circular Progress Gauge */}
        <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke={details.strokeColor}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{ filter: `drop-shadow(0 0 6px ${details.glowColor})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-white">{normalizedScore}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">/ 100</span>
          </div>
        </div>

        {/* Details info */}
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            {details.icon}
            <span className="text-sm font-bold text-white tracking-wide">Risk Assessment</span>
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${details.badgeColor}`}>
              {details.label}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{details.description}</p>
        </div>
      </div>
    </div>
  );
}

