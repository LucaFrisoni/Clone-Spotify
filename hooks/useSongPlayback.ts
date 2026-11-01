// Streams the active song, so it starts before the whole file has downloaded.

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useSound from "use-sound";
import { Song } from "@/types";

interface SongPlaybackOptions {
  song: Song;
  songUrl: string;
  volume: number;
  onEnded: () => void;
}

const useSongPlayback = ({ song, songUrl, volume, onEnded }: SongPlaybackOptions) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const [play, { pause, sound, duration }] = useSound(songUrl, {
    volume,
    html5: true,
    format: ["mp3"],
    onplay: () => setIsPlaying(true),
    onpause: () => setIsPlaying(false),
    onend: () => {
      setIsPlaying(false);
      onEnded();
    },
    onloaderror: () => toast.error(`Could not load "${song.tilte}"`),
  });

  useEffect(() => {
    sound?.play();

    return () => {
      sound?.unload();
    };
  }, [sound]);

  const togglePlay = () => (isPlaying ? pause() : play());

  return { isPlaying, togglePlay, sound, duration };
};

export default useSongPlayback;
