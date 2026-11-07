import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { fetchLikedPage } from "@/lib/songQueries";

const getLikedSongs = async (): Promise<Song[]> => {
  const supabase = createServerComponentClient({ cookies: cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return [];
  }

  try {
    return await fetchLikedPage(supabase, session.user.id, 0);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getLikedSongs;
