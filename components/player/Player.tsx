"use client";
import useGetSongById from "@/hooks/api/useGetSongById";
import useLoadSongUrl from "@/hooks/api/buckets/useLoadSongUrl";
import usePlayer from "@/hooks/zustand/usePlayer";
import React from "react";
import PlayerContent from "./PlayerContent";

const Player = () => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);
  const songUrl = useLoadSongUrl(song!);

  if (!song || !songUrl || !player.activeId) {
    return null;
  }

  //En el celular queda encima de la barra de navegacion inferior
  return (
    <div className="fixed bottom-14 left-0 z-10 h-[80px] w-full bg-black px-3 py-2 md:bottom-0 md:px-4">
      <PlayerContent key={songUrl} song={song!} songUrl={songUrl} />
    </div>
  );
};

export default Player;
