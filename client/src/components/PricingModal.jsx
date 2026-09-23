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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl glass-modal rounded-3xl shadow-2xl overflow-hidden relative border border-white/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-850 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 text-center space-y-2 border-b border-white/10 bg-slate-950/40">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>SaaS Monetization & Stripe Billing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Upgrade to <span className="text-gradient-ai">SmartDoc Pro</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Unlock enterprise-grade multi-document comparison, conversational RAG passage search, and high-throughput AI document processing.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Tier */}
          <div className="rounded-2xl p-6 glass-card border border-white/10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Free Starter</h3>
                <p className="text-xs text-slate-400">For basic personal document extraction</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">$0</span>
                <span className="text-xs text-slate-500">/ forever</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>5 Documents / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Standard Risk Scoring & Summary</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Server-Side PDF Export</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-white/5 transition-colors"
            >
              Current Plan
            </button>
          </div>

          {/* Pro Tier */}
          <div className="rounded-2xl p-6 bg-gradient-to-b from-cyan-950/40 via-indigo-950/30 to-purple-950/20 border-2 border-cyan-500/40 shadow-xl shadow-cyan-500/10 flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider py-1 px-3 rounded-bl-xl shadow-md">
              Recommended
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Pro Professional</span>
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </h3>
                <p className="text-xs text-cyan-300/80">For legal teams, finance & enterprise analysts</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">$29</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-white">Unlimited Document Processing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                    <Scale className="w-3.5 h-3.5" />
                  </div>
                  <span>Contract Multi-Doc Comparison</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <span>Interactive RAG Document Chat & Citations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <span>Team Workspaces & Member Invites</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <span>Priority Gemini 2.0 Flash Queue</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || upgraded}
              className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-lg shadow-cyan-500/25 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Connecting Stripe Checkout...</span>
                </>
              ) : upgraded ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Plan Activated! (Pro Tier)</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Upgrade with Stripe ($29/mo)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="p-4 bg-slate-950/60 border-t border-white/10 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Secured by Stripe 256-bit SSL Encryption • Cancel or pause anytime</span>
        </div>
      </div>
    </div>
  );
}

