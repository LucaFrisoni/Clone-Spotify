import { Song } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import MediaItem from "../songs/MediaItem";
import LikedButton from "../likes/LikedButton";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import usePlayer from "@/hooks/zustand/usePlayer";
import useSound from "use-sound";
import Slider from "../slider/Slider";
import SliderSong from "../slider/SliderSong";
import PlaylistButton from "../PlaylistButton";
import { FaRandom } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { getNextId, getPreviousId, pickRandomId } from "@/lib/playerQueue";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
  playlists?: any;
}

const PlayerContent: React.FC<PlayerContentProps> = ({
  song,
  songUrl,
  playlists,
}) => {
  const player = usePlayer();

  const [isPlaying, setIsPLaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [sliderTime, setSliderValue] = useState(0);

  const storedVolume = localStorage.getItem("playerVolume");
  const initialVolume = storedVolume ? parseFloat(storedVolume) : 1;

  const [volume, setVolume] = useState(initialVolume);

  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  // ... (resto del código)

  // Función para cambiar el volumen
  const handleVolumeChange = (value: number) => {
    setVolume(value);
    // Almacenar el volumen en localStorage
    localStorage.setItem("playerVolume", value.toString());
  };
  //-------------||Botones de Reproduccion||----------------------//
  const onPlayNext = () => {
    if (player.ids.length === 0) {
      return;
    }

    player.setId(getNextId(player.ids, player.activeId));
  };

  const onPlayPrevious = () => {
    if (player.ids.length === 0) {
      return;
    }

    player.setId(getPreviousId(player.ids, player.activeId));
  };
  //-------------||Logica Random||----------------------//
  const [random, setRandom] = useState(
    () => localStorage.getItem("random") === "true"
  );
  //useSound guarda el onend inicial, el ref le da el valor actual de random
  const randomRef = useRef(random);
  const [playedIndexes, setPlayedIndexes] = useState(() => {
    const storedIndexes = localStorage.getItem("playedIndexes");
    return storedIndexes ? JSON.parse(storedIndexes) : [];
  });

  const setRandomFunction = () => {
    const newRandomState = !random;
    setRandom(newRandomState);
    randomRef.current = newRandomState;
    localStorage.setItem("random", JSON.stringify(newRandomState));
  };

  const onPlayRandom = () => {
    if (player.ids.length === 0) {
      return;
    }

    const { id, history } = pickRandomId(
      player.ids,
      playedIndexes,
      player.activeId
    );

    setPlayedIndexes(history);
    localStorage.setItem("playedIndexes", JSON.stringify(history));

    player.setId(id);
  };

  const onPlayNextTrack = () => {
    return randomRef.current ? onPlayRandom() : onPlayNext();
  };
  //-------------||Botones de Reproduccion||----------------------//

  const [play, { pause, sound, duration }] = useSound(songUrl, {
    volume: volume,
    onplay: () => {
      setIsPLaying(true);
    },
    onend: () => {
      setIsPLaying(false);
      onPlayNextTrack();
    },
    onpause: () => setIsPLaying(false),
    onloaderror: () => toast.error(`Could not load "${song.tilte}"`),
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

    const interval = setInterval(updateCurrentTime, 250);
    return () => clearInterval(interval);
  }, [sound]);

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  }
  //Manejas el slider de la cancion
  const handleSliderChange = (value: number) => {
    pause();
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
    <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 h-full">
      <div className="flex w-full  justify-start">
        <div className="flex items-center sm:gap-x-2 lg:gap-x-4">
          <MediaItem data={song} player={true} />
          <LikedButton songId={song.id} />
          <PlaylistButton />
        </div>
      </div>
      {/* Mobile Button */}
      <div
        className=" flex
      md:hidden
      col-auto
      w-full justify-center
      items-center
      relative left-9
      sm:left-0
      "
      >
        <div className="flex  h-full justify-center items-center w-full ">
          <AiFillStepBackward
            onClick={onPlayPrevious}
            size={25}
            className="text-neutral-400 cursor-pointer hover:text-white transition sm:w-[60px] w-[120px] "
          />
          <div
            onClick={handlePLay}
            className="h-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer w-[60px]"
          >
            <Icon size={25} className="text-black" />
          </div>
          <AiFillStepForward
            onClick={onPlayNextTrack}
            size={25}
            className="text-neutral-400 cursor-pointer hover:text-white transition sm:w-[60px] w-[120px]"
          />
        </div>
      </div>

      {/* Mobile sliderSong */}
      <div className="md:hidden flex w-full items-center relative top-3">
        <p className=" p-3 text-xs text-neutral-400 ">
          {formatTime(currentTime)}
        </p>
        <SliderSong
          play={play}
          min={0}
          max={duration! / 1000}
          value={currentTime}
          onChange={handleSliderChange}
        />
        <p className=" p-3  text-xs text-neutral-400 ">{duracionFormateada}</p>
      </div>

      <div className="  hidden h-full md:flex justify-center items-center w-full  gap-x-6 relative md:col-span-2  flex-wrap md:relative md:left-14">
        <div
          className="relative right-[10%] cursor-pointer flex flex-col items-center"
          onClick={setRandomFunction}
        >
          <FaRandom className={random ? "text-emerald-500" : ""} />

          {random ? (
            <div className="mt-2 h-1 w-1 rounded-full bg-emerald-500 transition"></div>
          ) : null}
        </div>

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
          onClick={onPlayNextTrack}
          size={25}
          className=" text-neutral-400 cursor-pointer hover:text-white transition"
        />

        <div className=" sm:flex w-full">
          <p className=" p-3 text-xs text-neutral-400 ">
            {formatTime(currentTime)}
          </p>
          <SliderSong
            min={0}
            max={duration! / 1000}
            value={currentTime}
            onChange={handleSliderChange}
            play={play}
          />
          <p className=" p-3  text-xs text-neutral-400 ">
            {duracionFormateada}
          </p>
        </div>
      </div>

      <div className=" hidden md:flex md:relative md:left-8 xl:left-0 w-full xl:justify-end justify-center pr-2">
        <div className=" flex items-center gap-x-2 w-[120px]">
          <VolumeIcon
            size={34}
            onClick={toggleMute}
            className=" cursor-pointer"
          />
          <Slider value={volume} onChange={handleVolumeChange} />
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;
