// Counts the songs a user uploaded and liked, for the profile header.

import type { SupabaseClient } from "@supabase/supabase-js";

export const countRows = async (client: SupabaseClient, table: string, userId: string) => {
  const { count, error } = await client
    .from(table)
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return 0;
  }
  return count ?? 0;
};

const getProfileStats = async (client: SupabaseClient, userId: string) => {
  const [uploads, likes] = await Promise.all([
    countRows(client, "songs", userId),
    countRows(client, "liked_songs", userId),
  ]);
  return { uploads, likes };
};

export default getProfileStats;
