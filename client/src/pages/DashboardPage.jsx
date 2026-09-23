import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import {
  FileText,
  AlertTriangle,
  Zap,
  Search,
  Trash2,
  Eye,
  Plus,
  ShieldCheck,
  RefreshCw,
  Cpu,
  Sparkles,
  LogIn,
  Loader2,
  UserCheck,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, loginDemo } = useAuth();
  const [reports, setReports] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoLoading, setDemoLoading] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch user reports
      const reportsRes = await api.get('/reports');
      const loadedReports = reportsRes.data.data || [];
      setReports(loadedReports);

      // Fetch analytics summary
      const analyticsRes = await api.get('/reports/analytics/summary');
      if (analyticsRes.data?.data) {
        setAnalytics(analyticsRes.data.data);
      } else {
        // Compute initial fallback analytics from reports
        const completed = loadedReports.filter((r) => r.status === 'done');
        const highRisk = completed.filter(
          (r) => r.aiInsights?.riskLevel === 'High' || (r.aiInsights?.riskScore || 0) >= 70
        );
        const cached = loadedReports.filter((r) => r.isCachedResult);
        const avgRisk =
          completed.length > 0
            ? Math.round(
                completed.reduce((acc, r) => acc + (r.aiInsights?.riskScore || 0), 0) /
                  completed.length
              )
            : 0;

        setAnalytics({
          totalReports: loadedReports.length,
          completedCount: completed.length,
          highRiskCount: highRisk.length,
          avgRiskScore: avgRisk,
          cachedCount: cached.length,
          tokenSavingsPercent:
            loadedReports.length > 0
              ? Math.round((cached.length / loadedReports.length) * 100)
              : 0,
        });
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err.message);
      if (err.response?.status === 401) {
        setReports([]);
        setAnalytics(null);
      } else {
        setError(err.response?.data?.message || 'Unable to connect to telemetry service.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user || localStorage.getItem('token')) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleDemoAccess = async () => {
    setDemoLoading(true);
    try {
      await loginDemo();
      await fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start demo session.');
    } finally {
      setDemoLoading(false);
    }
  };

  const handleSeedSamples = async () => {
    setSeedLoading(true);
    try {
      const res = await api.post('/reports/seed-samples');
      const seeded = res.data?.data || [];
      setReports(seeded);

      const completed = seeded.filter((r) => r.status === 'done');
      const highRisk = completed.filter(
        (r) => r.aiInsights?.riskLevel === 'High' || (r.aiInsights?.riskScore || 0) >= 70
      );
      const cached = seeded.filter((r) => r.isCachedResult);
      const avgRisk =
        completed.length > 0
          ? Math.round(
              completed.reduce((acc, r) => acc + (r.aiInsights?.riskScore || 0), 0) /
                completed.length
            )
          : 0;

      const categoryBreakdown = seeded.reduce((acc, r) => {
        const cat = r.documentCategory || 'general';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {});

      setAnalytics({
        totalReports: seeded.length,
        completedCount: completed.length,
        highRiskCount: highRisk.length,
        avgRiskScore: avgRisk,
        cachedCount: cached.length,
        tokenSavingsPercent:
          seeded.length > 0 ? Math.round((cached.length / seeded.length) * 100) : 0,
        categoryBreakdown,
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to seed demo documents.');
    } finally {
      setSeedLoading(false);
    }
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;

    // 1. Instantly update reports state locally
    const updatedReports = reports.filter((r) => r._id !== id);
    setReports(updatedReports);

    // 2. Synchronously recalculate all analytics metrics in state with zero page reload
    const completed = updatedReports.filter((r) => r.status === 'done');
    const highRisk = completed.filter(
      (r) => r.aiInsights?.riskLevel === 'High' || (r.aiInsights?.riskScore || 0) >= 70
    );
    const cached = updatedReports.filter((r) => r.isCachedResult);
    const avgRisk =
      completed.length > 0
        ? Math.round(
            completed.reduce((acc, r) => acc + (r.aiInsights?.riskScore || 0), 0) /
              completed.length
          )
        : 0;

    const categoryBreakdown = updatedReports.reduce((acc, r) => {
      const cat = r.documentCategory || 'general';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    setAnalytics({
      totalReports: updatedReports.length,
      completedCount: completed.length,
      highRiskCount: highRisk.length,
      avgRiskScore: avgRisk,
      cachedCount: cached.length,
      tokenSavingsPercent:
        updatedReports.length > 0
          ? Math.round((cached.length / updatedReports.length) * 100)
          : 0,
      categoryBreakdown,
    });

    // 3. Perform asynchronous backend delete and silent telemetry synchronization
    try {
      await api.delete(`/reports/${id}`);
      const analyticsRes = await api.get('/reports/analytics/summary');
      if (analyticsRes.data?.data) {
        setAnalytics(analyticsRes.data.data);
      }
    } catch (err) {
      console.error('Failed to delete report:', err);
      fetchDashboardData();
      alert(err.response?.data?.message || 'Failed to delete report.');
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.originalFile?.fileName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || report.documentCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2 backdrop-blur-md">
            {user ? (
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            )}
            <span>{user ? `Workspace: ${user.name || user.email}` : 'AI Neural Document Mesh'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Document Intelligence <span className="text-gradient-ai">Dashboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time BullMQ background pipeline, risk analytics, and semantic entity extraction.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSeedSamples}
            disabled={seedLoading}
            className="px-3.5 py-2.5 rounded-xl font-bold text-xs text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 flex items-center gap-2 transition-all shadow-sm"
            title="Seed 6 Domain Sample Documents (Legal, Financial, Academic, Resume, Compliance, General)"
          >
            {seedLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-cyan-400" />
            )}
            <span>Seed 6 Demo Docs</span>
          </button>

          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-xl bg-slate-900/60 backdrop-blur-md border border-white/10 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-all shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/upload"
            className="px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all duration-200 transform hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>New Analysis</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Ingested"
          value={analytics?.totalReports || reports.length || 0}
          subtitle="Processed Documents"
          icon={<FileText className="w-5 h-5 text-cyan-400" />}
        />
        <StatCard
          title="High Risk Alerts"
          value={analytics?.highRiskCount || 0}
          subtitle="Audit & Legal Actions"
          icon={<AlertTriangle className="w-5 h-5 text-rose-400" />}
        />
        <StatCard
          title="Avg Risk Score"
          value={`${analytics?.avgRiskScore || 0}/100`}
          subtitle="Across All Reports"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
        />
        <StatCard
          title="Cache Optimization"
          value={`${analytics?.tokenSavingsPercent || 0}%`}
          subtitle="SHA-256 Duplicate Hits"
          icon={<Zap className="w-5 h-5 text-amber-400" />}
          trend="Saved"
        />
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center glass-panel p-4 rounded-2xl border border-white/10 shadow-lg">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 glass-input rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'legal', 'financial', 'academic', 'resume', 'compliance'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm shadow-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Guest Onboarding Banner if not logged in */}
      {!user && (
        <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-amber-500/30 text-center space-y-5 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#121A2E]/90 to-[#0A0E1A]/95">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl sm:text-2xl font-black text-white font-display">
              Access Document Intelligence Dashboard
            </h3>
            <p className="text-xs sm:text-sm text-[#8D96B3]">
              Sign in to view your analyzed documents, risk exposure heatmaps, and BullMQ queue telemetry, or explore instantly with 1-click Demo Access.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleDemoAccess}
              disabled={demoLoading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-black text-xs btn-ignition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {demoLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#0A0E1A]" />
              ) : (
                <Sparkles className="w-4 h-4 text-[#0A0E1A]" />
              )}
              <span>1-Click Instant Demo Login</span>
            </button>
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-[#121A2E] hover:bg-[#1A2440] text-slate-200 hover:text-white border border-[#262F4C] flex items-center justify-center gap-2 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Account</span>
            </Link>
          </div>
        </div>
      )}

      {/* Documents List */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 text-center text-slate-400 space-y-4">
            <div className="relative w-12 h-12 mx-auto">
              <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />
              <RefreshCw className="w-8 h-8 animate-spin text-cyan-400 relative z-10 mx-auto" />
            </div>
            <p className="text-sm font-medium text-slate-300">Synchronizing document neural telemetry...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="p-16 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400 shadow-lg shadow-cyan-500/10">
              <FileText className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-lg font-bold text-white">No documents found</h4>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                {searchQuery || selectedCategory !== 'all'
                  ? 'No documents match your query. Try resetting your search filters.'
                  : 'You have not analyzed any documents yet. Seed all 6 specialized domain demo documents or upload your own to begin.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleSeedSamples}
                disabled={seedLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-[1.02]"
              >
                {seedLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <Sparkles className="w-4 h-4 text-black" />
                )}
                <span>Seed 6 Demo Domain Documents</span>
              </button>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Document</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-slate-950/40 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                  <th className="py-4 px-4 sm:px-6">Document Name</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Risk Level</th>
                  <th className="py-4 px-4">Uploaded</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
                {filteredReports.map((report) => (
                  <tr
                    key={report._id}
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="py-4 px-4 sm:px-6 font-medium text-white">
                      <div className="flex items-center gap-3.5">
                        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/40 transition-all">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                            {report.originalFile?.fileName}
                          </p>
                          <span className="text-[11px] text-slate-400">
                            {((report.originalFile?.sizeBytes || 0) / 1024).toFixed(1)} KB •{' '}
                            {report.originalFile?.fileType?.split('/')[1] || 'doc'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 capitalize text-slate-300">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/10 text-xs font-semibold">
                        {report.documentCategory}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <StatusBadge status={report.status} />
                    </td>

                    <td className="py-4 px-4">
                      {report.aiInsights?.riskScore !== undefined ? (
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-xs ${
                              report.aiInsights.riskLevel === 'High'
                                ? 'text-rose-400'
                                : report.aiInsights.riskLevel === 'Medium'
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {report.aiInsights.riskScore}/100 ({report.aiInsights.riskLevel})
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-slate-400 text-xs">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/reports/${report._id}`}
                          className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all"
                          title="View Live Report & Insights"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteReport(report._id)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
                          title="Delete Report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

