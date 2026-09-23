import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, LogIn, AlertCircle, Loader2, Sparkles, Cpu } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login, loginDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setDemoLoading(true);
    try {
      await loginDemo();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to activate demo login. Please make sure the server is running.');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 relative">
      <div className="w-full max-w-[420px] space-y-5 glass-panel p-6 sm:p-7 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#121A2E]/90 to-[#0A0E1A]/95">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-40 h-20 bg-cyan-500/15 blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-semibold backdrop-blur-md">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>Secure AI Gateway</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white font-display">
            Welcome <span className="text-gradient-ai">Back</span>
          </h2>
          <p className="text-xs text-slate-400">
            Sign in to access document analytics & intelligence queue
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs shadow-sm relative z-10">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 relative z-10">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1 font-mono">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-9 pr-3.5 py-2 glass-input rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1 font-mono">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2 glass-input rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || demoLoading}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#0A0E1A] px-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              Or Try Instantly
            </span>
          </div>

          <button
            type="button"
            disabled={loading || demoLoading}
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center gap-2 transition-all duration-200 shadow-sm shadow-amber-500/10 transform hover:scale-[1.01] disabled:opacity-50"
          >
            {demoLoading ? <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> : <Sparkles className="w-4 h-4 text-amber-400" />}
            <span>{demoLoading ? 'Seeding 6 Docs & Loading...' : '1-Click Instant Demo Login'}</span>
          </button>
        </form>

        {/* Switch to Register */}
        <p className="text-center text-xs text-slate-400 relative z-10 pt-1">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline">
            Create an account
          </Link>
        </p>

        {/* Developer Social Links */}
        <div className="pt-3 border-t border-white/10 flex flex-col items-center gap-2 relative z-10">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-500 tracking-wider">
            Connect With Creator
          </span>
          <div className="flex items-center gap-3">
            {/* GitHub */}
            <a
              href="https://github.com/aadarsh2006ak"
              target="_blank"
              rel="noreferrer"
              title="GitHub Profile (@aadarsh2006ak)"
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 hover:border-white/30 transition-all duration-200 transform hover:scale-110 shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/aadarsh-kumar-"
              target="_blank"
              rel="noreferrer"
              title="LinkedIn Profile"
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-[#0A66C2]/20 text-slate-400 hover:text-[#0A66C2] border border-white/10 hover:border-[#0A66C2]/40 transition-all duration-200 transform hover:scale-110 shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/aadarsh_2006/"
              target="_blank"
              rel="noreferrer"
              title="Instagram Profile"
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-pink-500/20 text-slate-400 hover:text-pink-400 border border-white/10 hover:border-pink-500/40 transition-all duration-200 transform hover:scale-110 shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
