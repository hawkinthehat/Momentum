'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { playBilateralFlute } from '@/lib/audio/FluteEngine';

type DustParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  drag: number;
  gravity: number;
};

const DUST_DURATION_MS = 10_000;
const PARTICLE_COUNT = 140;

export default function MomentumTrigger() {
  const controls = useAnimation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const resetTimerRef = useRef<number | null>(null);
  const particlesRef = useRef<DustParticle[]>([]);
  const effectStartRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [dustActive, setDustActive] = useState(false);

  const stopDustLoop = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const startDust = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const host = canvas.parentElement;
    const width = host?.clientWidth ?? 0;
    const height = host?.clientHeight ?? 0;
    if (!width || !height) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const originX = width / 2;
    const originY = height * 0.2;

    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.6 + Math.random() * 2.3;
      return {
        x: originX + (Math.random() - 0.5) * 16,
        y: originY + (Math.random() - 0.5) * 12,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        size: 0.8 + Math.random() * 2.2,
        alpha: 0.28 + Math.random() * 0.52,
        drag: 0.987 + Math.random() * 0.01,
        gravity: 0.012 + Math.random() * 0.02,
      };
    });

    effectStartRef.current = performance.now();
    setDustActive(true);
    stopDustLoop();

    const draw = (now: number) => {
      const elapsed = now - effectStartRef.current;
      const progress = Math.min(elapsed / DUST_DURATION_MS, 1);

      ctx.clearRect(0, 0, width, height);
      const floor = height - 2;

      for (const p of particlesRef.current) {
        const settling = 1 - progress * 0.4;
        p.vx *= p.drag * settling;
        p.vy = p.vy * p.drag + p.gravity * (0.4 + progress * 1.8);

        p.x += p.vx;
        p.y += p.vy;

        if (p.y > floor) {
          p.y = floor;
          p.vy *= -0.22 * (1 - progress);
          p.vx *= 0.9;
        }

        const fade = Math.max(0, 1 - progress);
        const alpha = p.alpha * fade;
        if (alpha <= 0.01) continue;

        ctx.fillStyle = `rgba(180, 238, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        setDustActive(false);
        stopDustLoop();
      }
    };

    rafRef.current = requestAnimationFrame(draw);
  };

  const handleJackpot = async () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext)();
    }

    if (audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }

    // 1. Trigger the kinetic shatter visual.
    await controls.start({
      scale: [1, 1.2, 0],
      rotate: [0, 15, -15, 0],
      opacity: [1, 1, 0],
      transition: { duration: 0.8, ease: 'easeIn' },
    });

    // 2. Dust plume settles over ~10 seconds while flute plays.
    startDust();
    playBilateralFlute(audioCtxRef.current);

    // 3. Reset for next win.
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(() => {
      controls.set({ scale: 1, rotate: 0, opacity: 1 });
    }, 2000);
  };

  useEffect(() => {
    return () => {
      stopDustLoop();
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-8">
      <motion.div
        animate={controls}
        className="relative h-64 w-48 overflow-hidden rounded-t-full border border-white/20 bg-white/10 backdrop-blur-md"
        style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent" />
        <canvas
          ref={canvasRef}
          className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
            dustActive ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden
        />
      </motion.div>

      <button
        onClick={handleJackpot}
        className="rounded-full border border-white/20 bg-white/5 px-8 py-4 font-light tracking-widest text-white transition-all hover:bg-white/10"
      >
        LOG MICRO-WIN
      </button>
    </div>
  );
}
