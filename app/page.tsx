
import getPlayLists from "@/actions/getPlaylists";
import getSongs from "@/actions/getSongs";
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import PageContent from "@/components/PageContent";


export const revalidate = 0;

export default async function Home() {
  const songs = await getSongs();
  const playlists = await getPlayLists();


  return (
    <div className=" bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header playlist={playlists}>
        <div className=" mb-2">
          <h1 className="text-white text-3xl font-semibold">Welcome back!</h1>
          <h2 className="text-neutral-400 text-2xl font-semibold">
            Your Playlists
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
            <ListItem
              image="/images/liked.png"
              name="Liked Songs"
              href="liked"
            />
            {/* {playlists.map((playlist) => (
              <ListItem
                key={playlist.imgPlayList_path}
                image={playlist.imgPlayList_path}
                name={playlist.name}
                href={`playlist?name=${playlist.name}`}
                playlist={true}
              />
            ))} */}
          </div>
        </div>
      </Header>
      <div className=" mt-2 mb-7 px-6">
        <div className=" flex justify-between items-center">
          <h1 className=" text-white text-2xl font-semibold">Newest songs</h1>
        </div>
        <div>
          <PageContent songs={songs} />
        </div>
      </div>
    </div>
  );
}
