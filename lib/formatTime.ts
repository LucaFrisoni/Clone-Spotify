// Formats a length in seconds the way music players show it, such as 3:07.

export const formatTime = (seconds?: number | null) => {
  if (!seconds || !Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainder = String(totalSeconds % 60).padStart(2, "0");

  return `${minutes}:${remainder}`;
};
