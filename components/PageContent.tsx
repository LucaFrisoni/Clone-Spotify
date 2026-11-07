"use client";
import React from "react";
import { Song } from "@/types";
import SongItem from "./songs/SongItem";
import useOnPlay from "@/hooks/useOnPlay";
import useInfiniteSongs from "@/hooks/useInfiniteSongs";
import { useSongsPage } from "@/hooks/useSongPages";
import LoadMore from "./LoadMore";

interface PageContentProps {
  songs: Song[];
  userId?: string;
  emptyMessage?: string;
}

const PageContent: React.FC<PageContentProps> = ({
  songs: initialSongs,
  userId,
  emptyMessage = "No songs available",
}) => {
  const loadPage = useSongsPage({ userId });
  const { songs, hasMore, isLoading, loadMore } = useInfiniteSongs(initialSongs, loadPage);
  const onPlay = useOnPlay(songs);

  if (songs.length === 0) {
    return <div className="mt-4 text-neutral-400">{emptyMessage}</div>;
  }

  return (
    <div className=" grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-3 sm:gap-4 mt-4">
      {songs.map((song) => (
        <SongItem key={song.id} onClick={(id: string) => { onPlay(id) }} data={song} />
      ))}
      <LoadMore hasMore={hasMore} isLoading={isLoading} onLoadMore={loadMore} />
    </div>
  );
};

export default PageContent;
