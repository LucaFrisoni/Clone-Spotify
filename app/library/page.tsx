// Shows the user's own songs on phones, where the sidebar library is hidden.

import getSongsByUserId from "@/actions/getSongsByUserId";
import Header from "@/components/Header";
import Library from "@/components/sidebar/Library";

export const revalidate = 0;

const LibraryPage = async () => {
  const songs = await getSongsByUserId();

  return (
    <div className=" bg-neutral-900 h-full w-full overflow-hidden overflow-y-auto">
      <Header className=" pb-0">
        <span />
      </Header>
      <Library songs={songs} />
    </div>
  );
};

export default LibraryPage;
