import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import getSongs from "./getSongs";

const getSongsByTitle = async (title:string): Promise<Song[]> => {
  const supabase = createServerComponentClient({ cookies: cookies });

  if (!title) {
    const allSongs = await getSongs();
    return allSongs;
  }
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .ilike("tilte",`%${title}%`)
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error.message);
    throw new Error(`Could not search songs: ${error.message}`);
  }
  return (data as any) || [];
};

export default getSongsByTitle;
