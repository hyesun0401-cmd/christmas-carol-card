-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('POP', 'JAZZ', 'KPOP');

-- CreateTable
CREATE TABLE "KpopArtist" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KpopArtist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarolSong" (
    "id" SERIAL NOT NULL,
    "genre" "Genre" NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "floUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kpopArtistId" INTEGER,

    CONSTRAINT "CarolSong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "genre" "Genre" NOT NULL,
    "songId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KpopArtist_slug_key" ON "KpopArtist"("slug");

-- CreateIndex
CREATE INDEX "CarolSong_genre_idx" ON "CarolSong"("genre");

-- CreateIndex
CREATE INDEX "CarolSong_kpopArtistId_idx" ON "CarolSong"("kpopArtistId");

-- CreateIndex
CREATE INDEX "Card_genre_idx" ON "Card"("genre");

-- CreateIndex
CREATE INDEX "Card_songId_idx" ON "Card"("songId");

-- CreateIndex
CREATE INDEX "Card_createdAt_idx" ON "Card"("createdAt");

-- AddForeignKey
ALTER TABLE "CarolSong" ADD CONSTRAINT "CarolSong_kpopArtistId_fkey" FOREIGN KEY ("kpopArtistId") REFERENCES "KpopArtist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_songId_fkey" FOREIGN KEY ("songId") REFERENCES "CarolSong"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
