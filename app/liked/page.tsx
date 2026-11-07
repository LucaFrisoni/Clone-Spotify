import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { countRows } from "@/actions/getProfileStats";
import Header from "@/components/Header";
import LikedContent from "@/components/likes/LikedContent";
import LikedHero from "@/components/likes/LikedHero";
import { fetchLikedPage } from "@/lib/songQueries";

export const revalidate = 0;

//Sin sesion redirige en el servidor; la primera pagina y el total se piden en paralelo
const Liked = async () => {
  const supabase = createServerComponentClient({ cookies: cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  const userId = session.user.id;
  const [songs, count] = await Promise.all([
    fetchLikedPage(supabase, userId, 0),
    countRows(supabase, "liked_songs", userId),
  ]);

  return (
    <div className=" bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header className=" from-indigo-700 via-indigo-900/70">
        <LikedHero count={count} />
      </Header>
      <LikedContent songs={songs} />
    </div>
  );
};

export default Liked;
