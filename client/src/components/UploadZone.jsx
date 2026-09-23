import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
  ArrowRight,
  Zap,
  Shield,
  Layers,
  Scale,
  DollarSign,
  GraduationCap,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CATEGORIES = [
  {
    id: 'legal',
    label: 'Legal Contract',
    icon: Scale,
    desc: 'Risks, obligations, termination clauses',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30',
  },
  {
    id: 'financial',
    label: 'Financial / Excel',
    icon: DollarSign,
    desc: 'Balance sheets, metrics, P&L, anomalies',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
  },
  {
    id: 'academic',
    label: 'Research Paper',
    icon: GraduationCap,
    desc: 'Abstract, key findings, conclusions',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/30',
  },
  {
    id: 'resume',
    label: 'Resume / ATS Mentor',
    icon: User,
    desc: 'ATS score, career roadmap & suggestions',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/30',
  },
  {
    id: 'compliance',
    label: 'Compliance & Audit',
    icon: Shield,
    desc: 'Regulatory gaps, checklist verification',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/30',
  },
  {
    id: 'general',
    label: 'General Document',
    icon: Layers,
    desc: 'Summary, key entities, action items',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/30',
  },
];

export default function UploadZone({ onUploadSuccess }) {
  const { user, loginDemo } = useAuth();
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('legal');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    setError(null);
    if (fileRejections.length > 0) {
      setError(fileRejections[0].errors[0]?.message || 'Invalid file format or size exceeded.');
      return;
    }
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
      'text/plain': ['.txt'],
    },
  });

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drag a document first.');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(15);

    try {
      // If user is not authenticated, automatically authenticate with demo account
      if (!user) {
        await loginDemo();
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      setUploadProgress(45);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(Math.min(percent, 90));
        },
      });

      setUploadProgress(100);
      if (onUploadSuccess) {
        onUploadSuccess(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Demo Sign-in notice if guest */}
      {!user && (
        <div className="p-4 rounded-2xl glass-panel border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-lg shadow-cyan-500/10">
          <div className="flex items-center gap-2.5 text-slate-300">
            <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0 animate-pulse" />
            <span>
              Browsing in demo mode. Uploading will automatically activate an instant <strong>Enterprise Analyst Session</strong>.
            </span>
          </div>
          <button
            type="button"
            onClick={loginDemo}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-bold whitespace-nowrap shadow-md shadow-cyan-500/20 transition-all hover:scale-105"
          >
            1-Click Demo Login
          </button>
        </div>
      )}

      {/* Category Persona Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          1. Select Analysis Persona & Template
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.id;
            const IconComponent = cat.icon;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`p-4 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between relative overflow-hidden group ${
                  isSelected
                    ? 'glass-panel border-cyan-500/60 shadow-lg shadow-cyan-500/15 scale-[1.02]'
                    : 'glass-card border-white/5 hover:border-white/15'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-12 h-12 bg-cyan-500/15 rounded-bl-full blur-sm" />
                )}
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${cat.bg}`}>
                    <IconComponent className={`w-4 h-4 ${cat.color}`} />
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-200'} font-display`}>
                    {cat.label}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{cat.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Drag & Drop Area */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          2. Upload Document (PDF, Word DOCX, Image, Plain Text)
        </label>
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 overflow-hidden ${
            isDragActive
              ? 'border-cyan-400 bg-cyan-500/10 scale-[0.99] shadow-2xl shadow-cyan-500/25'
              : file
              ? 'border-emerald-500/50 bg-emerald-500/5 glass-panel'
              : 'border-white/15 hover:border-cyan-500/50 glass-card'
          }`}
        >
          <input {...getInputProps()} />

          {/* Holographic Laser Scan Line during Drag/Upload */}
          {(isDragActive || uploading) && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent blur-[1px] animate-scanner pointer-events-none" />
          )}

          <div className="flex flex-col items-center justify-center relative z-10">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 ${
                file
                  ? 'bg-emerald-500/20 text-emerald-400 scale-110 shadow-lg shadow-emerald-500/20'
                  : 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 shadow-lg shadow-cyan-500/15'
              }`}
            >
              {file ? <FileText className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
            </div>

            {file ? (
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">{file.name}</h4>
                <p className="text-xs text-slate-400">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI Extraction & Reasoning
                </p>
                <span className="inline-block mt-3 text-xs text-cyan-400 underline hover:text-cyan-300">
                  Click or drag another file to replace
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-bold text-white">
                  Drag & drop your document here, or <span className="text-cyan-400 underline">browse</span>
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Supports PDF contracts, Word reports, scanned receipts (OCR), and resumes up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Progress Bar */}
      {uploading && (
        <div className="space-y-2 p-4 rounded-2xl glass-panel border border-cyan-500/30">
          <div className="flex justify-between text-xs text-slate-300 font-semibold">
            <span className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              Streaming to Cloudinary & queuing BullMQ worker...
            </span>
            <span className="text-cyan-400">{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-[1px] border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 rounded-full transition-all duration-300 shadow-sm shadow-cyan-400"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleUploadSubmit}
        disabled={!file || uploading}
        className={`w-full py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all duration-200 ${
          !file || uploading
            ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
            : 'bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-300 hover:from-cyan-300 hover:to-indigo-200 text-black shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5'
        }`}
      >
        {uploading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-black" />
            <span>Processing Document & Queuing AI Job...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-black" />
            <span>Analyze Document with Gemini / Groq AI</span>
            <ArrowRight className="w-4 h-4 ml-1 text-black" />
          </>
        )}
      </button>
    </div>
  );
}
