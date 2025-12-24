import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const artists = await prisma.kpopArtist.findMany({
    orderBy: { name: "asc" },
    select: {
      slug: true,
      name: true,
      _count: { select: { songs: true } },
    },
  });

  return NextResponse.json({
    items: artists.map((a) => ({
      slug: a.slug,
      name: a.name,
      imageUrl: `/kpop-artists/${a.slug}.svg`,
      songCount: a._count.songs,
    })),
  });
}


