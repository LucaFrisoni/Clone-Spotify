// Renders the mute button and volume slider of the player.

import React from "react";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import Slider from "../slider/Slider";

interface PlayerVolumeProps {
  volume: number;
  onChange: (value: number) => void;
  onCommit: (value: number) => void;
  onToggleMute: () => void;
}

const PlayerVolume: React.FC<PlayerVolumeProps> = ({ volume, onChange, onCommit, onToggleMute }) => {
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  return (
    <div className="hidden items-center justify-end gap-x-2 md:flex">
      <button
        aria-label={volume === 0 ? "Unmute" : "Mute"}
        onClick={onToggleMute}
        className="text-neutral-400 transition hover:text-white active:scale-95"
      >
        <VolumeIcon size={20} />
      </button>
      <div className="w-full max-w-[120px]">
        <Slider value={volume} max={1} step={0.01} label="Volume" onChange={onChange} onCommit={onCommit} />
      </div>
    </div>
  );
};

export default PlayerVolume;
