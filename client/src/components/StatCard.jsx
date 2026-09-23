import React from 'react';

export default function StatCard({ title, value, subtitle, icon, trend }) {
  return (
    <div className="glass-card rounded-2xl p-5 relative overflow-hidden group">
      {/* Background ambient glow */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all duration-300 pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{value}</h3>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-cyan-400 group-hover:scale-110 group-hover:border-cyan-500/30 group-hover:text-cyan-300 transition-all duration-300 shadow-inner">
          {icon}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 relative z-10">
          {trend && (
            <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {trend}
            </span>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
}

