type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

type CachedToken = {
  token: string;
  // epoch ms
  expiresAt: number;
};

const globalForSpotify = globalThis as unknown as { spotifyToken?: CachedToken };

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export async function getSpotifyAccessToken(): Promise<string> {
  const cached = globalForSpotify.spotifyToken;
  const now = Date.now();
  if (cached && cached.expiresAt > now + 10_000) return cached.token; // 10s safety

  const clientId = requireEnv("SPOTIFY_CLIENT_ID");
  const clientSecret = requireEnv("SPOTIFY_CLIENT_SECRET");

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }).toString(),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Spotify token error: ${res.status} ${text}`);
  }

  const json = (await res.json()) as SpotifyTokenResponse;
  const token = json.access_token;
  const expiresAt = now + json.expires_in * 1000;
  globalForSpotify.spotifyToken = { token, expiresAt };
  return token;
}

export type SpotifyRecommendation = {
  id: string;
  title: string;
  artist: string;
  spotifyUrl: string;
  albumImageUrl?: string;
  previewUrl?: string | null;
};

type SpotifyImage = { url: string; width?: number | null };
type SpotifyArtist = { name?: string | null };
type SpotifyAlbum = { images?: SpotifyImage[] };
type SpotifyExternalUrls = { spotify?: string | null };
type SpotifyTrack = {
  id?: string | null;
  name?: string | null;
  artists?: SpotifyArtist[];
  album?: SpotifyAlbum;
  external_urls?: SpotifyExternalUrls;
  preview_url?: string | null;
};
type SpotifyRecommendationsResponse = { tracks?: SpotifyTrack[] };

function isObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object";
}

export async function getSpotifyRecommendationsByGenre(
  seedGenre: string,
  limit: number
): Promise<SpotifyRecommendation[]> {
  const token = await getSpotifyAccessToken();

  const url = new URL("https://api.spotify.com/v1/recommendations");
  url.searchParams.set("seed_genres", seedGenre);
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Spotify recommendations error: ${res.status} ${text}`);
  }

  const jsonUnknown: unknown = await res.json();
  const json: SpotifyRecommendationsResponse = isObject(jsonUnknown)
    ? (jsonUnknown as SpotifyRecommendationsResponse)
    : {};
  const tracks: SpotifyTrack[] = Array.isArray(json.tracks) ? json.tracks : [];

  return tracks
    .map((t) => {
      const artist =
        Array.isArray(t.artists) && t.artists[0]?.name ? t.artists[0].name : "Unknown";
      const images = t.album?.images;
      const albumImageUrl =
        Array.isArray(images) && images.length
          ? (images.find((img) => (img.width ?? 0) >= 300)?.url ?? images[0]?.url)
          : undefined;
      return {
        id: String(t.id ?? ""),
        title: String(t.name ?? ""),
        artist: String(artist),
        spotifyUrl: String(t.external_urls?.spotify ?? ""),
        albumImageUrl,
        previewUrl: t.preview_url ?? null,
      } satisfies SpotifyRecommendation;
    })
    .filter((t: SpotifyRecommendation) => t.id && t.title && t.spotifyUrl);
}


