// Copies a Deezer preview and its cover into Storage and saves it as the user's song.

import type { SupabaseClient } from "@supabase/supabase-js";
import uniqid from "uniqid";
import { getTrackAssets } from "./deezer.ts";

const MAX_ASSET_BYTES = 10 * 1024 * 1024;

export class DuplicateTrackError extends Error {}

//Quita caracteres que rompen las rutas de Storage, como "/" o "?"
export const storageName = (prefix: string, title: string, unique: string) => {
  const safeTitle = title.replace(/[^\p{L}\p{N} -]/gu, "").trim().slice(0, 60);
  return `${prefix}-${safeTitle || "track"}-${unique}`;
};

export const downloadAsset = async (url: string, expectedType: string, fetcher: typeof fetch) => {
  const response = await fetcher(url, { cache: "no-store" });
  const type = response.headers.get("content-type") ?? "";
  if (!response.ok || !type.startsWith(expectedType)) {
    throw new Error(`Could not download ${expectedType} from Deezer`);
  }

  const bytes = await response.arrayBuffer();
  if (bytes.byteLength > MAX_ASSET_BYTES) {
    throw new Error("The downloaded file is too large");
  }
  return { bytes, type };
};

const uploadAsset = async (
  client: SupabaseClient,
  bucket: string,
  name: string,
  { bytes, type }: { bytes: ArrayBuffer; type: string }
) => {
  const { data, error } = await client.storage
    .from(bucket)
    .upload(name, bytes, { contentType: type, cacheControl: "3600", upsert: false });
  if (error) {
    throw new Error(`Could not save the ${bucket} file: ${error.message}`);
  }
  return data.path;
};

const assertNotInLibrary = async (client: SupabaseClient, userId: string, title: string, author: string) => {
  const { count, error } = await client
    .from("songs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("tilte", title)
    .eq("author", author);

  if (error) throw new Error(`Could not check your library: ${error.message}`);
  if (count) throw new DuplicateTrackError("This song is already in your library");
};

export const importTrack = async (
  client: SupabaseClient,
  userId: string,
  trackId: string,
  fetcher: typeof fetch = fetch
) => {
  const track = await getTrackAssets(trackId, fetcher);
  await assertNotInLibrary(client, userId, track.title, track.artist);

  const [audio, cover] = await Promise.all([
    downloadAsset(track.previewUrl, "audio/mpeg", fetcher),
    downloadAsset(track.coverUrl, "image/", fetcher),
  ]);
  const unique = uniqid();
  const songPath = await uploadAsset(client, "songs", storageName("song", track.title, unique), audio);
  const imagePath = await uploadAsset(client, "images", storageName("image", track.title, unique), cover);

  const { data, error } = await client
    .from("songs")
    .insert({ user_id: userId, tilte: track.title, author: track.artist, song_path: songPath, image_path: imagePath })
    .select()
    .single();
  if (error) throw new Error(`Could not save the song: ${error.message}`);
  return data;
};
