import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { fetchSongsPage } from "@/lib/songQueries";

//Solo la primera pagina; el resto se pide al hacer scroll
const getSongs = async () => {
  const supabase = createServerComponentClient({ cookies: cookies });

  try {
    return await fetchSongsPage(supabase, 0);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getSongs;
