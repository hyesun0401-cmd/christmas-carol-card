# Christmas Carol Card

Interactive digital Christmas card:
- Sender creates a card with a short message + genre (POP / JAZZ / KPOP)
- App picks **one random carol** from that genre and **locks it** into the card
- Receiver opens `/card/:id`, taps the envelope, and reveals the message + song + link

## Local dev (SQLite)

### 1) Install

```bash
cd carol-card
npm install
```

### 2) Create `.env.local`

Create `carol-card/.env.local`:

```bash
DATABASE_URL="file:./dev.db"
SPOTIFY_CLIENT_ID="..."
SPOTIFY_CLIENT_SECRET="..."
GEMINI_API_KEY="..."
```

### 3) Create tables + seed songs

```bash
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```

### 4) Run

```bash
npm run dev
```

Open:
- `/` (landing)
- `/create` (create a shareable card link)
- `/card/:id` (receiver view: tap envelope to reveal)

Same Wi‑Fi testing:
- Next.js also prints a LAN URL like `http://<LAN_IP>:3000` in the terminal.

## Notes about FLO links

Seed data currently stores FLO **search URLs** (works as a “listen” button, but not a guaranteed track deep-link).
To make it perfect, replace `floUrl` values with canonical FLO track URLs.

## Spotify (no-login / app token)

If you want to fetch a few recommended tracks from Spotify **without user login**, you can use the Client Credentials flow.

- Create an app in Spotify Developer Dashboard
- Enable **Web API**
- Set env vars in `.env.local`:
  - `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`

Then hit:
- `/api/spotify/recommendations?genre=POP&limit=5` (or `JAZZ`, `KPOP`)

Note: Redirect URI is **not required** for this no-login flow.

### Spotify quota/rate limit fallback

If Spotify is unavailable (quota/rate-limit/env missing), the endpoint automatically falls back to our seeded DB songs:
- Response includes `source: "db"` and items include `floUrl`.

## Gemini CLI (terminal)

This repo includes an npm script to run Google Gemini CLI:

```bash
cd carol-card
export GEMINI_API_KEY="..."
npm run gemini
```

Or install globally:

```bash
npm install -g @google/gemini-cli
export GEMINI_API_KEY="..."
gemini
```

## Main API endpoints

- `POST /api/cards`
  - body: `{ "message": string, "genre": "POP"|"JAZZ"|"KPOP" }`
  - returns: `{ "cardId": string }`
- `GET /api/cards/:id`
  - returns card + locked-in song

## Security note

Never commit secrets:
- `.env*` files are ignored by `.gitignore`
- If a secret is ever posted/shared, rotate it in the provider dashboard.

## Deploy (Vercel) + Production DB

SQLite files are not durable on serverless platforms, so production should use Postgres (e.g., Supabase or Vercel Postgres).

### What changes are needed for Postgres

- Update datasource provider in `prisma/schema.prisma` to Postgres
- Set `DATABASE_URL` to your Postgres connection string in Vercel env vars
- Switch runtime Prisma adapter in `lib/prisma.ts` from SQLite to Postgres adapter (Prisma 7 requires either `adapter` or `accelerateUrl`)
  - Example direction: `npm install pg @prisma/adapter-pg` and use a Postgres adapter in PrismaClient constructor
