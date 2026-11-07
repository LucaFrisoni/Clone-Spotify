// Returns stable page loaders for the song lists, so infinite scrolling knows what to fetch.

import { useCallback } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { fetchLikedPage, fetchSongsPage } from "@/lib/songQueries";

export const useSongsPage = (filter: { title?: string; userId?: string } = {}) => {
  const client = useSupabaseClient();
  const { title, userId } = filter;

  return useCallback(
    (page: number) => fetchSongsPage(client, page, { title, userId }),
    [client, title, userId]
  );
};

export const useLikedPage = (userId?: string) => {
  const client = useSupabaseClient();

  return useCallback(
    (page: number) => fetchLikedPage(client, userId ?? "", page),
    [client, userId]
  );
};
