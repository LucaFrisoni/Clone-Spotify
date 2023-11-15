"use client";
import React from "react";
import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";
import { MdPlaylistAdd } from "react-icons/md";
import useAuthModal from "@/hooks/zustand/useAuthModal";
import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/zustand/useUploadModal";
import { Song } from "@/types";
import MediaItem from "../songs/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import usePlaylistModal from "@/hooks/zustand/createPlaylistModal";
import { ActionToolTip } from "../ActionTooltip";

interface LibraryProps {
  songs: Song[];
}

const Library: React.FC<LibraryProps> = ({ songs }) => {
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();
  const playlistModal = usePlaylistModal();

  const { user } = useUser();
  const onPlay = useOnPlay(songs);
  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }
    return uploadModal.onOpen();
  };

  const CreatePlaylist = () => {
    if (!user) {
      return authModal.onOpen();
    }
    return playlistModal.onOpen();
  };

  return (
    <div className=" flex flex-col">
      <div className=" flex items-center justify-between px-5 pt-7 relative ">
        <div className=" mt-2 inline-flex items-center gap-x-2">
          <TbPlaylist className=" text-neutral-400" size={26} />
          <p className="text-neutral-400 font-medium text-md hover:text-white">
            Your Library
          </p>
        </div>
        <div>
          <ActionToolTip label="Add song" side="top">
            <span>
            <AiOutlinePlus
              onClick={onClick}
              size={20}
              className="  text-neutral-400 cursor-pointer hover:text-white transition relative top-1"
            />
            </span>
          </ActionToolTip>
        </div>
        {/* <div className=" group ">
          <MdPlaylistAdd
            size={22}
            className=" text-neutral-400 cursor-pointer hover:text-white transition relative top-1"
            onClick={CreatePlaylist}
          />
          <div className=" transition opacity-0 absolute right-2 bottom-7 p-1 bg-neutral-800 text-sm rounded-md group-hover:opacity-100 duration-500">
            Create Playlist
          </div>
        </div> */}
      </div>
      <div className="flex flex-col gap-y-2 mt-4 px-3">
        {songs.map((song) => (
          <MediaItem
            onClick={(id: string) => {
              onPlay(id);
            }}
            key={song.id}
            data={song}
            library={true}
          />
        ))}
      </div>
    </div>
  );
};
export default Library;
