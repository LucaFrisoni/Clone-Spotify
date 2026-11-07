import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { fetchSongsPage } from "@/lib/songQueries";

const getSongsByTitle = async (title?: string) => {
  const supabase = createServerComponentClient({ cookies: cookies });

  try {
    return await fetchSongsPage(supabase, 0, { title });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getSongsByTitle;
