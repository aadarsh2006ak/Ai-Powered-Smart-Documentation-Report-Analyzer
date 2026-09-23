import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Users,
  Plus,
  KeyRound,
  Copy,
  Check,
  X,
  Loader2,
  Building,
  UserCheck,
  Shield,
} from 'lucide-react';

export default function WorkspaceModal({ isOpen, onClose }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('list'); // 'list' | 'create' | 'join'
  const [newWsName, setNewWsName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [copiedCode, setCopiedCode] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (isOpen) {
      fetchWorkspaces();
    }
  }, [isOpen]);

  const fetchWorkspaces = async () => {
    setLoading(true);
    try {
      const res = await api.get('/workspaces/my');
      setWorkspaces(res.data.data || []);
    } catch (err) {
      console.error('Failed to load workspaces:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    setActionLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const res = await api.post('/workspaces', { name: newWsName });
      setWorkspaces((prev) => [res.data.data, ...prev]);
      setNewWsName('');
      setTab('list');
      setStatusMsg({ type: 'success', text: `Workspace "${res.data.data.name}" created!` });
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to create workspace.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinWorkspace = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    setActionLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const res = await api.post('/workspaces/join', { inviteCode });
      setWorkspaces((prev) => [res.data.data, ...prev]);
      setInviteCode('');
      setTab('list');
      setStatusMsg({ type: 'success', text: res.data.message || 'Joined workspace!' });
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to join workspace.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const copyInvite = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl glass-modal rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[620px] border border-white/10">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/25 text-white">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Team & Workspaces</h3>
              <p className="text-xs text-slate-400">Share analyzed documents with colleagues & clients</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Tabs */}
        <div className="flex border-b border-white/10 px-5 pt-3 gap-2 bg-slate-950/20">
          <button
            onClick={() => setTab('list')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
              tab === 'list'
                ? 'text-cyan-400 border-cyan-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            My Workspaces ({workspaces.length})
          </button>
          <button
            onClick={() => setTab('create')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              tab === 'create'
                ? 'text-cyan-400 border-cyan-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New</span>
          </button>
          <button
            onClick={() => setTab('join')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              tab === 'join'
                ? 'text-cyan-400 border-cyan-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Join via Code</span>
          </button>
        </div>

        {/* Status Message */}
        {statusMsg.text && (
          <div
            className={`mx-5 mt-4 p-3 rounded-xl text-xs font-medium ${
              statusMsg.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
            }`}
          >
            {statusMsg.text}
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto">
          {tab === 'list' && (
            <div className="space-y-4">
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                  <span className="text-xs text-slate-400">Loading workspaces...</span>
                </div>
              ) : workspaces.length === 0 ? (
                <div className="py-10 text-center space-y-3">
                  <Building className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">You haven't joined or created any team workspaces yet.</p>
                  <button
                    onClick={() => setTab('create')}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 shadow-md shadow-cyan-500/20 transition-all"
                  >
                    Create Workspace
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {workspaces.map((ws) => (
                    <div
                      key={ws._id}
                      className="p-4 rounded-2xl glass-card border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Building className="w-4 h-4 text-cyan-400" />
                          <h4 className="text-sm font-bold text-white">{ws.name}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400">Code:</span>
                          <button
                            onClick={() => copyInvite(ws.inviteCode)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-bold hover:bg-cyan-500/10 shadow-sm"
                          >
                            <span>{ws.inviteCode}</span>
                            {copiedCode === ws.inviteCode ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3 text-slate-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Members List */}
                      <div className="pt-2 border-t border-white/5 flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                        <span className="font-semibold text-slate-300">
                          {ws.members?.length || 1} Members:
                        </span>
                        {ws.members?.map((m, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-md bg-slate-900/80 border border-white/10 text-[11px] text-slate-300 flex items-center gap-1"
                          >
                            <Shield className="w-2.5 h-2.5 text-cyan-400" />
                            <span>{m.email}</span>
                            <span className="text-slate-500 font-bold uppercase text-[9px]">
                              ({m.role})
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'create' && (
            <form onSubmit={handleCreateWorkspace} className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={newWsName}
                  onChange={(e) => setNewWsName(e.target.value)}
                  placeholder="e.g. Acme Corp Legal Operations"
                  className="w-full glass-input text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-all"
                  required
                />
              </div>
              <p className="text-xs text-slate-400">
                You will be assigned as the Workspace Owner and will receive an instant invite code to invite other team members.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTab('list')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !newWsName.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 shadow-md shadow-cyan-500/20 disabled:opacity-50 transition-all"
                >
                  {actionLoading ? 'Creating...' : 'Create Workspace'}
                </button>
              </div>
            </form>
          )}

          {tab === 'join' && (
            <form onSubmit={handleJoinWorkspace} className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  8-Character Invite Code
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="e.g. 7A8B9C0D"
                  maxLength={10}
                  className="w-full glass-input text-white rounded-xl px-4 py-3 text-sm font-mono tracking-widest uppercase focus:outline-none focus:border-cyan-500 transition-all"
                  required
                />
              </div>
              <p className="text-xs text-slate-400">
                Enter the invite code shared by your organization admin or project manager to gain collaborative access to shared document reports.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTab('list')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !inviteCode.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 shadow-md shadow-cyan-500/20 disabled:opacity-50 transition-all"
                >
                  {actionLoading ? 'Joining...' : 'Join Workspace'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

