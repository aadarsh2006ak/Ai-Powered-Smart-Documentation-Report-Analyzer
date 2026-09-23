import React, { useState } from 'react';
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
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-50 glass-panel border-b border-[#262F4C] px-4 lg:px-8 py-3.5 backdrop-blur-2xl transition-all duration-200 bg-[#0A0E1A]/85">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-teal-400 to-indigo-500 p-[1px] shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#0A0E1A] rounded-2xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white font-display">
                  SmartDoc<span className="text-amber-400">AI</span>
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full pill-accent font-mono">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-[#8D96B3] font-mono tracking-wider hidden sm:block">
                NEURAL DOCUMENT INTELLIGENCE
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2.5">
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
              to="/dashboard"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                isActive('/dashboard')
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20'
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
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20'
                  : 'text-[#8D96B3] hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Scale className="w-4 h-4 text-purple-400" />
              <span>Compare</span>
            </Link>

            {user && (
              <button
                onClick={() => setIsWorkspaceOpen(true)}
                className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#8D96B3] hover:text-white hover:bg-white/5 border border-transparent transition-all duration-150"
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
              <span className="hidden xs:inline">Upgrade</span> Pro
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
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold btn-ignition"
                >
                  <Sparkles className="w-4 h-4 text-[#0A0E1A]" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Modals */}
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
      <WorkspaceModal isOpen={isWorkspaceOpen} onClose={() => setIsWorkspaceOpen(false)} />
    </>
  );
}
