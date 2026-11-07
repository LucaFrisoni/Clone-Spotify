"use client";
import React from "react";
import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import useAuthModal from "@/hooks/zustand/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/zustand/useUploadModal";
import { Song } from "@/types";
import MediaItem from "../songs/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { ActionToolTip } from "../ActionTooltip";
import useInfiniteSongs from "@/hooks/useInfiniteSongs";
import { useSongsPage } from "@/hooks/useSongPages";
import LoadMore from "../LoadMore";
import Button from "../Button";

interface LibraryProps {
  songs: Song[];
}

const EmptyLibrary: React.FC<{ isSignedIn: boolean; onAction: () => void }> = ({ isSignedIn, onAction }) => (
  <div className=" mx-2 flex flex-col items-start gap-y-3 rounded-lg bg-neutral-800 p-4">
    <p className=" font-semibold text-white">
      {isSignedIn ? "Add your first song" : "Create your library"}
    </p>
    <p className=" text-sm text-neutral-400">
      {isSignedIn ? "Upload a file or find one online." : "Log in to upload and save songs."}
    </p>
    <Button onClick={onAction} className=" w-auto bg-white px-4 py-1.5 text-sm">
      {isSignedIn ? "Add song" : "Log in"}
    </Button>
  </div>
);

const Library: React.FC<LibraryProps> = ({ songs: initialSongs }) => {
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const loadPage = useSongsPage({ userId: user?.id });
  const { songs, hasMore, isLoading, loadMore } = useInfiniteSongs(initialSongs, user ? loadPage : undefined);
  const onPlay = useOnPlay(songs);

  const onClick = () => (user ? uploadModal.onOpen() : authModal.onOpen());

  return (
    <div className=" flex flex-col pb-4">
      <div className=" flex items-center justify-between px-5 pt-5 pb-2">
        <div className=" inline-flex items-center gap-x-2">
          <TbPlaylist className=" text-neutral-400" size={26} />
          <p className="text-neutral-400 font-medium text-md">Your Library</p>
        </div>
        <ActionToolTip label="Add song" side="top">
          <button aria-label="Add song" onClick={onClick} className=" text-neutral-400 hover:text-white transition">
            <AiOutlinePlus size={20} />
          </button>
        </ActionToolTip>
      </div>
      <div className="flex flex-col gap-y-1 mt-2 px-3">
        {songs.length === 0 && <EmptyLibrary isSignedIn={Boolean(user)} onAction={onClick} />}
        {songs.map((song) => (
          <MediaItem onClick={(id: string) => onPlay(id)} key={song.id} data={song} library={true} />
        ))}
        <LoadMore hasMore={hasMore} isLoading={isLoading} onLoadMore={loadMore} />
      </div>
    </div>
  );
};
export default Library;
