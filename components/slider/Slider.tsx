"use client";

import React, { useState } from "react";
import * as RadixSlider from "@radix-ui/react-slider";

interface SliderProps {
  value?: number;
  onChange?: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ value = 1, onChange }) => {
  const handleChange = (newValue: number[]) => {
    onChange?.(newValue[0]);
  };

  const [isDragging, setIsDragging] = useState(false);

  return (
    <RadixSlider.Root
      className=" relative flex items-center select-none touch-none w-full h-10"
      defaultValue={[1]}
      value={[value]}
      onValueChange={handleChange}
      onPointerDown={() => setIsDragging(true)}
      onPointerUp={() => setIsDragging(false)}
      max={1}
      step={0.05}
      aria-label="Volume"
    >
      <RadixSlider.Track className=" bg-neutral-600 relative grow rounded-full h-[3px]">
        <RadixSlider.Range  className={`absolute rounded-full h-full ${
          isDragging ? " bg-green-500" : "bg-white"
        }`} />
      </RadixSlider.Track>
    </RadixSlider.Root>
  );
};

export default Slider;
