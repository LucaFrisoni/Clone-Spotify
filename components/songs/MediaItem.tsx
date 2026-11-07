"use client";
import useLoadImage from "@/hooks/api/buckets/UseLoadImage";
import { Song } from "@/types";
import Image from "next/image";
import React from "react";
import { FaPlay } from "react-icons/fa";
import useLoadSongUrl from "@/hooks/api/buckets/useLoadSongUrl";
import useSongDuration from "@/hooks/useSongDuration";
import { formatTime } from "@/lib/formatTime";
import { formatAddedDate } from "@/lib/formatAddedDate";
import usePlayer from "@/hooks/zustand/usePlayer";
import { twMerge } from "tailwind-merge";

interface MediaItemProps {
  onClick?: (id: string) => void;
  data: Song;
  library?: boolean;
  timer?: string;
  position?: number;
  classname?: string;
}

//Solo la vista de lista muestra la duracion, leyendo apenas los metadatos del audio
const SongDuration: React.FC<{ song: Song }> = ({ song }) => {
  const seconds = useSongDuration(useLoadSongUrl(song));

  return <p>{formatTime(seconds)}</p>;
};

//Numero de la fila; al pasar el mouse se convierte en boton de play, como en Spotify
const Position: React.FC<{ value: number; isActive: boolean }> = ({ value, isActive }) => (
  <div className=" flex w-6 shrink-0 justify-end text-sm tabular-nums text-neutral-400">
    <span className={twMerge(" group-hover:hidden", isActive && "text-green-500")}>{value}</span>
    <FaPlay className=" hidden text-white group-hover:block" size={12} />
  </div>
);

const SongText: React.FC<{ song: Song; compact?: boolean; isActive: boolean }> = ({ song, compact, isActive }) => (
  <div className=" flex min-w-0 flex-1 flex-col gap-y-0.5">
    <p className={twMerge(" truncate text-white", compact && "text-sm", isActive && "text-green-500")}>{song.tilte}</p>
    <p className={twMerge(" truncate text-sm text-neutral-400", compact && "text-xs")}>{song.author}</p>
  </div>
);

const MediaItem: React.FC<MediaItemProps> = ({
  onClick,
  data,
  library,
  position,
  classname,
}) => {
  const imageUrl = useLoadImage(data);
  const isActive = usePlayer((state) => String(state.activeId) === String(data.id));

  const handleClick = () => {
    if (onClick) {
      return onClick(data.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className=" group flex w-full cursor-pointer items-center gap-x-3 rounded-md p-2 hover:bg-neutral-800/50"
    >
      {position !== undefined && <Position value={position} isActive={isActive} />}
      <div className=" relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
        <Image
          alt={data.tilte}
          fill
          sizes="48px"
          src={imageUrl || ""}
          className={twMerge(" object-cover", classname)}
        />
      </div>
      <SongText song={data} compact={library} isActive={isActive} />
      {data.added_at && (
        <p className=" hidden w-32 shrink-0 text-sm text-neutral-400 lg:block">{formatAddedDate(data.added_at)}</p>
      )}
      {!library && (
        <div className=" hidden w-10 shrink-0 text-right text-sm tabular-nums text-neutral-400 sm:block">
          <SongDuration song={data} />
        </div>
      )}
    </div>
  );
};

export default MediaItem;
