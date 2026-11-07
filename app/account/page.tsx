import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import getProfileStats from "@/actions/getProfileStats";
import Header from "@/components/Header";
import PageContent from "@/components/PageContent";
import AccountActions from "@/components/profile/AccountActions";
import ProfileHero from "@/components/profile/ProfileHero";
import { fetchSongsPage } from "@/lib/songQueries";

export const revalidate = 0;

//Se resuelve en el servidor: sin sesion redirige antes de mostrar nada
const Account = async () => {
  const supabase = createServerComponentClient({ cookies: cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  const userId = session.user.id;
  const [uploads, stats] = await Promise.all([
    fetchSongsPage(supabase, 0, { userId }),
    getProfileStats(supabase, userId),
  ]);

  return (
    <div className=" bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header className=" from-neutral-600">
        <ProfileHero uploads={stats.uploads} likes={stats.likes} />
      </Header>
      <div className=" flex flex-col gap-y-10 px-4 sm:px-6 pt-4 pb-10">
        <section>
          <h2 className=" text-white text-2xl font-semibold">Your uploads</h2>
          <PageContent songs={uploads} userId={userId} emptyMessage="You have not added songs yet." />
        </section>
        <AccountActions email={session.user.email} provider={session.user.app_metadata.provider} />
      </div>
    </div>
  );
};

export default Account;
