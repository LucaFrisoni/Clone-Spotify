// Moves through the queue, in order or shuffled, and remembers the shuffle choice.

import { useRef, useState } from "react";
import { getNextId, getPreviousId, pickRandomId } from "@/lib/playerQueue";
import usePlayer from "./zustand/usePlayer";

const readHistory = (): string[] =>
  JSON.parse(localStorage.getItem("playedIndexes") ?? "[]");

const usePlayerQueue = () => {
  const [shuffle, setShuffle] = useState(
    () => localStorage.getItem("random") === "true"
  );
  //El reproductor guarda el onend inicial, el ref le da el valor actual
  const shuffleRef = useRef(shuffle);

  const toggleShuffle = () => {
    const next = !shuffleRef.current;
    shuffleRef.current = next;
    setShuffle(next);
    localStorage.setItem("random", JSON.stringify(next));
  };

  const playRandom = () => {
    const { ids, activeId, setId } = usePlayer.getState();
    const { id, history } = pickRandomId(ids, readHistory(), activeId);
    localStorage.setItem("playedIndexes", JSON.stringify(history));
    setId(id);
  };

  const playNext = () => {
    const { ids, activeId, setId } = usePlayer.getState();
    if (ids.length === 0) {
      return;
    }
    return shuffleRef.current ? playRandom() : setId(getNextId(ids, activeId));
  };

  const playPrevious = () => {
    const { ids, activeId, setId } = usePlayer.getState();
    if (ids.length > 0) {
      setId(getPreviousId(ids, activeId));
    }
  };

  return { shuffle, toggleShuffle, playNext, playPrevious };
};

export default usePlayerQueue;
