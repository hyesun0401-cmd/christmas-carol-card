"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Genre = "POP" | "JAZZ" | "KPOP";

const GENRES: Array<{ id: Genre; label: string; hint: string }> = [
  { id: "POP", label: "Pop", hint: "Bright & classic" },
  { id: "JAZZ", label: "Jazz", hint: "Warm & cozy" },
  { id: "KPOP", label: "K-pop", hint: "Sparkly & fun" },
];

export function CreateCardForm({ variant = "red" }: { variant?: "red" | "green" }) {
  const [message, setMessage] = useState("");
  const [genre, setGenre] = useState<Genre>("KPOP");
  const [kpopArtists, setKpopArtists] = useState<
    Array<{ slug: string; name: string; songCount: number; imageUrl: string }>
  >([]);
  const [kpopArtistSlug, setKpopArtistSlug] = useState<string>("");
  const [artistOpen, setArtistOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardId, setCardId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const artistMenuRef = useRef<HTMLDivElement | null>(null);

  const isGreen = variant === "green";
  const accent = isGreen ? "#064E3B" : "#7c0f14";
  const accentHover = isGreen ? "#022c22" : "#6e0d11";
  const paper = isGreen ? "#FDFBF7" : "#fff9f3";
  const ink = isGreen ? "#022c22" : "#2b1b1c";

  const shareUrl = useMemo(() => {
    if (!cardId) return null;
    if (typeof window === "undefined") return null;
    return `${window.location.origin}/card/${cardId}`;
  }, [cardId]);

  const selectedArtist = useMemo(() => {
    if (!kpopArtistSlug) return null;
    return kpopArtists.find((a) => a.slug === kpopArtistSlug) ?? null;
  }, [kpopArtistSlug, kpopArtists]);

  async function loadKpopArtists() {
    const res = await fetch("/api/kpop/artists");
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.error ?? "Failed to load artists");
    setKpopArtists(Array.isArray(json?.items) ? json.items : []);
  }

  useEffect(() => {
    if (genre !== "KPOP") return;
    if (kpopArtists.length > 0) return;
    loadKpopArtists().catch(() => {
      setError("Failed to load K‑pop artists. Please try again.");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genre]);

  useEffect(() => {
    if (!artistOpen) return;
    function onDown(e: MouseEvent) {
      const t = e.target as Node | null;
      if (artistOpen && artistMenuRef.current && t && !artistMenuRef.current.contains(t)) {
        setArtistOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [artistOpen]);

  async function onSubmit() {
    setError(null);
    setCopied(false);

    const trimmed = message.trim();
    if (!trimmed) {
      setError("Please write a short message.");
      return;
    }
    if (trimmed.length > 200) {
      setError("Message is too long (max 200 characters).");
      return;
    }

    if (genre === "KPOP") {
      if (!kpopArtistSlug) {
        setError("Please pick a K‑pop artist.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          genre,
          ...(genre === "KPOP" ? { kpopArtistSlug } : {}),
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error ?? "Failed to create card.");
        return;
      }

      setCardId(json.cardId);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyLink() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Fallback for insecure contexts (e.g. http on LAN IP) where Clipboard API is blocked.
      try {
        const ta = document.createElement("textarea");
        ta.value = shareUrl;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "-1000px";
        ta.style.left = "-1000px";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, ta.value.length);
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        if (ok) {
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } else {
          setError("Copy failed. Please long-press and copy the link manually.");
        }
      } catch {
        setError("Copy failed. Please copy the link manually.");
      }
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold" style={{ color: ink }}>
          메시지
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="짧고 따뜻하게 한마디 적어주세요…"
          rows={4}
          className="w-full resize-none rounded-2xl border border-black/10 px-4 py-3 text-sm placeholder:text-black/35 outline-none ring-0 focus:border-black/20"
          style={{
            backgroundColor: paper,
            color: ink,
            backgroundImage:
              "radial-gradient(circle at 15% 15%, rgba(6,78,59,0.05), transparent 35%), radial-gradient(circle at 85% 80%, rgba(212,175,55,0.06), transparent 45%)",
          }}
          maxLength={220}
        />
        <div className="flex items-center justify-between text-xs text-black/50">
          <span>200자 이내로 써주세요</span>
          <span>{message.trim().length}/200</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-semibold" style={{ color: ink }}>
          장르 선택
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {GENRES.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={async () => {
                setGenre(g.id);
                // reset selections when switching genres
                setKpopArtistSlug("");
                if (g.id === "KPOP" && kpopArtists.length === 0) {
                  try {
                    await loadKpopArtists();
                  } catch {
                    setError("Failed to load K‑pop artists. Please try again.");
                  }
                }
              }}
              className={[
                "rounded-2xl border px-4 py-3 text-left transition",
                genre === g.id
                  ? "border-black/20"
                  : "border-black/10 bg-white hover:border-black/20",
              ].join(" ")}
              style={
                genre === g.id
                  ? { backgroundColor: isGreen ? "rgba(212,175,55,0.14)" : "rgba(124,15,20,0.10)" }
                  : { backgroundColor: "white" }
              }
            >
              <div className="text-sm font-semibold">{g.label}</div>
              <div className="text-xs text-black/55">{g.hint}</div>
            </button>
          ))}
        </div>
      </div>

      {genre === "KPOP" ? (
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="text-sm font-semibold" style={{ color: ink }}>
              아티스트 선택
            </div>
            <div className="relative" ref={artistMenuRef}>
              <button
                type="button"
                onClick={() => setArtistOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
                style={{ color: ink }}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-black/10 bg-black/5">
                    {selectedArtist ? (
                      // Use <img> because native <select> can't render images; this is our custom dropdown.
                      <img
                        src={selectedArtist.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 truncate text-left">
                    {selectedArtist ? selectedArtist.name : "아티스트를 선택하세요…"}
                  </div>
                </div>
                <div className="text-xs text-black/45">{artistOpen ? "▲" : "▼"}</div>
              </button>

              {artistOpen ? (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
                  <div className="max-h-72 overflow-auto p-1">
                    {kpopArtists.length === 0 ? (
                      <div className="px-3 py-3 text-sm text-black/50">Loading…</div>
                    ) : (
                      kpopArtists.map((a) => {
                        const active = a.slug === kpopArtistSlug;
                        return (
                          <button
                            key={a.slug}
                            type="button"
                            onClick={async () => {
                              setArtistOpen(false);
                              setKpopArtistSlug(a.slug);
                            }}
                            className={[
                              "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition",
                              active ? "bg-black/5" : "hover:bg-black/5",
                            ].join(" ")}
                          >
                            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-black/10 bg-black/5">
                              <img src={a.imageUrl} alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-semibold">{a.name}</div>
                            </div>
                            {active ? <div className="text-xs text-black/40">Selected</div> : null}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="text-xs text-black/50">
              이 아티스트의 캐롤 중 한 곡을 랜덤으로 골라 카드에 담아요.
            </div>
          </div>
        </div>
      ) : null}

      {error ? (
        <div
          className="rounded-2xl border px-4 py-3 text-sm"
          style={{
            borderColor: isGreen ? "rgba(212,175,55,0.35)" : "rgba(124,15,20,0.25)",
            backgroundColor: isGreen ? "rgba(212,175,55,0.12)" : "rgba(124,15,20,0.10)",
            color: ink,
          }}
        >
          {error}
        </div>
      ) : null}

      {cardId ? (
        <div className="space-y-3 rounded-2xl border border-black/10 p-4" style={{ backgroundColor: paper }}>
          <div className="text-sm font-semibold" style={{ color: ink }}>
            Your card is ready
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-3 py-2 font-mono text-xs text-black/70">
              {shareUrl ?? `/card/${cardId}`}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={copyLink}
                className="rounded-xl px-3 py-2 text-xs font-semibold text-white"
                style={{ backgroundColor: accent }}
              >
                {copied ? "Copied" : "Copy link"}
              </button>
              <a
                href={`/card/${cardId}`}
                className="rounded-xl border border-black/15 bg-white px-3 py-2 text-xs font-semibold text-[#2b1b1c] hover:bg-[#fff9f3]"
                style={{ color: ink, backgroundColor: "white" }}
              >
                Preview
              </a>
            </div>
          </div>
          <div className="text-xs text-black/55">Send this link to your friend.</div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className={[
            "w-full rounded-2xl px-4 py-3 text-sm font-semibold transition",
            isSubmitting
              ? "cursor-not-allowed bg-black/10 text-black/40"
              : "text-white",
          ].join(" ")}
          style={
            isSubmitting
              ? undefined
              : {
                  background: `linear-gradient(135deg, ${accent} 0%, ${accentHover} 100%)`,
                  boxShadow: isGreen
                    ? "0 18px 50px rgba(2,44,34,0.35)"
                    : "0 18px 50px rgba(124,15,20,0.35)",
                }
          }
        >
          {isSubmitting ? "만드는 중…" : "카드 만들기"}
        </button>
      )}
    </div>
  );
}


