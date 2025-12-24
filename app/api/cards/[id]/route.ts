import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: Request, ctx: RouteContext) {
  const { id } = await ctx.params;

  const card = await prisma.card.findUnique({
    where: { id },
    include: { song: true },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  // Best-effort view count update (don’t block response if it fails)
  prisma.card
    .update({ where: { id }, data: { viewCount: { increment: 1 } } })
    .catch(() => {});

  return NextResponse.json({
    id: card.id,
    message: card.message,
    genre: card.genre,
    createdAt: card.createdAt,
    viewCount: card.viewCount,
    song: {
      id: card.song.id,
      title: card.song.title,
      artist: card.song.artist,
      floUrl: card.song.floUrl,
      genre: card.song.genre,
    },
  });
}


