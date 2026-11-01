// Renders the shuffle, previous, play and next buttons of the player.

import React from "react";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { FaRandom } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

interface PlayerControlsProps {
  isPlaying: boolean;
  shuffle: boolean;
  onTogglePlay: () => void;
  onToggleShuffle: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const STEP_BUTTON = "text-neutral-400 transition hover:text-white active:scale-95";

const ShuffleButton: React.FC<{ active: boolean; onClick: () => void }> = ({ active, onClick }) => (
  <button
    aria-label="Shuffle"
    aria-pressed={active}
    onClick={onClick}
    className={twMerge(
      "relative hidden text-neutral-400 transition hover:text-white active:scale-95 md:block",
      active && "text-green-500 hover:text-green-400"
    )}
  >
    <FaRandom size={15} />
    {active && (
      <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-green-500" />
    )}
  </button>
);

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  shuffle,
  onTogglePlay,
  onToggleShuffle,
  onNext,
  onPrevious,
}) => {
  const PlayIcon = isPlaying ? BsPauseFill : BsPlayFill;

  return (
    <div className="flex items-center justify-center gap-x-4 md:gap-x-5">
      <ShuffleButton active={shuffle} onClick={onToggleShuffle} />
      <button aria-label="Previous" onClick={onPrevious} className={STEP_BUTTON}>
        <AiFillStepBackward size={22} />
      </button>
      <button
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={onTogglePlay}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 active:scale-95"
      >
        <PlayIcon size={24} />
      </button>
      <button aria-label="Next" onClick={onNext} className={STEP_BUTTON}>
        <AiFillStepForward size={22} />
      </button>
    </div>
  );
};

export default PlayerControls;
