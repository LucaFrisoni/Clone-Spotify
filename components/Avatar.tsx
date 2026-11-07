// Shows the user's photo in a circle, or a person icon when there is none.
// The className sets its dimensions; size only picks the image resolution and icon.

import Image from "next/image";
import React from "react";
import { FaUserAlt } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

interface AvatarProps {
  src: string | null;
  name: string;
  size: number;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, name, size, className }) => (
  <div
    className={twMerge("relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-700", className)}
  >
    {src ? (
      <Image src={src} alt={name} fill sizes={`${size}px`} className="object-cover" />
    ) : (
      <FaUserAlt className="text-neutral-400" size={size * 0.4} />
    )}
  </div>
);

export default Avatar;
