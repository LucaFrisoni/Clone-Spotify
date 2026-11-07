"use client";
import useLoadImage from "@/hooks/api/buckets/UseLoadImage";
import { Song } from "@/types";
import Image from "next/image";
import React from "react";
import useLoadSongUrl from "@/hooks/api/buckets/useLoadSongUrl";
import useSongDuration from "@/hooks/useSongDuration";
import { formatTime } from "@/lib/formatTime";
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

const MediaItem: React.FC<MediaItemProps> = ({
  onClick,
  data,
  library,
  position,
  classname,
}) => {
  const imageUrl = useLoadImage(data);

  const handleClick = () => {
    if (onClick) {
      return onClick(data.id);
    }
  };

  return (
    <div>
      {library ? (
        <div
          onClick={handleClick}
          className=" flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md"
        >
          <div className="  relative min-h-[35px] min-w-[35px] rounded-md xl:min-h-[48px] xl:min-w-[48px] overflow-hidden">
            <Image
              alt="Image"
              fill
              sizes="48px"
              src={imageUrl || ""}
              className={twMerge(" object-cover", classname)}
            />
          </div>

          <div className=" flex flex-col gap-y-1 overflow-hidden">
            {" "}
            <p className=" text-xs text-white truncate xl:text-base">{data.tilte}</p>
            <p className=" text-xs text-neutral-400 xl:text-base truncate">{data.author}</p>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className=" grid grid-cols-2 w-full justify-center items-center hover:bg-neutral-800/50"
        >
          <div className=" flex items-center gap-x-3 cursor-pointer  w-full p-2 rounded-md">
            <div className=" text-neutral-400 p-2">{position}</div>
            <div className="  relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden">
              <Image
                alt="Image"
                fill
                sizes="48px"
                src={imageUrl || ""}
                className=" object-cover"
              />
            </div>

            <div className=" flex flex-col gap-y-1 overflow-hidden">
              {" "}
              <p className=" text-white truncate">{data.tilte}</p>
              <p className=" text-neutral-400 text-sm truncate">
                {data.author}
              </p>
            </div>
          </div>

          <div className=" text-neutral-400 relative left-4 ">
            <SongDuration song={data} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaItem;
