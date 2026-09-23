import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadZone from '../components/UploadZone';
import StatusBadge from '../components/StatusBadge';
import { CheckCircle2, ArrowRight, FileText, Sparkles, Cpu } from 'lucide-react';

export default function UploadPage() {
  const [uploadedJob, setUploadedJob] = useState(null);
  const navigate = useNavigate();

  const handleUploadSuccess = (data) => {
    setUploadedJob(data);
    if (data?.reportId) {
      // Auto-navigate immediately to live real-time analysis report
      navigate(`/reports/${data.reportId}`);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold backdrop-blur-md mb-1">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Multimodal Document Ingestion Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Document Intelligence <span className="text-gradient-ai">Upload Studio</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Upload any PDF or image document to extract text, calculate risk indicators, and generate structured summaries with Gemini & LLaMA AI.
        </p>
      </div>

      {!uploadedJob ? (
        <UploadZone onUploadSuccess={handleUploadSuccess} />
      ) : (
        /* Upload Success & Async Job Status Card */
        <div className="max-w-2xl mx-auto glass-card rounded-3xl p-8 sm:p-10 border border-emerald-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-24 bg-emerald-500/10 blur-2xl pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10 relative z-10">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2 relative z-10">
            <h3 className="text-2xl font-bold text-white">Document Ingested Successfully!</h3>
            <p className="text-sm text-slate-300 flex items-center justify-center gap-1.5 flex-wrap">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>File</span>
              <span className="font-semibold text-cyan-400">{uploadedJob.file?.fileName}</span>
              <span>is now queued for neural chunking and risk calculation.</span>
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 p-4 rounded-2xl glass-card border border-white/10 relative z-10">
            <span className="text-xs font-semibold text-slate-400">Current Pipeline Status:</span>
            <StatusBadge status={uploadedJob.status || 'queued'} />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 relative z-10">
            <button
              onClick={() => navigate(`/reports/${uploadedJob.reportId}`)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all duration-200 transform hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>View Live Analysis Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setUploadedJob(null)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-white/10 transition-colors"
            >
              Upload Another Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

