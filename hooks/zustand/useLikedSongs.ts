// Holds the signed-in user's likes so every button shares one query and updates at once.

import type { SupabaseClient } from "@supabase/supabase-js";
import { create } from "zustand";

interface LikedSongsStore {
  userId?: string;
  //Usuario cuyos likes ya llegaron; antes de eso la lista no se filtra
  loadedFor?: string;
  ids: Set<string>;
  load: (client: SupabaseClient, userId: string) => Promise<void>;
  toggle: (client: SupabaseClient, userId: string, songId: string) => Promise<void>;
  reset: () => void;
}

const pending = new Set<string>();

const withLike = (ids: Set<string>, id: string, liked: boolean) => {
  const next = new Set(ids);
  liked ? next.add(id) : next.delete(id);
  return next;
};

const useLikedSongs = create<LikedSongsStore>((set, get) => {
  const setLiked = (id: string, liked: boolean) =>
    set({ ids: withLike(get().ids, id, liked) });

  const load = async (client: SupabaseClient, userId: string) => {
    if (get().userId === userId) {
      return;
    }
    set({ userId, loadedFor: undefined, ids: new Set() });

    const { data, error } = await client
      .from("liked_songs")
      .select("song_id")
      .eq("user_id", userId);

    if (error) {
      set({ userId: undefined });
      throw error;
    }
    set({ loadedFor: userId, ids: new Set(data.map((row) => String(row.song_id))) });
  };

  const toggle = async (client: SupabaseClient, userId: string, songId: string) => {
    const id = String(songId);
    if (pending.has(id)) {
      return;
    }

    pending.add(id);
    const wasLiked = get().ids.has(id);
    setLiked(id, !wasLiked);

    const likes = client.from("liked_songs");
    const { error } = await (wasLiked
      ? likes.delete().eq("user_id", userId).eq("song_id", songId)
      : likes.insert({ song_id: songId, user_id: userId }));
    pending.delete(id);

    if (error) {
      setLiked(id, wasLiked);
      throw error;
    }
  };

  const reset = () => set({ userId: undefined, loadedFor: undefined, ids: new Set() });

  return { userId: undefined, loadedFor: undefined, ids: new Set(), load, toggle, reset };
});

export default useLikedSongs;
