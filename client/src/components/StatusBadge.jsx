import React from 'react';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function StatusBadge({ status }) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'done':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-sm shadow-emerald-500/10',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'Completed',
          dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
        };
      case 'processing':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-sm shadow-amber-500/10',
          icon: <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />,
          label: 'Neural Parsing',
          dot: 'bg-amber-400 animate-ping shadow-[0_0_8px_rgba(251,191,36,0.8)]',
        };
      case 'queued':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 shadow-sm shadow-cyan-500/10',
          icon: <Clock className="w-3.5 h-3.5 text-cyan-400" />,
          label: 'In Queue',
          dot: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]',
        };
      case 'failed':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-sm shadow-rose-500/10',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />,
          label: 'Failed',
          dot: 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]',
        };
      default:
        return {
          bg: 'bg-slate-500/10 border-white/10 text-slate-400',
          icon: <Clock className="w-3.5 h-3.5" />,
          label: status || 'Unknown',
          dot: 'bg-slate-400',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${config.bg} transition-all duration-200`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}

