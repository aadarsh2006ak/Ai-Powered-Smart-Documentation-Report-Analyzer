import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import NetworkBackground from './components/NetworkBackground';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ResumeStudioPage from './pages/ResumeStudioPage';
import DashboardPage from './pages/DashboardPage';
import ReportDetailPage from './pages/ReportDetailPage';
import ComparePage from './pages/ComparePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function AppContent() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-[#EDEFF7] flex flex-col selection:bg-amber-500 selection:text-black relative overflow-hidden">
      {/* Full-Page Interactive Particle Network & Flow Curves (AI-Career-Accelerator) */}
      <NetworkBackground />

      {/* Subtle Radial Glow & Fine Coordinate Grid Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-ai-grid opacity-40" />
        <div className="absolute inset-0 bg-radial-glow opacity-80" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pb-20 md:pb-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/resume" element={<ResumeStudioPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/reports/:id" element={<ReportDetailPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Mobile Bottom Navigation Bar (Visible only on < md screens) */}
        <MobileBottomNav />

        <footer className="glass-panel border-t border-white/5 py-5 sm:py-6 text-center text-xs text-slate-400 backdrop-blur-xl px-4 mb-16 md:mb-0">
          <p className="text-[11px] sm:text-xs">
            © 2026 SmartDoc AI • Full-Stack MERN + Gemini AI + BullMQ + Groq Dual Engine
          </p>
        </footer>
      </div>
    </div>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
