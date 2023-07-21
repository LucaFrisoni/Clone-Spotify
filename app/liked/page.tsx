
import getLikedSongs from "@/actions/getLikedSongs";
import Header from "@/components/Header";
import LikedContent from "@/components/LikedContent";

import Image from "next/image";
import React from "react";

export const revalidate = 0;

const Liked = async () => {
  const songs = await getLikedSongs();

  return (
    <div className=" bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header className=" bg-emerald-900">
        <div className=" mt-20 ">
          <div className=" flex flex-col md:flex-row items-center gap-x-5 relative bottom-12">
            <div className=" relative h-32 w-32 lg:h-60 lg:w-60">
              <Image
                fill
                src={"/images/liked.png"}
                alt="Playlist"
                className=" object-cover"
               
              />
            </div>
            <div className=" flex flex-col gap-y-2 mt-4 md:mt-0 ">
              <p className=" hidden md:block font-semibold text-sm">Playlist</p>
              <h1
                className=" text.white
                text-4xl
                sm:text-5xl lg:text-8xl
                font-bold ml-2"
              >
                Liked Songs
              </h1>
            </div>
          </div>
        </div>
      </Header>
<LikedContent songs={songs}/>

    </div>
  );
};

export default Liked;
