"use client";
import { Song } from "@/types";
import React from "react";
import MediaItem from "../songs/MediaItem";
import LikedButton from "../likes/LikedButton";
import useOnPlay from "@/hooks/useOnPlay";
import useInfiniteSongs from "@/hooks/useInfiniteSongs";
import { useSongsPage } from "@/hooks/useSongPages";
import LoadMore from "../LoadMore";

interface SearchContentProps {
  songs: Song[];
  title?: string;
}

const SearchContent: React.FC<SearchContentProps> = ({ songs: initialSongs, title }) => {
  const loadPage = useSongsPage({ title });
  const { songs, hasMore, isLoading, loadMore } = useInfiniteSongs(initialSongs, loadPage);
  const onPlay = useOnPlay(songs);

  if (songs.length === 0) {
    return (
      <div className=" flex flex-col gap-y-2 px-4 sm:px-6 text-neutral-400">
        No songs found.
      </div>
    );
  }

  return (
    <div className=" flex flex-col gap-y-1 w-full px-2 sm:px-6 pb-6">
      {songs.map((song) => (
        <div key={song.id} className=" flex items-center gap-x-2 sm:gap-x-4 w-full">
          <div className="min-w-0 flex-1">
            <MediaItem onClick={(id: string) => { onPlay(id) }} data={song} />
          </div>
          <LikedButton songId={song.id} size={22} />
        </div>
      ))}
      <LoadMore hasMore={hasMore} isLoading={isLoading} onLoadMore={loadMore} />
    </div>
  );
};

export default SearchContent;
