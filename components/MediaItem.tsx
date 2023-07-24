"use client";
import useLoadImage from "@/hooks/UseLoadImage";
import { Song } from "@/types";
import Image from "next/image";
import React from "react";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import useSound from "use-sound";
import { twMerge } from "tailwind-merge";

interface MediaItemProps {
  onClick?: (id: string) => void;
  data: Song;
  library?: boolean;
  player?: boolean;
  timer?: string;
  position?: number;
  classname?: string;
}

const MediaItem: React.FC<MediaItemProps> = ({
  onClick,
  data,
  library,
  player,
  position,
  classname,
}) => {
  const imageUrl = useLoadImage(data);

  const songUrl = useLoadSongUrl(data!);

  const [play, { pause, sound, duration }] = useSound(songUrl, {
    format: ["mp3"],
  });

  function convertirTiempoAMinutosYSegundos(tiempoMs: any) {
    const segundosTotales = Math.floor(tiempoMs / 1000);
    const minutos = Math.floor(segundosTotales / 60);
    const segundos = segundosTotales % 60;

    const minutosFormateados = minutos < 10 ? `${minutos}` : minutos;
    const segundosFormateados = segundos < 10 ? `0${segundos}` : segundos;

    return `${minutosFormateados}:${segundosFormateados}`;
  }
  const duracionFormateada = convertirTiempoAMinutosYSegundos(duration);

  const handleClick = () => {
    if (onClick) {
      return onClick(data.id);
    }
  };

  return (
    <div>
      {library || player ? (
        <div
          onClick={handleClick}
          className=" flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md"
        >
          <div className="  relative min-h-[35px] min-w-[35px] rounded-md xl:min-h-[48px] xl:min-w-[48px] overflow-hidden">
            <Image
              alt="Image"
              fill
              src={imageUrl || ""}
              className={twMerge(" object-cover", classname)}
            />
          </div>

          <div className=" flex flex-col gap-y-1 overflow-hidden">
            {" "}
            <p className=" text-xs text-white truncate xl:text-base">{data.tilte}</p>
            <p className=" text-xs text-neutral-400 xl:text-base truncate">{data.author}</p>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className=" grid grid-cols-2 w-full justify-center items-center hover:bg-neutral-800/50"
        >
          <div className=" flex items-center gap-x-3 cursor-pointer  w-full p-2 rounded-md">
            <div className=" text-neutral-400 p-2">{position}</div>
            <div className="  relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden">
              <Image
                alt="Image"
                fill
                src={imageUrl || ""}
                className=" object-cover"
              />
            </div>

            <div className=" flex flex-col gap-y-1 overflow-hidden">
              {" "}
              <p className=" text-white truncate">{data.tilte}</p>
              <p className=" text-neutral-400 text-sm truncate">
                {data.author}
              </p>
            </div>
          </div>

          <div className=" text-neutral-400 relative left-4 ">
            <p>{duracionFormateada}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaItem;
