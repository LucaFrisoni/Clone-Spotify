"use client";
import React, { useState } from "react";
import * as RadixSlider from "@radix-ui/react-slider";
import { PlayFunction } from "use-sound/dist/types";

interface SliderSongProps {
  value?: number;
  onChange?: (value: number) => void;
  min: number;
  max: number;
  play: PlayFunction;
}

const SliderSong: React.FC<SliderSongProps> = ({
  value = 0,
  min = 0,
  max = 1,
  onChange,
  play,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (newValue: number[]) => {
    onChange?.(newValue[0]);
  };

  return (
    <RadixSlider.Root
      className={`relative flex items-center select-none touch-none w-full h-10 `}
      defaultValue={[0]}
      value={[value]}
      onValueChange={handleChange}
      onPointerDown={() => setIsDragging(true)}
      onPointerUp={() => {
        setIsDragging(false);
        play();
      }}
      min={min}
      max={max}
      step={0.1}
      aria-label="Time Slider"
    >
      <RadixSlider.Track className="bg-neutral-600 relative grow rounded-full h-[3px]">
        <RadixSlider.Range
          className={`absolute rounded-full h-full ${
            isDragging ? " bg-green-500" : "bg-white"
          }`}
        />
      </RadixSlider.Track>
    </RadixSlider.Root>
  );
};

export default SliderSong;
