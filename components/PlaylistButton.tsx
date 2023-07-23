"use client";
import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import usePlaylistNames from "@/hooks/usePlaylistNames";
interface PlaylistItem {
  name: string;
  imgPlayList_path: string;
  // Otras propiedades relevantes de los elementos de la playlist
}

const PlaylistButton = () => {
  const [open, setOpen] = useState(false);
  const [localPlaylists, setLocalPlaylists] = useState<PlaylistItem[]>([]); // Estado local
  const onClick = () => {
    setOpen(true);
  };
  const { playlists } = usePlaylistNames();
console.log(playlists)

  return <div>hola</div>;
};

export default PlaylistButton;
{
  /* <DropdownMenu.Root open={open}>
<DropdownMenu.Trigger asChild>
  <button onClick={onClick} className=" hover:opacity-75 transition">
    <BsThreeDotsVertical />
  </button>
</DropdownMenu.Trigger>

<DropdownMenu.Portal>
  <DropdownMenu.Content sideOffset={5}>
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger>Playlists</DropdownMenu.SubTrigger>
      <DropdownMenu.Portal>
        <DropdownMenu.SubContent sideOffset={2} alignOffset={-5}>
          {playlists.map((list: any) => (
            <DropdownMenu.Item>{list.name}</DropdownMenu.Item>
          ))}
        </DropdownMenu.SubContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Sub>
  </DropdownMenu.Content>
</DropdownMenu.Portal>
</DropdownMenu.Root> */
}
