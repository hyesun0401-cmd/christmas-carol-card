"use client";

import { useEffect, useRef } from "react";

type Flake = {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  wobble: number;
};

function preferredFlakeCount() {
  if (typeof window === "undefined") return 80;
  const isMobile = window.matchMedia?.("(max-width: 640px)")?.matches ?? false;
  return isMobile ? 70 : 120;
}

export function SnowfallCanvas({ enabled }: { enabled: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const context = ctx;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const flakes: Flake[] = [];
    const flakeCount = preferredFlakeCount();

    function resize() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function rand(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    function resetFlake(f: Flake, y?: number) {
      f.x = rand(-20, width + 20);
      f.y = y ?? rand(-height, 0);
      f.r = rand(0.8, 2.2);
      f.vy = rand(0.6, 1.6);
      f.vx = rand(-0.25, 0.25);
      f.wobble = rand(0, Math.PI * 2);
    }

    resize();
    for (let i = 0; i < flakeCount; i++) {
      const f: Flake = { x: 0, y: 0, r: 1.2, vy: 1, vx: 0, wobble: 0 };
      resetFlake(f, rand(0, height));
      flakes.push(f);
    }

    let last = performance.now();

    function frame(now: number) {
      const dt = Math.min((now - last) / 16.67, 2);
      last = now;

      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(255,255,255,0.75)";

      for (const f of flakes) {
        f.wobble += 0.02 * dt;
        f.x += (f.vx + Math.sin(f.wobble) * 0.15) * dt;
        f.y += f.vy * dt;

        if (f.y > height + 10) resetFlake(f);
        if (f.x < -30) f.x = width + 30;
        if (f.x > width + 30) f.x = -30;

        context.beginPath();
        context.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        context.fill();
      }

      rafRef.current = window.requestAnimationFrame(frame);
    }

    rafRef.current = window.requestAnimationFrame(frame);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10"
      aria-hidden="true"
    />
  );
}


