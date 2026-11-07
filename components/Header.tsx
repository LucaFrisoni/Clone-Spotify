"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import Button from "./Button";
import useAuthModal from "@/hooks/zustand/useAuthModal";
import { useUser } from "@/hooks/useUser";
import usePlaylistNames from "@/hooks/zustand/usePlaylistNames";
import UserMenu from "./UserMenu";

interface PlaylistItem {
  name: string;
  imgPlayList_path: string;
  // Otras propiedades relevantes de los elementos de la playlist
}

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
  playlist?: PlaylistItem[];
}

const NAV_BUTTON = " rounded-full bg-black flex items-center justify-center hover:opacity-75 transition";

const Header: React.FC<HeaderProps> = ({ children, className, playlist }) => {
  const router = useRouter();
  const AuthModal = useAuthModal();
  const { user } = useUser();

  const setPlayLists = usePlaylistNames((state) => state.setPlayLists);

  useEffect(() => {
    // Actualizar el estado usePlaylistNames solo cuando playlist cambie
    if (playlist) {
      setPlayLists(playlist);
    }
  }, [playlist, setPlayLists]);

  return (
    <div className={twMerge(`h-fit bg-gradient-to-b from-emerald-800 px-4 py-5 sm:p-6`, className)}>
      <div className=" w-full mb-4 flex items-center justify-between gap-x-4">
        {/* En el celular la navegacion esta en la barra inferior */}
        <div className="hidden md:flex gap-x-2 items-center">
          <button aria-label="Go back" onClick={() => router.back()} className={NAV_BUTTON}>
            <RxCaretLeft className="text-white" size={35} />
          </button>
          <button aria-label="Go forward" onClick={() => router.forward()} className={NAV_BUTTON}>
            <RxCaretRight className="text-white" size={35} />
          </button>
        </div>
        <div className=" ml-auto flex items-center gap-x-2 sm:gap-x-4">
          {user ? (
            <UserMenu />
          ) : (
            <>
              <Button onClick={AuthModal.onOpen} className=" w-auto bg-transparent text-neutral-300 font-medium px-3 sm:px-4">
                Sign up
              </Button>
              <Button onClick={AuthModal.onOpen} className=" w-auto bg-white px-5 sm:px-6 py-2">
                Log in
              </Button>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
export default Header;
