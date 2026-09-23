import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import {
  Send,
  Sparkles,
  X,
  Bot,
  User,
  Quote,
  Loader2,
  ShieldCheck,
  ChevronRight,
  Cpu,
} from 'lucide-react';

export default function DocumentChatModal({ isOpen, onClose, report }) {
  const category = report?.documentCategory || 'general';

  // Category-specific dynamic starter prompts
  const getCategoryQuestions = (cat) => {
    switch (cat) {
      case 'legal':
        return [
          'What is the termination notice period?',
          'What are the liability caps & indemnity terms?',
          'Which state/jurisdiction governs this agreement?',
        ];
      case 'financial':
        return [
          'What is the Revenue, Gross Margin & EBITDA?',
          'Are there any anomalies or expense spikes?',
          'What is the estimated cash runway in months?',
        ];
      case 'academic':
        return [
          'What is the central hypothesis & objective?',
          'What dataset and sample size N were utilized?',
          'What are the key findings and statistical p-values?',
        ];
      case 'compliance':
        return [
          'What is the overall compliance readiness score?',
          'What are the critical gaps identified for GDPR / SOC 2?',
          'What audit evidence items require verification?',
        ];
      case 'resume':
        return [
          'What is my overall ATS compatibility score?',
          'What are my candidate strengths & weaknesses?',
          'What is the recommended 30-day growth roadmap?',
        ];
      default:
        return [
          'What is the executive summary of this document?',
          'What are the key action items and deadlines?',
          'What risks or obligations are highlighted?',
        ];
    }
  };

  const suggestedQuestions = getCategoryQuestions(category);

  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize greeting on open or report change
  useEffect(() => {
    if (report) {
      setMessages([
        {
          role: 'assistant',
          content: `Hello! I have indexed **${report?.originalFile?.fileName || 'your document'}** with semantic passage chunking for **${category.toUpperCase()}** intelligence. Ask me any question regarding specific terms, numbers, risks, or clauses.`,
          citations: [],
          confidence: 'High',
        },
      ]);
    }
  }, [report, category]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  if (!isOpen || !report) return null;

  const handleSendMessage = async (textToSend) => {
    const question = textToSend || query;
    if (!question || !question.trim() || loading) return;

    const userMsg = { role: 'user', content: question.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await api.post(`/reports/${report._id}/chat`, {
        query: question.trim(),
        history: messages.map((m) => ({ role: m.role, content: m.content })),
      });

      const responsePayload = res.data?.data || res.data;
      const answerText =
        responsePayload?.answer ||
        responsePayload?.data?.answer ||
        responsePayload?.reply ||
        (typeof responsePayload === 'string'
          ? responsePayload
          : 'According to the document records, the requested section was analyzed.');

      const citationsList =
        responsePayload?.citations || responsePayload?.data?.citations || [];
      const confidenceVal =
        responsePayload?.confidence || responsePayload?.data?.confidence || 'High';

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: answerText,
          citations: Array.isArray(citationsList) ? citationsList : [],
          confidence: confidenceVal,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Sorry, I encountered an issue retrieving that section from the document. Please try asking again.',
          citations: [],
          confidence: 'Low',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render simple markdown cleanly (bold, lists)
  const renderFormattedContent = (content) => {
    if (!content) return null;
    const lines = content.split('\n');

    return lines.map((line, lIdx) => {
      // Process bold formatting **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="text-white font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <div key={lIdx} className="flex items-start gap-2 ml-1 my-1">
            <span className="text-cyan-400 mt-1">•</span>
            <span className="flex-1">{formattedLine}</span>
          </div>
        );
      }

      return (
        <p key={lIdx} className={line.trim() === '' ? 'h-2' : 'my-1'}>
          {formattedLine}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg sm:max-w-xl glass-modal rounded-2xl shadow-2xl flex flex-col h-[500px] sm:h-[530px] max-h-[88vh] overflow-hidden relative border border-white/15">
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/25 text-white flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Neural Document Chat</h3>
                <span className="text-[9px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 shadow-sm flex items-center gap-1">
                  <Cpu className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                  RAG Cosine Index
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[260px] sm:max-w-[320px]">
                {report.originalFile?.fileName || 'Indexed File'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[88%] rounded-xl p-3 text-xs sm:text-[13px] leading-relaxed space-y-2 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white shadow-md shadow-cyan-500/20 rounded-br-none'
                    : 'glass-card border border-white/10 text-slate-200 rounded-bl-none shadow-lg bg-slate-900/80'
                }`}
              >
                <div className="text-xs sm:text-[13px] leading-relaxed">
                  {renderFormattedContent(msg.content)}
                </div>

                {/* Citations / Source Passages */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-1.5 border-t border-white/10 space-y-1.5">
                    <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-1">
                      <Quote className="w-3 h-3" /> Cited Document Passages
                    </span>
                    <div className="space-y-1">
                      {msg.citations.map((c, ci) => (
                        <div
                          key={ci}
                          className="p-2 rounded-lg bg-slate-950/80 border border-cyan-500/20 text-[10px] text-slate-300 font-mono italic shadow-inner"
                        >
                          "{c.exactQuote}"
                          {c.relevance && (
                            <div className="text-[9px] text-cyan-300/80 not-italic font-sans mt-0.5">
                              ↳ {c.relevance}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {msg.role === 'assistant' && msg.confidence && (
                  <div className="flex items-center justify-between pt-0.5 text-[9px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <ShieldCheck className="w-2.5 h-2.5" /> Confidence: {msg.confidence}
                    </span>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center flex-shrink-0">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="p-3 rounded-xl glass-card border border-cyan-500/20 text-xs text-cyan-300 flex items-center gap-2">
                <span>Scanning document passages & generating citations...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        {messages.length <= 2 && (
          <div className="px-3.5 pb-2 flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                className="text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-900/90 text-cyan-300 hover:text-white hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/30 transition-all flex items-center gap-1 shadow-sm"
              >
                <span>{q}</span>
                <ChevronRight className="w-2.5 h-2.5 text-cyan-400" />
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-2.5 sm:p-3 border-t border-white/10 bg-slate-950/80 flex items-center gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about clauses, risks, or numbers..."
            disabled={loading}
            className="flex-1 glass-input rounded-xl px-3.5 py-2 text-xs sm:text-[13px] text-white focus:outline-none focus:border-cyan-500 transition-all placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20 transition-all transform hover:scale-105 flex-shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

