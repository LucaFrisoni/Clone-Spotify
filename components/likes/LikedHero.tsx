"use client";
// Header of Liked Songs: cover, title, owner and song count.

import Image from "next/image";
import React from "react";
import useProfile from "@/hooks/useProfile";
import Avatar from "../Avatar";

const LikedHero: React.FC<{ count: number }> = ({ count }) => {
  const { name, avatar } = useProfile();

  return (
    <div className=" flex flex-col sm:flex-row items-center sm:items-end gap-5 pt-2 sm:pt-8">
      <div className=" relative h-40 w-40 sm:h-44 sm:w-44 lg:h-56 lg:w-56 shrink-0 shadow-2xl">
        <Image fill priority sizes="224px" src="/images/liked.png" alt="Liked Songs" className=" object-cover rounded-sm" />
      </div>
      <div className=" flex min-w-0 flex-col gap-y-2 text-center sm:text-left">
        <p className=" hidden sm:block text-sm font-semibold">Playlist</p>
        <h1 className=" text-white text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold">Liked Songs</h1>
        <div className=" flex items-center justify-center sm:justify-start gap-x-2 text-sm">
          <Avatar src={avatar} name={name} size={24} className=" h-6 w-6" />
          <span className=" font-semibold text-white">{name}</span>
          <span className=" text-neutral-300">• {count} {count === 1 ? "song" : "songs"}</span>
        </div>
      </div>
    </div>
  );
};

export default LikedHero;
