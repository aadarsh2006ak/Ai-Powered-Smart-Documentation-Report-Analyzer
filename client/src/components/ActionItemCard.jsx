import React, { useState } from 'react';
import { Square, CheckCircle2, ListChecks } from 'lucide-react';

export default function ActionItemCard({ items = [] }) {
  const [checkedItems, setCheckedItems] = useState({});

  const toggleItem = (index) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (!items || items.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5 text-slate-400 text-sm">
        No immediate action items identified.
      </div>
    );
  }

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-cyan-400" />
          <span>Action Items Checklist</span>
        </h4>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 shadow-sm">
          {completedCount}/{items.length} Resolved
        </span>
      </div>

      <div className="space-y-2.5">
        {items.map((item, idx) => {
          const isChecked = !!checkedItems[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleItem(idx)}
              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                isChecked
                  ? 'bg-slate-950/40 border-white/5 text-slate-500 line-through'
                  : 'bg-slate-900/60 border-white/10 text-slate-200 hover:border-cyan-500/40 hover:bg-slate-850/80 shadow-sm'
              }`}
            >
              <button className="mt-0.5 text-cyan-400 flex-shrink-0 transition-transform active:scale-95">
                {isChecked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
              </button>
              <span className="text-xs sm:text-sm leading-relaxed">{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

