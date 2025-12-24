## Spotify-based recommendation design (not implemented)

Goal: classify tracks into two buckets for the card experience:
- **CarolExplicit**: clearly Christmas/holiday carols
- **WinterMood**: winter-vibe tracks that are not explicit Christmas carols

This is a **design-only** document to implement later.

### Inputs
- **Target market**: e.g. `KR` (used for Spotify search/recs and filtering availability)
- **Target UI genres**: `POP | JAZZ | KPOP`
- **Desired output size**:
  - Candidate pool: 200~1000 tracks per UI genre (stored/cached)
  - Final list: 20~100 tracks per (UI genre × bucket), depending on product needs

### Stage 1) Candidate collection

Combine multiple sources, then de-duplicate.

#### A) Playlist-based sources (high precision)
1) Search playlists
   - Endpoint: `GET /v1/search?type=playlist&q=<query>&market=<market>&limit=50`
   - Queries for **CarolExplicit**:
     - `"christmas"`, `"holiday"`, `"xmas"`, `"noel"`, `"christmas classics"`
     - `"k-pop christmas"`, `"kpop christmas"`, `"jazz christmas"`
   - Queries for **WinterMood**:
     - `"winter"`, `"snow"`, `"december"`, `"winter chill"`, `"winter vibes"`
2) For each playlist, fetch tracks
   - Endpoint: `GET /v1/playlists/{playlist_id}/tracks?market=<market>&limit=100&offset=...`
3) Add each track to the candidate pool with metadata:
   - `source="playlist"`, `sourceQuery`, `playlistId`, `playlistName`

Notes:
- Playlist sources are typically the most “obviously seasonal”.
- Use a whitelist/blacklist of playlists after you’ve sampled results.

#### B) Keyword search sources (medium precision)
Search tracks directly:
- Endpoint: `GET /v1/search?type=track&q=<query>&market=<market>&limit=50`
- CarolExplicit queries (strong keywords):
  - `christmas`, `xmas`, `holiday`, `santa`, `noel`, `carol`, `merry`
  - Canonical carol titles: `jingle bell`, `silent night`, `white christmas`, `winter wonderland`
- WinterMood queries:
  - `winter`, `snow`, `december`, `first snow`, `cold`, `frost`

Query shaping tips:
- Use quoted phrases for canonical titles.
- Use `artist:` or `album:` constraints sparingly (helps precision but reduces recall).

#### C) Optional: Spotify recommendations API (wide recall)
If you already have a seed set (e.g. from A/B), you can expand it via recommendations:
- Endpoint: `GET /v1/recommendations?seed_tracks=<ids>&limit=100&market=<market>`

### Stage 2) Scoring + filtering

Compute two scores per track:
- `carolScore` (explicit Christmas/holiday)
- `winterScore` (winter mood but not explicit)

Then classify:
- if `carolScore >= CAROL_THRESHOLD` → **CarolExplicit**
- else if `winterScore >= WINTER_THRESHOLD` and `carolScore < CAROL_SUPPRESS_THRESHOLD` → **WinterMood**
- else → discard (or keep for manual review)

#### A) Text-based scoring (title / album / artist)
Normalize strings:
- lowercase
- remove punctuation
- collapse whitespace

Strong carol keywords (high weight):
- `christmas`, `xmas`, `holiday`, `santa`, `noel`, `carol`, `merry`, `jingle`
Canonical titles (very high weight):
- `silent night`, `white christmas`, `winter wonderland`, `jingle bell rock`, `deck the halls`, etc.

Winter keywords (medium weight):
- `winter`, `snow`, `december`, `first snow`, `cold`, `frost`

Example (weights are placeholders):
- `carolScore += 5` for strong carol keywords in title
- `carolScore += 8` for canonical title phrases
- `carolScore += 3` for strong carol keywords in album name
- `winterScore += 3` for winter keywords in title
- `winterScore += 1` for winter keywords in album

Important:
- Some phrases overlap (e.g. “winter wonderland” is both winter and carol) → treat as carol.

#### B) Audio Features scoring (for WinterMood)
Fetch audio features:
- Endpoint: `GET /v1/audio-features?ids=<comma-separated track ids>`

Useful fields:
- `tempo`, `energy`, `valence`, `acousticness`, `instrumentalness`, `danceability`

Example winter-vibe heuristic (tune later):
- Prefer mid/low energy, slightly lower valence, more acoustic:
  - `winterScore += 2` if `energy <= 0.55`
  - `winterScore += 1` if `tempo <= 120`
  - `winterScore += 1` if `acousticness >= 0.35`
  - `winterScore += 1` if `valence <= 0.55`

Avoid “party” tracks for WinterMood (optional):
- `winterScore -= 2` if `energy >= 0.85` and `danceability >= 0.75`

#### C) UI genre mapping (POP / JAZZ / KPOP)
Spotify doesn’t have “KPOP” as a reliable track field. Suggested approach:
- Use **seed sources**: “k-pop christmas” playlists/search queries to define KPOP pool.
- Optionally reinforce using **artist genres**:
  - `GET /v1/artists/{id}` provides `genres[]`
  - KPOP-ish hints: `k-pop`, `korean pop`, `k-pop girl group`, etc.

### Stage 3) Quality gates

Apply quality constraints after classification:
- **De-duplicate**
  - Primary key: `track.id`
  - Also consider duplicate detection by `(normalizedTitle, primaryArtist)`
- **Availability**
  - Ensure `external_urls.spotify` exists
  - Filter by `market` availability where possible
- **Preview availability**
  - If you want a 30s preview: require `preview_url != null`
  - (Note: many tracks no longer have previews in some regions; consider making this optional)
- **Balance**
  - Ensure variety (avoid same artist dominating):
    - max 2 tracks per artist per bucket
  - Ensure a mix of tempos/energies inside WinterMood if desired

### Output & caching strategy (recommended)
- Run this pipeline **offline** (cron / admin command) and store results in your DB:
  - `RecommendedTrack` table with:
    - `bucket` (CarolExplicit/WinterMood)
    - `uiGenre` (POP/JAZZ/KPOP)
    - `spotifyTrackId`, `title`, `artist`, `albumImageUrl`, `spotifyUrl`, `previewUrl`
    - `scores`, `sources`, `createdAt`
- The app runtime only does:
  - `SELECT ... ORDER BY RANDOM() LIMIT 1` by `(bucket, uiGenre)`

### Suggested thresholds (starting point)
- `CAROL_THRESHOLD = 6`
- `CAROL_SUPPRESS_THRESHOLD = 4`
- `WINTER_THRESHOLD = 3`

Tune by sampling 50–100 results per bucket and adjusting false positives.


