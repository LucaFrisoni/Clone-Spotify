"use client";

import React, { useRef, useState } from "react";
import * as RadixSlider from "@radix-ui/react-slider";
import { twMerge } from "tailwind-merge";

interface SliderProps {
  value: number;
  max: number;
  step: number;
  label: string;
  disabled?: boolean;
  onChange?: (value: number) => void;
  onCommit?: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({
  value,
  max,
  step,
  label,
  disabled,
  onChange,
  onCommit,
}) => {
  //Mientras se arrastra manda el usuario, asi la barra no salta hacia el valor externo
  const [draft, setDraft] = useState<number | null>(null);
  const draftRef = useRef<number | null>(null);
  const isDragging = draft !== null;

  const updateDraft = (next: number | null) => {
    draftRef.current = next;
    setDraft(next);
  };

  const handleChange = ([next]: number[]) => {
    updateDraft(next);
    onChange?.(next);
  };

  const handleCommit = () => {
    if (draftRef.current === null) {
      return;
    }
    onCommit?.(draftRef.current);
    updateDraft(null);
  };

  return (
    <RadixSlider.Root
      className="group relative flex h-4 w-full cursor-pointer touch-none select-none items-center data-[disabled]:cursor-default"
      value={[draft ?? Math.min(value, max)]}
      onValueChange={handleChange}
      onValueCommit={handleCommit}
      onPointerUp={handleCommit}
      max={max}
      step={step}
      disabled={disabled}
      aria-label={label}
    >
      <RadixSlider.Track className="relative h-1 grow overflow-hidden rounded-full bg-neutral-600">
        <RadixSlider.Range
          className={twMerge(
            "absolute h-full rounded-full bg-white transition-colors group-hover:bg-green-500",
            isDragging && "bg-green-500"
          )}
        />
      </RadixSlider.Track>
      <RadixSlider.Thumb
        aria-label={label}
        className={twMerge(
          "block h-3 w-3 rounded-full bg-white opacity-0 shadow-md outline-none transition-opacity group-hover:opacity-100 focus-visible:opacity-100",
          isDragging && "opacity-100"
        )}
      />
    </RadixSlider.Root>
  );
};

export default Slider;
