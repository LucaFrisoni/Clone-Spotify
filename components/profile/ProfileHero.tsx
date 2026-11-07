"use client";
// Big photo, name and song counts at the top of the profile, as Spotify shows them.

import React from "react";
import { MdEdit } from "react-icons/md";
import useProfile from "@/hooks/useProfile";
import useEditProfileModal from "@/hooks/zustand/useEditProfileModal";
import Avatar from "../Avatar";

interface ProfileHeroProps {
  uploads: number;
  likes: number;
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

const ProfileHero: React.FC<ProfileHeroProps> = ({ uploads, likes }) => {
  const { name, avatar } = useProfile();
  const openEditor = useEditProfileModal((state) => state.onOpen);

  return (
    <div className=" flex flex-col sm:flex-row items-center sm:items-end gap-5 sm:gap-6 pt-2 sm:pt-8">
      <button
        aria-label="Edit profile photo"
        onClick={openEditor}
        className=" group relative rounded-full shadow-2xl"
      >
        <Avatar src={avatar} name={name} size={176} className=" h-36 w-36 sm:h-44 sm:w-44 lg:h-56 lg:w-56" />
        <span className=" absolute inset-0 flex flex-col items-center justify-center gap-y-1 rounded-full bg-black/60 text-sm font-semibold opacity-0 transition group-hover:opacity-100">
          <MdEdit size={36} />
          Choose photo
        </span>
      </button>
      <div className=" flex min-w-0 max-w-full flex-col gap-y-2 text-center sm:text-left">
        <p className=" hidden sm:block text-sm font-semibold">Profile</p>
        <button onClick={openEditor} className=" min-w-0 text-left">
          <h1 className=" break-words text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white">
            {name}
          </h1>
        </button>
        <p className=" text-sm text-neutral-300">
          {plural(uploads, "song")} added • {plural(likes, "liked song")}
        </p>
      </div>
    </div>
  );
};

export default ProfileHero;
