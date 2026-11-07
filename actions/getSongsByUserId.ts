import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { fetchSongsPage } from "@/lib/songQueries";

//La biblioteca vive en el layout: si falla se registra, pero no tira abajo toda la app
const getSongsByUserId = async (): Promise<Song[]> => {
  const supabase = createServerComponentClient({ cookies: cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return [];
  }

  try {
    return await fetchSongsPage(supabase, 0, { userId: session.user.id });
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getSongsByUserId;
