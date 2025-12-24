import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type Genre = "POP" | "JAZZ" | "KPOP";

function isGenre(v: unknown): v is Genre {
  return v === "POP" || v === "JAZZ" || v === "KPOP";
}

function toNullableInt(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "number" && Number.isInteger(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && Number.isInteger(Number(v))) return Number(v);
  return null;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const record = body as Record<string, unknown>;
  const message = record.message;
  const genre = record.genre;
  const kpopArtistSlug = record.kpopArtistSlug;
  const songId = toNullableInt(record.songId);

  if (typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }
  if (message.length > 200) {
    return NextResponse.json({ error: "Message is too long (max 200)" }, { status: 400 });
  }
  if (!isGenre(genre)) {
    return NextResponse.json({ error: "Invalid genre" }, { status: 400 });
  }

  let song:
    | { id: number }
    | null = null;

  // v2: KPOP can be chosen by artist (required) + optional explicit songId
  if (genre === "KPOP") {
    if (typeof kpopArtistSlug !== "string" || kpopArtistSlug.trim().length === 0) {
      return NextResponse.json({ error: "K-pop artist is required" }, { status: 400 });
    }

    if (songId !== null) {
      const picked = await prisma.carolSong.findFirst({
        where: {
          id: songId,
          genre: "KPOP",
          kpopArtist: { slug: kpopArtistSlug.trim() },
        },
        select: { id: true },
      });
      if (!picked) {
        return NextResponse.json({ error: "Invalid song selection" }, { status: 400 });
      }
      song = picked;
    } else {
      const count = await prisma.carolSong.count({
        where: { genre: "KPOP", kpopArtist: { slug: kpopArtistSlug.trim() } },
      });
      if (count <= 0) {
        return NextResponse.json(
          { error: "No songs available for this K-pop artist" },
          { status: 500 }
        );
      }
      const randomIndex = Math.floor(Math.random() * count);
      song = await prisma.carolSong.findFirst({
        where: { genre: "KPOP", kpopArtist: { slug: kpopArtistSlug.trim() } },
        orderBy: { id: "asc" },
        skip: randomIndex,
        select: { id: true },
      });
    }
  } else {
    // default: random song by genre (existing behavior)
    const count = await prisma.carolSong.count({ where: { genre } });
    if (count <= 0) {
      return NextResponse.json({ error: "No songs available for this genre" }, { status: 500 });
    }

    const randomIndex = Math.floor(Math.random() * count);
    song = await prisma.carolSong.findFirst({
      where: { genre },
      orderBy: { id: "asc" },
      skip: randomIndex,
      select: { id: true },
    });
  }

  if (!song) {
    return NextResponse.json({ error: "Failed to pick a song" }, { status: 500 });
  }

  const id = nanoid(10);
  const card = await prisma.card.create({
    data: {
      id,
      message: message.trim(),
      genre,
      songId: song.id,
    },
  });

  return NextResponse.json(
    {
      cardId: card.id,
    },
    { status: 201 }
  );
}


