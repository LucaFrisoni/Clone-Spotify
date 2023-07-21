import { Song } from "@/types";
import React, { useEffect, useState } from "react";
import MediaItem from "./MediaItem";
import LikedButton from "./LikedButton";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import usePlayer from "@/hooks/usePlayer";
import useSound from "use-sound";
import Slider from "./Slider";
import SliderSong from "./SliderSong";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPLaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [sliderTime, setSliderValue] = useState(0);
 

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) {
      return player.setId(player.ids[0]);
    }
    player.setId(nextSong);
  };

  const onPlayPrevious = () => {
    if (player.ids.length === 0) {
      return;
    }

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const PrevSong = player.ids[currentIndex - 1];

    if (!PrevSong) {
      return player.setId(player.ids[player.ids.length - 1]);
    }
    player.setId(PrevSong);
  };

  const [play, { pause, sound, duration }] = useSound(songUrl, {
    volume: volume,
    onplay: () => {
      setIsPLaying(true);
    },
    onend: () => {
      setIsPLaying(false);
      onPlayNext();
   
    },
    onpause: () => setIsPLaying(false),
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



  function convertirTiempoAMinutos(tiempoMs: any) {
    const segundosTotales = Math.floor(tiempoMs / 1000);
    const minutos = Math.floor(segundosTotales / 60);
    return minutos;
  }



  useEffect(() => {
    sound?.play();

    return () => {
      //unload?
      sound?.unload();
    };
  }, [sound]);

  const handlePLay = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
   
  };

  useEffect(() => {
    const updateCurrentTime = () => {
      if (sound) {
        //tiempo de reproducion actual => seek
        setCurrentTime(Math.floor(sound.seek()));
      }
    };

    const interval = setInterval(updateCurrentTime, 0);
    return () => clearInterval(interval);
  }, [sound]);


  function formatTime(seconds:number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
  
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    sound?.seek(value); // Convertimos el valor del slider en el tiempo de reproducción (en milisegundos)
  };


  const toggleMute = () => {
    if (volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  };

  return (
    <div className=" grid grid-cols-3 md:grid-cols-4 h-full">
      <div className="flex w-full  justify-start">
        <div className=" flex items-center gap-x-4">
          <MediaItem data={song} player={true} />
          <LikedButton songId={song.id} />
        </div>
      </div>

      <div
        className=" flex
      md:hidden
      col-auto
      w-full
      justify-end
      items-center
      "
      >
        <div className="flex  h-full justify-center items-center w-full gap-x-6 ">
          <AiFillStepBackward
            onClick={onPlayPrevious}
            size={30}
            className="text-neutral-400 cursor-pointer hover:text-white transition w-[120px]"
          />
          <div
            onClick={handlePLay}
            className="h-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer w-[40px]"
          >
            <Icon size={30} className="text-black" />
          </div>
          <AiFillStepForward
            onClick={onPlayNext}
            size={30}
            className="text-neutral-400 cursor-pointer hover:text-white transition w-[120px]"
          />
        </div>
      </div>
        <div className="md:hidden flex w-full items-center">
        <p className=" p-3 text-xs text-neutral-400 ">{formatTime(currentTime)}</p>
        <SliderSong
          min={0}
          max={duration! / 1000 }
          value={currentTime}
          onChange={handleSliderChange}
          />
          <p className=" p-3  text-xs text-neutral-400 ">{duracionFormateada}</p>
      </div>

      <div className="  hidden h-full md:flex justify-center items-center w-full  gap-x-6 relative md:col-span-2  flex-wrap ">
        <AiFillStepBackward
          onClick={onPlayPrevious}
          size={25}
          className=" text-neutral-400 cursor-pointer hover:text-white transition"
        />
        <div
          onClick={handlePLay}
          className=" group flex items-center hover:scale-105 justify-center h-[34px] w-[34px] rounded-full bg-white p-1 cursor-pointer"
        >
          <Icon
            size={24}
            className=" flex justify-center items-center text-black "
          />
        </div>
        <AiFillStepForward
          onClick={onPlayNext}
          size={25}
          className=" text-neutral-400 cursor-pointer hover:text-white transition"
        />
    
      <div className=" flex w-full">
        <p className=" p-3 text-xs text-neutral-400 ">{formatTime(currentTime)}</p>
        <SliderSong
          min={0}
          max={duration! / 1000 }
          value={currentTime}
          onChange={handleSliderChange}
          />
          <p className=" p-3  text-xs text-neutral-400 ">{duracionFormateada}</p>
      </div>
      </div>
      <div className=" hidden md:flex w-full justify-end pr-2">
        <div className=" flex items-center gap-x-2 w-[120px]">
          <VolumeIcon
            size={34}
            onClick={toggleMute}
            className=" cursor-pointer"
          />
          <Slider value={volume} onChange={(value) => setVolume(value)} />
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;
