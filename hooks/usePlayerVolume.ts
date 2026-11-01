// Manages the player volume and remembers it between songs, visits and mutes.

import { useRef, useState } from "react";

const STORAGE_KEY = "playerVolume";

const readStoredVolume = () => {
  const stored = parseFloat(localStorage.getItem(STORAGE_KEY) ?? "");
  return Number.isFinite(stored) ? stored : 1;
};

const usePlayerVolume = () => {
  const [volume, setVolume] = useState(readStoredVolume);
  const lastAudibleVolume = useRef(volume || 1);

  const saveVolume = (value: number) => {
    localStorage.setItem(STORAGE_KEY, value.toString());
    if (value > 0) {
      lastAudibleVolume.current = value;
    }
  };

  const toggleMute = () => {
    const next = volume === 0 ? lastAudibleVolume.current : 0;
    setVolume(next);
    saveVolume(next);
  };

  return { volume, setVolume, saveVolume, toggleMute };
};

export default usePlayerVolume;
