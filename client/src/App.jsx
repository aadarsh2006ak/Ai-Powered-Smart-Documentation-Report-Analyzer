import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
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
        <main className="flex-1">
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
        <footer className="glass-panel border-t border-white/5 py-6 text-center text-xs text-slate-400 backdrop-blur-xl">
          <p>© 2026 SmartDoc AI • Full-Stack MERN + Gemini AI + BullMQ + Groq Engine</p>
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
