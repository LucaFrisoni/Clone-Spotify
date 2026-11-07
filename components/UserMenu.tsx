"use client";
// Avatar button with the account menu: profile and log out, like Spotify.

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import React from "react";
import { FiLogOut, FiUser } from "react-icons/fi";
import useLogout from "@/hooks/useLogout";
import useProfile from "@/hooks/useProfile";
import Avatar from "./Avatar";

const ITEM = "flex cursor-pointer items-center gap-x-3 rounded-sm px-3 py-2.5 text-sm text-neutral-200 outline-none data-[highlighted]:bg-neutral-700";

const UserMenu = () => {
  const router = useRouter();
  const logout = useLogout();
  const { name, avatar } = useProfile();

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label="Account menu"
          className="rounded-full bg-black p-1 transition hover:scale-105 data-[state=open]:scale-105"
        >
          <Avatar src={avatar} name={name} size={32} className="h-8 w-8" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[200px] rounded-md bg-neutral-800 p-1 shadow-xl"
        >
          <DropdownMenu.Label className="truncate px-3 py-2 text-xs text-neutral-400">{name}</DropdownMenu.Label>
          <DropdownMenu.Item className={ITEM} onSelect={() => router.push("/account")}>
            <FiUser /> Profile
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-neutral-700" />
          <DropdownMenu.Item className={ITEM} onSelect={logout}>
            <FiLogOut /> Log out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default UserMenu;
