"use client";

import { useUser } from "@/hooks/useUser";
import { Song } from "@/types";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import MediaItem from "./MediaItem";
import LikedButton from "./LikedButton";
import useOnPlay from "@/hooks/useOnPlay";
import { AiFillClockCircle } from "react-icons/ai";

interface LikedContentProps {
  songs: Song[];
}

const LikedContent: React.FC<LikedContentProps> = ({ songs }) => {
  const router = useRouter();
  const { isLoading, user } = useUser();


  const onPlay = useOnPlay(songs)
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  if (songs.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
        No liked songs
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 w-full p-6 bg-gradient-to-b from-emerald-950" >
      <div className=" grid grid-cols-2 items-center">
        <h2 className=" text-neutral-400">Title</h2>
        <h2 className=" text-neutral-400"><AiFillClockCircle/></h2>
      </div>
      <hr className=" border-neutral-600"/>
      {songs.reverse().map((song,index) => (
       
        <div key={song.id} className="flex items-center gap-x-4 w-full">
          <div className="flex-1">
            <MediaItem onClick={(id:string) => {onPlay(id)}} data={song} position={index + 1 }/>
          </div>
          <LikedButton songId={song.id} />
        </div>
      ))}
    </div>
  );
};

export default LikedContent;
