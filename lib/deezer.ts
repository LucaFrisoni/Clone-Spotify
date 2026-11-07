// Reads Deezer's public catalog and keeps only what the app needs from each track.

const API_URL = "https://api.deezer.com";

export interface TrackResult {
  id: string;
  title: string;
  artist: string;
  cover: string;
}

export interface TrackAssets extends TrackResult {
  previewUrl: string;
  coverUrl: string;
}

export const isTrackId = (id: unknown): id is string =>
  typeof id === "string" && /^\d{1,20}$/.test(id);

//Solo se descargan archivos del CDN de Deezer, nunca una URL que mande el usuario
export const isDeezerAsset = (url: unknown) => {
  try {
    const { protocol, hostname } = new URL(String(url));
    return protocol === "https:" && hostname.endsWith(".dzcdn.net");
  } catch {
    return false;
  }
};

export const toTrackResult = (raw: any): TrackResult | null => {
  if (!raw?.id || !raw.title || !raw.preview || !raw.album?.cover_medium) {
    return null;
  }
  return {
    id: String(raw.id),
    title: raw.title,
    artist: raw.artist?.name ?? "Unknown artist",
    cover: raw.album.cover_medium,
  };
};

const getJson = async (path: string, init: RequestInit, fetcher: typeof fetch) => {
  const response = await fetcher(`${API_URL}${path}`, init);
  if (!response.ok) {
    throw new Error(`Deezer responded with ${response.status}`);
  }
  const body = await response.json();
  if (body.error) {
    throw new Error(body.error.message ?? "Deezer could not answer");
  }
  return body;
};

export const searchTracks = async (query: string, fetcher: typeof fetch = fetch) => {
  const path = `/search?q=${encodeURIComponent(query)}&limit=15`;
  const body = await getJson(path, { next: { revalidate: 3600 } } as RequestInit, fetcher);
  return (body.data ?? []).map(toTrackResult).filter(Boolean) as TrackResult[];
};

//Los enlaces del preview vencen, por eso este pedido nunca se cachea
export const getTrackAssets = async (id: string, fetcher: typeof fetch = fetch) => {
  const raw = await getJson(`/track/${id}`, { cache: "no-store" }, fetcher);
  const track = toTrackResult(raw);
  const coverUrl = raw.album?.cover_xl ?? raw.album?.cover_big;

  if (!track || !isDeezerAsset(raw.preview) || !isDeezerAsset(coverUrl)) {
    throw new Error("This song has no preview available");
  }
  return { ...track, previewUrl: raw.preview, coverUrl } as TrackAssets;
};
