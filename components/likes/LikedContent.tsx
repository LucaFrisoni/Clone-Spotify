"use client";

import { useUser } from "@/hooks/useUser";
import { Song } from "@/types";
import React from "react";
import MediaItem from "../songs/MediaItem";
import LikedButton from "./LikedButton";
import useOnPlay from "@/hooks/useOnPlay";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaPlay } from "react-icons/fa";
import useInfiniteSongs from "@/hooks/useInfiniteSongs";
import { useLikedPage } from "@/hooks/useSongPages";
import useLikedSongs from "@/hooks/zustand/useLikedSongs";
import LoadMore from "../LoadMore";

interface LikedContentProps {
  songs: Song[];
}

//Al quitar un like la cancion desaparece al instante, sin esperar al servidor
const useVisibleLikes = (songs: Song[], userId?: string) => {
  const likedIds = useLikedSongs((state) => state.ids);
  const loadedFor = useLikedSongs((state) => state.loadedFor);

  if (!userId || loadedFor !== userId) {
    return songs;
  }
  return songs.filter((song) => likedIds.has(String(song.id)));
};

const ListHeader = () => (
  <div className=" flex items-center gap-x-3 border-b border-white/10 px-2 py-2 text-sm text-neutral-400">
    <span className=" w-6 text-right">#</span>
    <span className=" flex-1 pl-[60px]">Title</span>
    <span className=" hidden w-32 lg:block">Date added</span>
    <AiOutlineClockCircle className=" hidden w-10 sm:block" size={16} />
    <span className=" w-[22px] sm:ml-1" />
  </div>
);

const PlayAllButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    aria-label="Play Liked Songs"
    onClick={onClick}
    className=" flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg transition hover:scale-105 hover:bg-green-400 active:scale-95"
  >
    <FaPlay className=" ml-1 text-black" size={20} />
  </button>
);

const LikedContent: React.FC<LikedContentProps> = ({ songs: initialSongs }) => {
  const { user } = useUser();
  const loadPage = useLikedPage(user?.id);
  const { songs, hasMore, isLoading, loadMore } = useInfiniteSongs(initialSongs, loadPage);
  const visibleSongs = useVisibleLikes(songs, user?.id);
  const onPlay = useOnPlay(visibleSongs);

  if (visibleSongs.length === 0) {
    return (
      <div className=" flex flex-col items-center gap-y-2 px-6 py-16 text-center">
        <p className=" text-2xl font-bold text-white">Songs you like will appear here</p>
        <p className=" text-neutral-400">Save songs by tapping the heart icon.</p>
      </div>
    );
  }

  return (
    <div className=" flex flex-col w-full px-2 pb-6 sm:px-6 bg-gradient-to-b from-indigo-950 to-neutral-900 to-[320px]">
      <div className=" py-5 px-2">
        <PlayAllButton onClick={() => onPlay(visibleSongs[0].id)} />
      </div>
      <ListHeader />
      <div className=" mt-2 flex flex-col gap-y-1">
        {visibleSongs.map((song, index) => (
          <div key={song.id} className=" flex items-center gap-x-2 sm:gap-x-4 w-full">
            <div className=" min-w-0 flex-1">
              <MediaItem onClick={(id: string) => onPlay(id)} data={song} position={index + 1} />
            </div>
            <LikedButton songId={song.id} size={22} />
          </div>
        ))}
      </div>
      <LoadMore hasMore={hasMore} isLoading={isLoading} onLoadMore={loadMore} />
    </div>
  );
};

export default LikedContent;
