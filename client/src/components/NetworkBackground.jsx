import React, { useEffect, useRef } from 'react';

/**
 * NetworkBackground component
 * Creates a full-page ambient particle network + undulating neon flow curves
 * with mouse reactivity, matching the exact visual style of AI-Career-Accelerator.
 */
export default function NetworkBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const PALETTE = ['#e879f9', '#a855f7', '#818cf8', '#38bdf8', '#47e0a6'];
    const LINK_DISTANCE = 135;
    const PARTICLE_DENSITY = 14000;
    const MOUSE_RADIUS = 160;
    const FLOW_COUNT = 4;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animationFrameId;

    let particles = [];
    let flows = [];
    const mouse = { x: null, y: null };

    function hexToRgba(hex, a) {
      const c = hex.replace('#', '');
      const r = parseInt(c.substring(0, 2), 16);
      const g = parseInt(c.substring(2, 4), 16);
      const b = parseInt(c.substring(4, 6), 16);
      return `rgba(${r},${g},${b},${a})`;
    }

    function buildParticles() {
      const count = Math.min(130, Math.floor((width * height) / PARTICLE_DENSITY));
      particles = [];
      for (let i = 0; i < count; i++) {
        const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          baseRadius: Math.random() * 2 + 1.2,
          radius: Math.random() * 2 + 1.2,
          color: color,
          colorRgba: hexToRgba(color, 0.7),
          pulseSpeed: Math.random() * 0.03 + 0.01,
          pulseVal: Math.random() * Math.PI * 2,
        });
      }
    }

    function buildFlows() {
      flows = [];
      for (let i = 0; i < FLOW_COUNT; i++) {
        flows.push({
          yBase: height * (0.2 + 0.2 * i),
          amplitude: 40 + Math.random() * 35,
          wavelength: 0.0015 + Math.random() * 0.0015,
          speed: 0.0008 + Math.random() * 0.0008,
          phase: Math.random() * Math.PI * 2,
          color: PALETTE[i % PALETTE.length],
          lineWidth: 1.5,
        });
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
      buildFlows();
    }

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let time = 0;

    function render() {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Slow-Moving Sinusoidal Flow Curves (Glowing Waves)
      for (let f = 0; f < flows.length; f++) {
        const flow = flows[f];
        ctx.beginPath();
        for (let x = 0; x <= width; x += 12) {
          const y =
            flow.yBase +
            Math.sin(x * flow.wavelength + time * flow.speed + flow.phase) * flow.amplitude +
            Math.cos(x * flow.wavelength * 0.5 + time * flow.speed * 0.7) * (flow.amplitude * 0.4);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = hexToRgba(flow.color, 0.09);
        ctx.lineWidth = flow.lineWidth;
        ctx.stroke();
      }

      // 2. Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Normal Drift
        p.x += p.vx;
        p.y += p.vy;

        // Bounce from Edges
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > height) { p.y = height; p.vy *= -1; }

        // Subtle Pulse
        p.pulseVal += p.pulseSpeed;
        p.radius = p.baseRadius + Math.sin(p.pulseVal) * 0.6;

        // Mouse Proximity Attraction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS) {
            const force = (1 - dist / MOUSE_RADIUS) * 0.8;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
            p.radius = p.baseRadius * 1.6;
          }
        }

        // Draw particle dot with subtle glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.radius), 0, Math.PI * 2);
        ctx.fillStyle = p.colorRgba;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // 3. Draw Connective Proximity Lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < LINK_DISTANCE) {
            const alpha = (1 - dist / LINK_DISTANCE) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = hexToRgba(p1.color, alpha);
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="networkCanvas"
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
