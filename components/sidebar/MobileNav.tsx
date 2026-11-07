"use client";
// Bottom navigation for phones, where the sidebar does not fit.

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { TbPlaylist } from "react-icons/tb";
import { twMerge } from "tailwind-merge";

const ITEMS = [
  { href: "/", label: "Home", icon: HiHome },
  { href: "/search", label: "Search", icon: BiSearch },
  { href: "/library", label: "Your Library", icon: TbPlaylist },
];

const MobileNav: React.FC<{ pathname: string }> = ({ pathname }) => {
  //Marca el boton tocado al instante, aunque la pagina tarde en llegar
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const activeHref = pendingHref ?? pathname;

  useEffect(() => setPendingHref(null), [pathname]);

  return (
    <nav className="fixed bottom-0 left-0 z-10 flex h-14 w-full items-center justify-around bg-black md:hidden">
      {ITEMS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={() => href !== pathname && setPendingHref(href)}
          className={twMerge(
            "flex flex-col items-center gap-y-0.5 px-4 text-[11px] text-neutral-400 transition active:scale-95",
            activeHref === href && "text-white"
          )}
        >
          <Icon size={24} />
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default MobileNav;
