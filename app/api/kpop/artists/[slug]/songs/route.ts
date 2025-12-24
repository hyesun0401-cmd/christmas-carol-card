import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_req: Request, ctx: RouteContext) {
  const { slug } = await ctx.params;

  const artist = await prisma.kpopArtist.findUnique({
    where: { slug },
    select: {
      slug: true,
      name: true,
      songs: {
        where: { genre: "KPOP" },
        orderBy: [{ title: "asc" }, { id: "asc" }],
        select: { id: true, title: true, artist: true, floUrl: true },
      },
    },
  });

  if (!artist) {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 });
  }

  return NextResponse.json({
    artist: { slug: artist.slug, name: artist.name },
    items: artist.songs,
  });
}


