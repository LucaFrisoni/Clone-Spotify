// Reads a song's length from its metadata without downloading the whole file.

import { useEffect, useState } from "react";

const useSongDuration = (url: string) => {
  const [seconds, setSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (!url) {
      return;
    }

    const audio = new Audio();
    audio.preload = "metadata";
    audio.onloadedmetadata = () => setSeconds(audio.duration);
    audio.src = url;

    return () => {
      audio.onloadedmetadata = null;
      audio.removeAttribute("src");
      audio.load();
    };
  }, [url]);

  return seconds;
};

export default useSongDuration;
