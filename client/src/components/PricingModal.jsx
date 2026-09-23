import React, { useState } from 'react';
import api from '../services/api';
import {
  Sparkles,
  Check,
  Zap,
  X,
  CreditCard,
  Loader2,
  ShieldCheck,
  Building2,
  Scale,
  Bot,
  Cpu,
} from 'lucide-react';

export default function PricingModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [upgraded, setUpgraded] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await api.post('/billing/create-checkout-session', {
        returnUrl: window.location.href,
      });

      if (res.data.url) {
        // Upgrade tier in state for demo simulation or redirect
        await api.post('/billing/upgrade-tier', { tier: 'pro' });
        setUpgraded(true);
        setTimeout(() => {
          setUpgraded(false);
          onClose();
        }, 2200);
      }
    } catch (err) {
      alert('Subscription flow error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl glass-modal rounded-2xl shadow-2xl overflow-hidden relative border border-white/10 max-h-[92vh] flex flex-col bg-slate-950/90">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="pt-5 pb-3 px-6 text-center space-y-1.5 border-b border-white/5 bg-slate-900/40 flex-shrink-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-semibold backdrop-blur-md">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>SaaS Monetization & Stripe Billing</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Upgrade to <span className="text-gradient-ai">SmartDoc Pro</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto line-clamp-2">
            Unlock multi-document comparison, RAG citations, and priority AI analysis.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto">
          {/* Free Tier */}
          <div className="rounded-xl p-4 sm:p-5 glass-card border border-white/10 flex flex-col justify-between space-y-4 bg-slate-900/50">
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-white">Free Starter</h3>
                <p className="text-[11px] text-slate-400">Basic personal document extraction</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">$0</span>
                <span className="text-[11px] text-slate-500">/ forever</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>5 Documents / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>Standard Risk Scoring & Summary</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span>Server-Side PDF Export</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-750 border border-white/5 transition-colors"
            >
              Current Plan
            </button>
          </div>

          {/* Pro Tier */}
          <div className="rounded-xl p-4 sm:p-5 bg-gradient-to-b from-cyan-950/40 via-indigo-950/30 to-purple-950/20 border-2 border-cyan-500/40 shadow-lg shadow-cyan-500/10 flex flex-col justify-between space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-indigo-600 text-white text-[9px] font-black uppercase tracking-wider py-0.5 px-2.5 rounded-bl-lg shadow-md">
              Recommended
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Pro Professional</span>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </h3>
                <p className="text-[11px] text-cyan-300/80">For legal, finance & enterprise analysts</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">$29</span>
                <span className="text-[11px] text-slate-400">/ month</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                    <Cpu className="w-2.5 h-2.5" />
                  </div>
                  <span className="font-semibold text-white">Unlimited Processing</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                    <Scale className="w-2.5 h-2.5" />
                  </div>
                  <span>Multi-Doc Redline Matrix</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-2.5 h-2.5" />
                  </div>
                  <span>RAG Chat & Exact Citations</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-2.5 h-2.5" />
                  </div>
                  <span>Team Workspaces</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-2.5 h-2.5" />
                  </div>
                  <span>Priority AI Queue</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || upgraded}
              className="w-full py-2.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-md shadow-cyan-500/20 transition-all duration-200 transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Connecting Stripe Checkout...</span>
                </>
              ) : upgraded ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Plan Activated! (Pro Tier)</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Upgrade with Stripe ($29/mo)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="py-2.5 px-4 bg-slate-950/70 border-t border-white/5 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5 flex-shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Secured by Stripe 256-bit SSL Encryption • Cancel anytime</span>
        </div>
      </div>
    </div>
  );
}

