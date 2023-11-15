"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

interface SideBarItemProps {
  icon: IconType;
  label: string;
  active?: boolean;
  href: string;
}

const SideBarItem: React.FC<SideBarItemProps> = ({
  icon: Icon,
  label,
  active,
  href,
}) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(href)}
      className={twMerge(
        ` flex flex-row items-center h-auto w-full gap-x-4 text-md font-medium cursor-pointer hover:text-white transition text-neutral-400 py-1`,
        active && "text-white"
      )}
    >
      <Icon size={26} />
      <p className=" truncate w-full">{label}</p>
    </div>
  );
};
export default SideBarItem;
