import React, { useState } from "react";
import * as RadixSlider from "@radix-ui/react-slider";

interface SliderSongProps {
  value?: number;
  onChange?: (value: number) => void;
  min: number;
  max: number;
}

const SliderSong: React.FC<SliderSongProps> = ({
  value = 0,
  min = 0,
  max = 1,
  onChange,
}) => {
  const handleChange = (newValue: number[]) => {
    onChange?.(newValue[0]);

  };


  return (
    <RadixSlider.Root
      className=" relative flex items-center select-none touch-none w-full h-10 "
      defaultValue={[0]}
      value={[value ]}
      onValueChange={handleChange}
      min={min}
      max={max}
      step={0.1}
      aria-label="Time Slider"
    >
      <RadixSlider.Track className=" bg-neutral-600 relative grow rounded-full h-[3px]">
        <RadixSlider.Range className=" absolute bg-white rounded-full h-full" />
      </RadixSlider.Track>
    </RadixSlider.Root>
  );
};

export default SliderSong;
