"use client";
import useGetSongById from "@/hooks/api/useGetSongById";
import useLoadSongUrl from "@/hooks/api/buckets/useLoadSongUrl";
import usePlayer from "@/hooks/zustand/usePlayer";
import React, { useEffect, useState } from "react";
import PlayerContent from "./PlayerContent";



const Player = () => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);
  const songUrl = useLoadSongUrl(song!);


  if (!song || !songUrl || !player.activeId) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 h-[80px] w-full bg-black px-3 py-2 md:px-4">
      <PlayerContent key={songUrl} song={song!} songUrl={songUrl} />
    </div>
  );
};

export default Player;
