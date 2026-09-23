import React, { useEffect, useRef, useState } from 'react';
import { Cpu, Zap, Activity, ShieldCheck } from 'lucide-react';

/**
 * AiEngineVisualizer
 * High-tech interactive AI neural processor with live circuit traces,
 * telemetry badges, and animated data pulses inspired by modern AI consoles.
 */
export default function AiEngineVisualizer() {
  const canvasRef = useRef(null);
  const [activeModelIndex, setActiveModelIndex] = useState(0);

  const models = [
    { name: 'Gemini 2.0 Flash', provider: 'Google AI', speed: '142ms', tokens: '1M Context' },
    { name: 'LLaMA 3.3 70B', provider: 'Groq Cloud', speed: '210ms', tokens: '128K Context' },
    { name: 'GPT-OSS 120B', provider: 'Groq Cloud', speed: '280ms', tokens: '128K Context' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveModelIndex((prev) => (prev + 1) % models.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [models.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 460);
    let height = (canvas.height = 340);
    let animationFrameId;

    const PINS_PER_SIDE = 5;
    let traces = [];
    let pulses = [];

    const cx = width / 2;
    const cy = height / 2;
    const chipW = 110;
    const chipH = 110;

    // Generate PCB circuit traces radiating outward from the central chip
    function initTraces() {
      traces = [];
      const sides = [
        { axis: 'top', fixedY: cy - chipH / 2, dirY: -1 },
        { axis: 'bottom', fixedY: cy + chipH / 2, dirY: 1 },
        { axis: 'left', fixedX: cx - chipW / 2, dirX: -1 },
        { axis: 'right', fixedX: cx + chipW / 2, dirX: 1 },
      ];

      // Top & Bottom traces
      for (let i = 0; i < PINS_PER_SIDE; i++) {
        const frac = (i + 0.5) / PINS_PER_SIDE;
        const startX = cx - chipW / 2 + frac * chipW;

        // Top trace
        traces.push([
          { x: startX, y: cy - chipH / 2 },
          { x: startX, y: cy - chipH / 2 - 30 },
          { x: startX + (i % 2 === 0 ? 35 : -35), y: cy - chipH / 2 - 60 },
          { x: startX + (i % 2 === 0 ? 35 : -35), y: 20 },
        ]);

        // Bottom trace
        traces.push([
          { x: startX, y: cy + chipH / 2 },
          { x: startX, y: cy + chipH / 2 + 30 },
          { x: startX + (i % 2 === 0 ? -35 : 35), y: cy + chipH / 2 + 60 },
          { x: startX + (i % 2 === 0 ? -35 : 35), y: height - 20 },
        ]);
      }

      // Left & Right traces
      for (let i = 0; i < PINS_PER_SIDE; i++) {
        const frac = (i + 0.5) / PINS_PER_SIDE;
        const startY = cy - chipH / 2 + frac * chipH;

        // Left trace
        traces.push([
          { x: cx - chipW / 2, y: startY },
          { x: cx - chipW / 2 - 30, y: startY },
          { x: cx - chipW / 2 - 60, y: startY + (i % 2 === 0 ? 25 : -25) },
          { x: 20, y: startY + (i % 2 === 0 ? 25 : -25) },
        ]);

        // Right trace
        traces.push([
          { x: cx + chipW / 2, y: startY },
          { x: cx + chipW / 2 + 30, y: startY },
          { x: cx + chipW / 2 + 60, y: startY + (i % 2 === 0 ? -25 : 25) },
          { x: width - 20, y: startY + (i % 2 === 0 ? -25 : 25) },
        ]);
      }
    }

    initTraces();

    function render() {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw circuit traces
      ctx.lineWidth = 1.2;
      for (const trace of traces) {
        ctx.beginPath();
        ctx.moveTo(trace[0].x, trace[0].y);
        for (let j = 1; j < trace.length; j++) {
          ctx.lineTo(trace[j].x, trace[j].y);
        }
        ctx.strokeStyle = 'rgba(71, 224, 166, 0.18)';
        ctx.stroke();

        // End node terminal
        const end = trace[trace.length - 1];
        ctx.beginPath();
        ctx.arc(end.x, end.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 176, 32, 0.4)';
        ctx.fill();
      }

      // 2. Spawn and update glowing data packets / pulses
      if (Math.random() < 0.12 && pulses.length < 16) {
        const randomTrace = traces[Math.floor(Math.random() * traces.length)];
        pulses.push({
          trace: randomTrace,
          progress: 0,
          speed: 0.015 + Math.random() * 0.02,
          color: Math.random() > 0.5 ? '#FFB020' : '#47E0A6',
        });
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.progress += p.speed;

        if (p.progress >= 1) {
          pulses.splice(i, 1);
          continue;
        }

        // Calculate current position along the multi-point trace
        const totalSegments = p.trace.length - 1;
        const segmentProgress = p.progress * totalSegments;
        const segIndex = Math.min(Math.floor(segmentProgress), totalSegments - 1);
        const subFrac = segmentProgress - segIndex;

        const p1 = p.trace[segIndex];
        const p2 = p.trace[segIndex + 1];

        const curX = p1.x + (p2.x - p1.x) * subFrac;
        const curY = p1.y + (p2.y - p1.y) * subFrac;

        ctx.beginPath();
        ctx.arc(curX, curY, 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const currentModel = models[activeModelIndex];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 border border-[#262F4C] relative overflow-hidden shadow-2xl bg-gradient-to-b from-[#121A2E]/80 to-[#0A0E1A]/90">
      {/* Visual Header */}
      <div className="flex items-center justify-between border-b border-[#262F4C] pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-display">AI Neural Engine Telemetry</h4>
            <p className="text-[11px] text-[#8D96B3]">Live Dual-Engine Routing • Groq + Gemini</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#47E0A6] shadow-[0_0_8px_#47E0A6] animate-ping" />
          <span className="text-xs font-bold text-[#47E0A6] font-mono">ONLINE</span>
        </div>
      </div>

      {/* Interactive Circuit Canvas Visualizer */}
      <div className="relative w-full h-[260px] flex items-center justify-center my-2">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Central Glowing AI Microprocessor */}
        <div className="relative z-10 w-28 h-28 rounded-2xl bg-gradient-to-tr from-[#1A2440] to-[#212C4D] border-2 border-amber-500/60 shadow-[0_0_35px_rgba(255,176,32,0.25)] flex flex-col items-center justify-center p-3 text-center transition-all duration-300 transform hover:scale-105">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-1">
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-black uppercase text-amber-400 font-mono tracking-widest">
            NEURAL CORE
          </span>
          <span className="text-[11px] font-bold text-white truncate max-w-[90px]">
            {currentModel.name}
          </span>
        </div>
      </div>

      {/* Live Telemetry Row */}
      <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-[#262F4C]">
        <div className="p-2.5 rounded-xl bg-[#0A0E1A]/80 border border-[#262F4C] text-center space-y-1">
          <span className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase text-[#8D96B3] font-mono">
            <Activity className="w-3 h-3 text-amber-400" /> Latency
          </span>
          <span className="text-xs font-black text-amber-400 font-mono block">{currentModel.speed}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#0A0E1A]/80 border border-[#262F4C] text-center space-y-1">
          <span className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase text-[#8D96B3] font-mono">
            <Zap className="w-3 h-3 text-[#47E0A6]" /> Token Cache
          </span>
          <span className="text-xs font-black text-[#47E0A6] font-mono block">94.8% Hit</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#0A0E1A]/80 border border-[#262F4C] text-center space-y-1">
          <span className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase text-[#8D96B3] font-mono">
            <ShieldCheck className="w-3 h-3 text-cyan-400" /> Verification
          </span>
          <span className="text-xs font-black text-cyan-400 font-mono block">Zod Passed</span>
        </div>
      </div>
    </div>
  );
}
