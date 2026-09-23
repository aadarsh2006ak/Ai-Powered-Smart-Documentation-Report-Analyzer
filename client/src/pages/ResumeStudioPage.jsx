import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import {
  Sparkles,
  Compass,
  FileText,
  UploadCloud,
  AlertCircle,
  Loader2,
  ArrowRight,
  Target,
  Award,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ResumeStudioPage() {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    setError(null);
    if (fileRejections.length > 0) {
      setError(fileRejections[0].errors[0]?.message || 'Invalid resume format or size exceeded.');
      return;
    }
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
    },
  });

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drag your resume first.');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(15);

    try {
      if (!user) {
        await loginDemo();
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'resume');

      setUploadProgress(45);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(Math.min(percent, 90));
        },
      });

      setUploadProgress(100);
      const reportId = res.data.reportId || res.data.data?.report?._id || res.data.data?._id || res.data._id;
      if (reportId) {
        navigate(`/reports/${reportId}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload and analyze resume.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12 relative z-10">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full pill-accent text-xs font-mono font-bold tracking-wider uppercase backdrop-blur-xl">
          <Compass className="w-3.5 h-3.5 animate-pulse" />
          <span>AI ATS & CAREER MENTOR STUDIO</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display">
          Accelerate Your Career with <span className="text-gradient-ai">AI Mentorship</span>
        </h1>

        <p className="text-sm sm:text-base text-[#8D96B3] max-w-2xl mx-auto leading-relaxed">
          Upload your resume to get an instant <strong>ATS Optimization Audit</strong>, 
          personalized career path recommendations, 30-60-90 day growth roadmap, 
          high-impact project suggestions, and Google XYZ bullet rewrites.
        </p>
      </div>

      {/* 4-Pillar Feature Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl glass-card border border-[#262F4C] space-y-1 text-center">
          <span className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto mb-2">
            <Award className="w-4 h-4" />
          </span>
          <h4 className="text-xs font-bold text-white font-display">ATS Score Breakdown</h4>
          <p className="text-[11px] text-[#8D96B3]">Formatting, Keywords & Metrics</p>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-[#262F4C] space-y-1 text-center">
          <span className="w-8 h-8 rounded-xl bg-[#47E0A6]/15 text-[#47E0A6] flex items-center justify-center mx-auto mb-2">
            <Target className="w-4 h-4" />
          </span>
          <h4 className="text-xs font-bold text-white font-display">Target Job Roles</h4>
          <p className="text-[11px] text-[#8D96B3]">Match % & Salary Benchmarks</p>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-[#262F4C] space-y-1 text-center">
          <span className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-4 h-4" />
          </span>
          <h4 className="text-xs font-bold text-white font-display">30-60-90 Roadmap</h4>
          <p className="text-[11px] text-[#8D96B3]">Actionable Career Milestones</p>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-[#262F4C] space-y-1 text-center">
          <span className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-4 h-4" />
          </span>
          <h4 className="text-xs font-bold text-white font-display">XYZ Formula Fixes</h4>
          <p className="text-[11px] text-[#8D96B3]">High-Impact Bullet Rewrites</p>
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-[#262F4C] space-y-6 bg-gradient-to-b from-[#121A2E]/90 to-[#0A0E1A]/95 shadow-2xl">
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-300 overflow-hidden ${
            isDragActive
              ? 'border-amber-400 bg-amber-500/10 scale-[0.99] shadow-2xl shadow-amber-500/25'
              : file
              ? 'border-[#47E0A6]/50 bg-[#47E0A6]/5'
              : 'border-[#262F4C] hover:border-amber-500/50 bg-[#0A0E1A]/60'
          }`}
        >
          <input {...getInputProps()} />

          {(isDragActive || uploading) && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent blur-[1px] animate-scanner pointer-events-none" />
          )}

          <div className="flex flex-col items-center justify-center relative z-10">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 ${
                file
                  ? 'bg-[#47E0A6]/20 text-[#47E0A6] scale-110 shadow-lg shadow-[#47E0A6]/20'
                  : 'bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-lg shadow-amber-500/15'
              }`}
            >
              {file ? <FileText className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
            </div>

            {file ? (
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">{file.name}</h4>
                <p className="text-xs text-[#8D96B3]">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI ATS & Career Mentorship Audit
                </p>
                <span className="inline-block mt-3 text-xs text-amber-400 underline hover:text-amber-300">
                  Click or drag another resume to replace
                </span>
              </div>
            ) : (
              <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-bold text-white font-display">
                  Drag & drop your Resume PDF here, or <span className="text-amber-400 underline">browse</span>
                </h4>
                <p className="text-xs text-[#8D96B3] max-w-md mx-auto">
                  Supports PDF, Word DOCX, and Text resumes up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2 p-4 rounded-2xl bg-[#0A0E1A] border border-amber-500/30">
            <div className="flex justify-between text-xs text-slate-300 font-semibold font-mono">
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                Auditing ATS Compatibility & Generating Career Mentorship...
              </span>
              <span className="text-amber-400">{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-[1px] border border-[#262F4C]">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-[#47E0A6] rounded-full transition-all duration-300 shadow-sm shadow-amber-400"
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
          className={`w-full py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all duration-200 font-display ${
            !file || uploading
              ? 'bg-[#121A2E] text-slate-500 cursor-not-allowed border border-[#262F4C]'
              : 'btn-ignition cursor-pointer'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-[#0A0E1A]" />
              <span>Analyzing with AI Career Mentor & ATS Engine...</span>
            </>
          ) : (
            <>
              <Compass className="w-5 h-5 text-[#0A0E1A]" />
              <span>Analyze Resume with AI Mentor & ATS Auditor</span>
              <ArrowRight className="w-4 h-4 ml-1 text-[#0A0E1A]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
