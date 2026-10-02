import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PricingModal from './PricingModal';
import WorkspaceModal from './WorkspaceModal';
import {
  UploadCloud,
  LayoutDashboard,
  LogIn,
  LogOut,
  User,
  Sparkles,
  Scale,
  Users,
  Zap,
  Menu,
  X,
  Compass,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-50 glass-panel border-b border-[#262F4C] px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 backdrop-blur-2xl transition-all duration-200 bg-[#0A0E1A]/90">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-teal-400 to-indigo-500 p-[1px] shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#0A0E1A] rounded-2xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-white font-display">
                  SmartDoc<span className="text-amber-400">AI</span>
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest px-1.5 sm:px-2 py-0.5 rounded-full pill-accent font-mono">
                  v2.0
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-[#8D96B3] font-mono tracking-wider hidden sm:block">
                NEURAL DOCUMENT INTELLIGENCE
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links (>= md) */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2.5">
            <Link
              to="/upload"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                isActive('/upload')
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20'
                  : 'text-[#8D96B3] hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <UploadCloud className="w-4 h-4 text-amber-400" />
              <span>Studio</span>
            </Link>

            <Link
              to="/resume"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                isActive('/resume')
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                  : 'text-[#8D96B3] hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Resume AI</span>
            </Link>

            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                isActive('/dashboard')
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/20'
                  : 'text-[#8D96B3] hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-400" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/compare"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                isActive('/compare')
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/20'
                  : 'text-[#8D96B3] hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Scale className="w-4 h-4 text-purple-400" />
              <span>Compare</span>
            </Link>

            {user && (
              <button
                onClick={() => setIsWorkspaceOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#8D96B3] hover:text-white hover:bg-white/5 border border-transparent transition-all duration-150"
              >
                <Users className="w-4 h-4 text-[#47E0A6]" />
                <span>Workspaces</span>
              </button>
            )}

            {/* Upgrade Button */}
            <button
              onClick={() => setIsPricingOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold pill-accent transition-all shadow-md hover:scale-105"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Upgrade Pro</span>
            </button>

            {/* User Section */}
            <div className="h-5 w-[1px] bg-[#262F4C] mx-1"></div>

            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121A2E] border border-[#262F4C] text-xs text-slate-300">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold max-w-[110px] truncate text-slate-200">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-150"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#8D96B3] hover:text-white hover:bg-white/5 transition-all duration-150"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold btn-ignition"
                >
                  <Sparkles className="w-4 h-4 text-[#0A0E1A]" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Controls (< md) */}
          <div className="flex md:hidden items-center gap-2">
            {/* Quick Upgrade Badge */}
            <button
              onClick={() => setIsPricingOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold pill-accent"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Pro</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-[#121A2E] border border-[#262F4C] text-slate-200 hover:text-white transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-amber-400" />
              ) : (
                <Menu className="w-5 h-5 text-slate-200" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-Out Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-[#0A0E1A]/95 backdrop-blur-3xl animate-in fade-in slide-in-from-top-4 duration-200">
          {/* Drawer Header */}
          <div className="px-4 py-3.5 border-b border-[#262F4C] flex items-center justify-between bg-[#0A0E1A]">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-lg font-black text-white font-display">
                SmartDoc<span className="text-amber-400">AI</span>
              </span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-[#121A2E] border border-[#262F4C] text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 safe-bottom-padding">
            {/* User status banner if logged in */}
            {user ? (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#121A2E] to-[#1A2440] border border-[#262F4C] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">{user.name}</span>
                    <span className="text-xs text-[#8D96B3] block truncate max-w-[180px]">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 px-4 rounded-xl text-center text-xs font-bold bg-[#121A2E] border border-[#262F4C] text-white flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4 text-amber-400" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 px-4 rounded-xl text-center text-xs font-bold btn-ignition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#0A0E1A]" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}

            {/* Navigation Section */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8D96B3] px-2 block">
                Platform Navigation
              </span>

              <Link
                to="/upload"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isActive('/upload')
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-[#121A2E]/60 border-[#262F4C]/80 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold block">Document Studio</span>
                    <span className="text-[11px] text-[#8D96B3]">Upload & synthesize PDFs</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8D96B3]" />
              </Link>

              <Link
                to="/resume"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isActive('/resume')
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                    : 'bg-[#121A2E]/60 border-[#262F4C]/80 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold block">AI Resume & Career Mentor</span>
                    <span className="text-[11px] text-[#8D96B3]">ATS audit & 30-day roadmap</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8D96B3]" />
              </Link>

              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isActive('/dashboard')
                    ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                    : 'bg-[#121A2E]/60 border-[#262F4C]/80 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <LayoutDashboard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold block">Intelligence Dashboard</span>
                    <span className="text-[11px] text-[#8D96B3]">Telemetry & reports database</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8D96B3]" />
              </Link>

              <Link
                to="/compare"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isActive('/compare')
                    ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                    : 'bg-[#121A2E]/60 border-[#262F4C]/80 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold block">Multi-Doc Comparison</span>
                    <span className="text-[11px] text-[#8D96B3]">Redline clause discrepancy matrix</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8D96B3]" />
              </Link>
            </div>

            {/* Quick Actions / Modals */}
            <div className="space-y-2 pt-2 border-t border-[#262F4C]">
              {user && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsWorkspaceOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#121A2E]/60 border border-[#262F4C]/80 text-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-bold block">Workspaces</span>
                      <span className="text-[11px] text-[#8D96B3]">Manage team collaboration</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8D96B3]" />
                </button>
              )}

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsPricingOpen(true);
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold block text-white">Upgrade to Pro</span>
                    <span className="text-[11px] text-amber-300/80">Unlimited AI RAG reasoning</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
      <WorkspaceModal isOpen={isWorkspaceOpen} onClose={() => setIsWorkspaceOpen(false)} />
    </>
  );
}

