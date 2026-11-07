"use client";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Box from "../Box";
import SideBarItem from "./SideBarItem";
import Library from "./Library";
import MobileNav from "./MobileNav";
import { Song } from "@/types";
import usePlayer from "@/hooks/zustand/usePlayer";
import { twMerge } from "tailwind-merge";

interface SideBarProps {
  children: React.ReactNode;
  songs: Song[];
}

const SideBar: React.FC<SideBarProps> = ({ children, songs }) => {
  const pathname = usePathname();
  const player = usePlayer();

  //Home solo se marca en "/", asi Profile o Liked no lo dejan activo
  const routes = useMemo(() => {
    return [
      { icon: HiHome, label: "Home", active: pathname === "/", href: "/" },
      { icon: BiSearch, label: "Search", active: pathname === "/search", href: "/search" },
    ];
  }, [pathname]);

  return (
    <>
      <div
        className={twMerge(
          `flex h-[calc(100%-56px)] md:h-full`,
          player.activeId && "h-[calc(100%-136px)] md:h-[calc(100%-80px)]"
        )}
      >
        <div className="hidden md:flex flex-col gap-y-2 bg-black h-full w-[240px] lg:w-[300px] shrink-0 p-2">
          <Box>
            <div className=" flex flex-col gap-y-4 px-5 py-4">
              {routes.map((item) => (
                <SideBarItem key={item.label} {...item} />
              ))}
            </div>
          </Box>
          <Box className=" overflow-y-auto h-full">
            <Library songs={songs} />
          </Box>
        </div>
        <main className=" h-full min-w-0 overflow-y-auto flex-1 md:py-2 md:pr-2">{children}</main>
      </div>
      <MobileNav pathname={pathname} />
    </>
  );
};

export default SideBar;
