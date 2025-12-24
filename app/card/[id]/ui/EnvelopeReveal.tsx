"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { SnowfallCanvas } from "@/components/SnowfallCanvas";

type CardApi = {
  id: string;
  message: string;
  genre: "POP" | "JAZZ" | "KPOP";
  createdAt: string;
  viewCount: number;
  song: {
    id: number;
    title: string;
    artist: string;
    floUrl: string;
    genre: "POP" | "JAZZ" | "KPOP";
  };
};

export function EnvelopeReveal({ cardId }: { cardId: string }) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CardApi | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cta = useMemo(() => {
    if (error) return "Tap to try again";
    if (loading) return "Opening…";
    if (opened) return "Opened";
    return "Tap to open";
  }, [error, loading, opened]);

  async function open() {
    if (loading) return;
    setOpened(true);
    if (data) return;

    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/cards/${encodeURIComponent(cardId)}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error ?? "Failed to load this card.");
        return;
      }
      setData(json);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // If reduced motion is enabled, we still allow click-to-reveal but avoid “auto” effects later.
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const onChange = () => setReducedMotion(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return (
    <section className="space-y-6">
      <SnowfallCanvas enabled={opened && !reducedMotion} />

      <div className="relative z-20 mx-auto w-full max-w-xl">
        <button
          type="button"
          onClick={open}
          className="group relative mx-auto block w-full select-none"
          aria-label="Open envelope"
        >
          <div className="relative mx-auto h-56 w-full max-w-[26rem]">
            {/* Back */}
            <div className="absolute inset-0 rounded-2xl bg-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.45)]" />

            {/* Paper (slides up) */}
            <div
              className={[
                "absolute left-1/2 top-6 h-[160px] w-[86%] -translate-x-1/2 overflow-hidden rounded-2xl border border-black/10 bg-[#fff9f3] p-4 text-left shadow-[0_18px_50px_rgba(0,0,0,0.25)] transition-all duration-700 sm:h-[190px]",
                opened ? "-translate-y-16 opacity-100" : "translate-y-6 opacity-0",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-[11px] tracking-widest text-black/45">MERRY CHRISTMAS</div>
                <div className="text-[11px] text-black/35">for you</div>
              </div>

              {opened && loading ? (
                <div className="mt-3 space-y-2">
                  <div className="h-2 w-4/5 rounded bg-black/10" />
                  <div className="h-2 w-3/5 rounded bg-black/10" />
                  <div className="h-2 w-2/3 rounded bg-black/10" />
                </div>
              ) : opened && data ? (
                <div className="mt-3 whitespace-pre-wrap text-[15px] font-semibold leading-relaxed text-[#2b1b1c]">
                  {data.message}
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  <div className="h-2 w-4/5 rounded bg-black/10" />
                  <div className="h-2 w-3/5 rounded bg-black/10" />
                  <div className="h-2 w-2/3 rounded bg-black/10" />
                </div>
              )}
            </div>

            {/* Front body */}
            <div
              className={[
                "absolute inset-0 overflow-hidden rounded-2xl border border-white/15 bg-white/10",
                !opened ? "motion-safe:animate-[envelopeWiggle_2.8s_ease-in-out_infinite]" : "",
              ].join(" ")}
              style={{
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
                perspective: "900px",
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(255,255,255,0.22),transparent_55%)]" />

              {/* Diagonal folds */}
              <div
                className="absolute inset-0"
                style={{
                  clipPath: "polygon(0 0, 50% 55%, 0 100%)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  clipPath: "polygon(100% 0, 50% 55%, 100% 100%)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))",
                }}
              />

              {/* Bottom fold */}
              <div
                className="absolute inset-0"
                style={{
                  clipPath: "polygon(0 100%, 50% 55%, 100% 100%)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.12))",
                }}
              />
            </div>

            {/* Top flap (opens) */}
            <div
              className={[
                "absolute inset-0 origin-top transition-transform duration-700",
                opened ? "rotate-x-180" : "rotate-x-0",
              ].join(" ")}
              style={{
                transformStyle: "preserve-3d",
                transform: opened ? "rotateX(180deg)" : "rotateX(0deg)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  clipPath: "polygon(0 0, 50% 55%, 100% 0)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))",
                }}
              />
            </div>

            {/* CTA badge */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div
                className={[
                  "rounded-full border px-4 py-2 text-xs font-semibold tracking-wide backdrop-blur",
                  opened
                    ? "border-white/20 bg-white/10 text-white/90"
                    : "border-white/25 bg-white/15 text-white group-hover:bg-white/20",
                ].join(" ")}
              >
                {cta}
              </div>
            </div>
          </div>
        </button>
      </div>

      {opened ? (
        <div className="relative z-20 mx-auto w-full max-w-xl space-y-4">
          {loading ? (
            <div className="rounded-[28px] bg-white p-6 text-sm text-[#2b1b1c] shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
              Unfolding the card…
            </div>
          ) : error ? (
            <div className="rounded-[28px] bg-white p-6 text-sm text-[#2b1b1c] shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
              {error}
            </div>
          ) : data ? (
            <div className="space-y-4">
              <div className="rounded-[28px] bg-white p-6 text-[#2b1b1c] shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <LpDisc
                      reducedMotion={reducedMotion}
                      title={data.song.title}
                      artist={data.song.artist}
                      seed={data.song.id}
                    />
                    <div className="min-w-0 space-y-1">
                      <div className="text-xs text-black/50">Today’s carol</div>
                      <div className="truncate text-lg font-semibold leading-snug">
                        {data.song.title}
                      </div>
                      <div className="truncate text-sm text-black/60">{data.song.artist}</div>
                    </div>
                  </div>

                  <a
                    href={data.song.floUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 rounded-2xl bg-[#7c0f14] px-4 py-3 text-sm font-semibold text-white hover:bg-[#6e0d11]"
                  >
                    Listen on FLO
                  </a>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function svgCoverDataUrl({
  title,
  artist,
  seed,
}: {
  title: string;
  artist: string;
  seed: number;
}) {
  // deterministic palette by seed
  const palettes = [
    ["#064E3B", "#D4AF37", "#FDFBF7"],
    ["#7c0f14", "#FDFBF7", "#2b1b1c"],
    ["#0f172a", "#38bdf8", "#f8fafc"],
    ["#1f2937", "#fb7185", "#f8fafc"],
    ["#0b3a4a", "#a3e635", "#f8fafc"],
  ];
  const p = palettes[Math.abs(seed) % palettes.length];
  const safeTitle = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeArtist = artist.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p[0]}"/>
      <stop offset="1" stop-color="${p[1]}"/>
    </linearGradient>
    <radialGradient id="shine" cx="30%" cy="20%" r="75%">
      <stop offset="0" stop-color="rgba(255,255,255,0.30)"/>
      <stop offset="1" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>
  <rect x="0" y="0" width="300" height="300" rx="22" fill="url(#g)"/>
  <rect x="0" y="0" width="300" height="300" rx="22" fill="url(#shine)"/>
  <circle cx="236" cy="70" r="10" fill="${p[2]}" opacity="0.35"/>
  <circle cx="64" cy="230" r="12" fill="${p[2]}" opacity="0.22"/>
  <text x="26" y="190" fill="${p[2]}" opacity="0.92" font-size="22" font-family="Georgia, 'Times New Roman', serif" font-style="italic">
    ${safeTitle.slice(0, 18)}
  </text>
  <text x="26" y="220" fill="${p[2]}" opacity="0.78" font-size="16" font-family="Georgia, 'Times New Roman', serif">
    ${safeArtist.slice(0, 22)}
  </text>
  <text x="26" y="265" fill="${p[2]}" opacity="0.45" font-size="12" font-family="Arial, Helvetica, sans-serif" letter-spacing="3">
    CAROL CARD
  </text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function LpDisc({
  reducedMotion,
  title,
  artist,
  seed,
}: {
  reducedMotion: boolean;
  title: string;
  artist: string;
  seed: number;
}) {
  const cover = useMemo(() => svgCoverDataUrl({ title, artist, seed }), [title, artist, seed]);

  return (
    <div
      className={[
        "relative h-[92px] w-[92px] shrink-0 rounded-full",
        reducedMotion ? "" : "motion-safe:animate-[lpSpin_7.5s_linear_infinite]",
      ].join(" ")}
      style={{
        background:
          "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 42%), repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0 1px, rgba(0,0,0,0) 2px 6px), radial-gradient(circle at 50% 50%, #111 0%, #0b0b0b 65%, #000 100%)",
        boxShadow: "0 18px 45px rgba(0,0,0,0.35), inset 0 2px 8px rgba(255,255,255,0.08)",
      }}
      aria-hidden="true"
    >
      {/* center label (album cover) */}
      <div className="absolute left-1/2 top-1/2 h-[42px] w-[42px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-white/20 bg-white shadow-inner">
        <Image
          src={cover}
          alt=""
          fill
          sizes="42px"
          unoptimized
          className="object-cover"
        />
      </div>
      {/* hole */}
      <div className="absolute left-1/2 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/60 shadow-[0_0_0_2px_rgba(255,255,255,0.12)]" />
      {/* gloss */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 28% 22%, rgba(255,255,255,0.16), transparent 42%)",
        }}
      />
    </div>
  );
}


