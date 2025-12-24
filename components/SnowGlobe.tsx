"use client";

export function SnowGlobe() {
  return (
    <div className="relative h-28 w-28 overflow-hidden rounded-full border border-white/15 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.22),rgba(255,255,255,0.06)_45%,rgba(0,0,0,0.20)_100%)] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
      {/* glass highlight */}
      <div className="absolute left-3 top-3 h-10 w-6 rounded-full bg-white/10 blur-[1px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_20%,rgba(255,255,255,0.18),transparent_55%)]" />

      {/* snow */}
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className="absolute top-0 h-1.5 w-1.5 rounded-full bg-white/70 motion-safe:animate-[snowDrift_2.8s_linear_infinite]"
          style={{
            left: `${10 + (i * 7) % 80}%`,
            animationDelay: `${(i % 7) * 0.25}s`,
            opacity: 0,
          }}
        />
      ))}

      {/* snow pile */}
      <div className="absolute bottom-0 left-0 right-0 h-9 bg-white/15 blur-[0.5px]" />
      <div className="absolute bottom-0 left-0 right-0 h-7 bg-white/12" />

      {/* base */}
      <div className="absolute -bottom-5 left-1/2 h-10 w-24 -translate-x-1/2 rounded-[999px] bg-gradient-to-b from-white/12 to-black/30 blur-[0.2px]" />
    </div>
  );
}


