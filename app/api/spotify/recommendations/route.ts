import { NextResponse } from "next/server";

import { getSpotifyRecommendationsByGenre } from "@/lib/spotify";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Genre = "POP" | "JAZZ" | "KPOP";

function isGenre(v: unknown): v is Genre {
  return v === "POP" || v === "JAZZ" || v === "KPOP";
}

function mapGenreToSpotifySeed(genre: Genre): string {
  switch (genre) {
    case "POP":
      return "pop";
    case "JAZZ":
      return "jazz";
    case "KPOP":
      return "k-pop";
  }
}

async function getFallbackDbSongs(genre: Genre, limit: number) {
  // SQLite random ordering
  const rows = await prisma.$queryRaw<
    Array<{ id: number; title: string; artist: string; floUrl: string; genre: Genre }>
  >`SELECT id, title, artist, floUrl, genre FROM CarolSong WHERE genre = ${genre} ORDER BY RANDOM() LIMIT ${limit}`;

  return rows.map((s) => ({
    id: `db-${s.id}`,
    title: s.title,
    artist: s.artist,
    // keep spotifyUrl field for compatibility; provide floUrl separately
    spotifyUrl: "",
    albumImageUrl: undefined,
    previewUrl: null as null,
    floUrl: s.floUrl,
  }));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const genreParam = searchParams.get("genre");
  const limitParam = searchParams.get("limit");

  const genre = genreParam as unknown;
  if (!isGenre(genre)) {
    return NextResponse.json({ error: "Invalid genre" }, { status: 400 });
  }

  const limit = Math.max(1, Math.min(10, Number(limitParam ?? "5") || 5));

  try {
    const seed = mapGenreToSpotifySeed(genre);
    const items = await getSpotifyRecommendationsByGenre(seed, limit);
    return NextResponse.json({ genre, source: "spotify", items });
  } catch (e) {
    // Fallback: if Spotify fails (rate-limit/quota/env), serve from our seeded DB.
    try {
      const fallbackItems = await getFallbackDbSongs(genre, limit);
      const message = e instanceof Error ? e.message : "Spotify error";
      return NextResponse.json({
        genre,
        source: "db",
        warning: "Spotify unavailable. Falling back to local DB.",
        detail: message,
        items: fallbackItems,
      });
    } catch (fallbackErr) {
      const message = e instanceof Error ? e.message : "Spotify error";
      const fallbackMessage =
        fallbackErr instanceof Error ? fallbackErr.message : "DB fallback error";
      return NextResponse.json(
        {
          error: "Spotify fetch failed",
          detail: message,
          fallbackError: fallbackMessage,
        },
        { status: 500 }
      );
    }
  }
}


