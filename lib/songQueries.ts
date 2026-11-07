// Builds the paged song queries shared by server pages and infinite scrolling lists.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Song } from "../types";

export const PAGE_SIZE = 20;

interface SongFilter {
  title?: string;
  userId?: string;
}

export const pageRange = (page: number) => {
  const from = page * PAGE_SIZE;
  return [from, from + PAGE_SIZE - 1] as const;
};

//Sin escapar, buscar "100%" o "_" devolveria canciones que no coinciden
export const escapeLike = (text: string) => text.replace(/[\\%_]/g, (char) => `\\${char}`);

//Une una pagina recien traida con lo ya cargado sin repetir canciones
export const mergeSongs = (first: Song[], rest: Song[]) => {
  const seen = new Set(first.map((song) => String(song.id)));
  return [...first, ...rest.filter((song) => !seen.has(String(song.id)))];
};

//Un corte de red momentaneo llega como "fetch failed"; vale la pena un segundo intento
export const isNetworkError = (error: { message?: string } | null) =>
  /fetch failed|failed to fetch|networkerror/i.test(error?.message ?? "");

export const runWithRetry = async <T extends { error: { message?: string } | null }>(run: () => PromiseLike<T>) => {
  const first = await run();
  return isNetworkError(first.error) ? run() : first;
};

const buildSongsQuery = (client: SupabaseClient, page: number, { title, userId }: SongFilter) => {
  let query = client
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });

  if (title) query = query.ilike("tilte", `%${escapeLike(title)}%`);
  if (userId) query = query.eq("user_id", userId);
  return query.range(...pageRange(page));
};

export const fetchSongsPage = async (client: SupabaseClient, page: number, filter: SongFilter = {}) => {
  const { data, error } = await runWithRetry(() => buildSongsQuery(client, page, filter));
  if (error) {
    throw new Error(`Could not load songs: ${error.message}`);
  }
  return (data ?? []) as Song[];
};

export const fetchLikedPage = async (client: SupabaseClient, userId: string, page: number) => {
  const { data, error } = await runWithRetry(() =>
    client
      .from("liked_songs")
      .select("created_at, songs(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .range(...pageRange(page))
  );

  if (error) {
    throw new Error(`Could not load liked songs: ${error.message}`);
  }
  //Guarda cuando se dio el like para mostrar la columna "Date added"
  return (data ?? [])
    .filter((row: any) => row.songs)
    .map((row: any) => ({ ...row.songs, added_at: row.created_at })) as Song[];
};
