"use client";
import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import usePlaylistNames from "@/hooks/usePlaylistNames";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
interface PlaylistItem {
  name: string;
  imgPlayList_path: string;
  // Otras propiedades relevantes de los elementos de la playlist
}

interface PlaylistButtonProps {
  className?: string;
}

const PlaylistButton: React.FC<PlaylistButtonProps> = ({ className }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const supabaseClient = useSupabaseClient();

  const toggleMenu = () => {
    setOpen(!open);
  };

  const handleItem = () => {
    setOpen(false);
  };

  const { playlists } = usePlaylistNames();

  useEffect(() => {
    router.refresh();
  }, [playlists]);

  return (
    <DropdownMenu.Root  open={open}>
      <DropdownMenu.Trigger asChild>
        <button
          onClick={toggleMenu}
          className={twMerge(`hidden md:flex hover:opacity-75 transition`, className)}
        >
          <BsThreeDotsVertical />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className=" min-w-[220px] max-h-[800px] overflow-y-auto p-1"
          sideOffset={10}
        >
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="bg-neutral-700 rounded-md flex  justify-between p-3 hover:bg-neutral-600 text-sm">
              Add to Playlist
              <span onClick={handleItem} className=" cursor-pointer">
                x
              </span>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                sideOffset={-6}
                alignOffset={-8}
                className="bg-neutral-800 rounded-sm p-1 mt-2  min-w-[220px] "
              >
                {playlists.map((list: any) => (
                  <DropdownMenu.Item
                    className="cursor-pointer bg-neutral-800 hover:bg-neutral-700 p-2 shadow-xl text-sm rounded-sm"
                    onClick={handleItem}
                  >
                    {list.name}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default PlaylistButton;
