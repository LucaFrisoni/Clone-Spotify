"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Button from "./Button";
import useAuthModal from "@/hooks/useAuthModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { FaUserAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import usePlaylistNames from "@/hooks/usePlaylistNames";

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

const Header: React.FC<HeaderProps> = ({ children, className, playlist }) => {
  const router = useRouter();
  const AuthModal = useAuthModal();
  const [localPlaylists, setLocalPlaylists] = useState<PlaylistItem[]>([]); // Estado local
  const supabaseClient = useSupabaseClient();
  const { user } = useUser();

  const usePlayListNames = usePlaylistNames();

  useEffect(() => {
    // Actualizar el estado usePlaylistNames solo cuando localPlaylists cambie
    if (playlist) {
      
      usePlayListNames.setPlayLists(playlist);
      setLocalPlaylists(playlist)
      
    }
  }, [localPlaylists]);


  const handleLogOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    //reset any playing songs
    router.refresh();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged out!");
    }
  };

  return (
    <div
      className={twMerge(
        `h-fit bg-gradient-to-b from-emerald-800 p-6`,
        className
      )}
    >
      <div className=" w-full mb-4 flex items-center justify-between">
        <div className="hidden md:flex gap-x-2 items-center">
          <button
            onClick={() => {
              router.back();
            }}
            className=" rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretLeft className="text-white" size={35} />
          </button>
          <button className=" rounded-full bg-black flex items-center justify-center hover:opacity-75 transition">
            <RxCaretRight
              onClick={() => {
                router.forward();
              }}
              className="text-white"
              size={35}
            />
          </button>
        </div>
        {/* ----------------------------Responsive Cel media --------------------------------------------------------------------------- */}

        <div className="flex md:hidden gap-x-2 items-center">
          <button
            onClick={() => router.push("/")}
            className=" rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition"
          >
            <HiHome className="text-black" size={20} />
          </button>
          <button className=" rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
            <BiSearch
              onClick={() => router.push("/search")}
              className="text-black"
              size={20}
            />
          </button>
        </div>
        {/* ----------------------------Responsive Cel media --------------------------------------------------------------------------- */}

        <div className=" flex justify-between items-center gap-x-4">
          {user ? (
            <div className=" flex gap-x-4 items-center">
              <Button onClick={handleLogOut} className=" bg-white px-6 py-2">
                Logout
              </Button>
              <Button
                onClick={() => router.push("/account")}
                className=" bg-white"
              >
                <FaUserAlt />
              </Button>
            </div>
          ) : (
            <>
              <div>
                <Button
                  onClick={AuthModal.onOpen}
                  className=" bg-transparent text-neutral-300 font-medium"
                >
                  Sign up
                </Button>
              </div>
              <div>
                <Button
                  onClick={AuthModal.onOpen}
                  className=" bg-white px-6 py-2"
                >
                  Log in
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
export default Header;
