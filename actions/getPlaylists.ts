import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getPlayLists = async () => {
  const supabase = createServerComponentClient({ cookies: cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data, error } = await supabase
    .from("playlist")
    .select("name,imgPlayList_path")
    .eq("user_id", session?.user?.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.log(error);
    return [];
  }
  if (!data) {
    console.log(error);
    return [];
  }

  return data || [];
};

export default getPlayLists;
