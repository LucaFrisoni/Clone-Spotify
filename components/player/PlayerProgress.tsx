// Shows the playback position and lets the listener seek through the song.

import React, { useEffect, useState } from "react";
import { formatTime } from "@/lib/formatTime";
import Slider from "../slider/Slider";

interface PlayerProgressProps {
  sound: any;
  durationMs: number | null;
}

const TIME_LABEL = "hidden w-10 shrink-0 text-[11px] tabular-nums text-neutral-400 md:block";

const PlayerProgress: React.FC<PlayerProgressProps> = ({ sound, durationMs }) => {
  const [position, setPosition] = useState(0);
  const [scrubPosition, setScrubPosition] = useState<number | null>(null);
  const duration = (durationMs ?? 0) / 1000;

  useEffect(() => {
    const readPosition = () => {
      const seconds = sound?.seek();
      if (typeof seconds === "number") {
        setPosition(seconds);
      }
    };

    const interval = setInterval(readPosition, 200);
    return () => clearInterval(interval);
  }, [sound]);

  const seekTo = (seconds: number) => {
    sound?.seek(seconds);
    setPosition(seconds);
    setScrubPosition(null);
  };

  return (
    <div className="absolute inset-x-0 -bottom-3 flex items-center gap-x-2 md:static md:w-full">
      <span className={`${TIME_LABEL} text-right`}>{formatTime(scrubPosition ?? position)}</span>
      <Slider
        value={position}
        max={duration || 1}
        step={0.1}
        label="Seek"
        disabled={!duration}
        onChange={setScrubPosition}
        onCommit={seekTo}
      />
      <span className={TIME_LABEL}>{formatTime(duration)}</span>
    </div>
  );
};

export default PlayerProgress;
