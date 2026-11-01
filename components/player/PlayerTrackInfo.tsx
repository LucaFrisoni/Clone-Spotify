// Shows the cover, title and artist of the current song, with its like button.

import Image from "next/image";
import React from "react";
import useLoadImage from "@/hooks/api/buckets/UseLoadImage";
import { Song } from "@/types";
import LikedButton from "../likes/LikedButton";

const PlayerTrackInfo: React.FC<{ song: Song }> = ({ song }) => {
  const imageUrl = useLoadImage(song);

  return (
    <div className="flex min-w-0 flex-1 items-center gap-x-3">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded md:h-14 md:w-14">
        <Image alt={song.tilte} fill sizes="56px" src={imageUrl || ""} className="object-cover" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">{song.tilte}</p>
        <p className="truncate text-xs text-neutral-400">{song.author}</p>
      </div>
      <div className="ml-1 shrink-0">
        <LikedButton songId={song.id} size={20} />
      </div>
    </div>
  );
};

export default PlayerTrackInfo;
