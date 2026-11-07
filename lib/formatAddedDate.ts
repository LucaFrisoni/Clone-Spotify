// Shows when a song was liked the way Spotify does: recent dates relative, older ones in full.

const DAY_MS = 24 * 60 * 60 * 1000;

const ago = (count: number, unit: string) => `${count} ${unit}${count === 1 ? "" : "s"} ago`;

export const formatAddedDate = (iso?: string, now = new Date()) => {
  const date = new Date(iso ?? "");
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const days = Math.floor((now.getTime() - date.getTime()) / DAY_MS);
  if (days < 1) return "Today";
  if (days < 7) return ago(days, "day");
  if (days < 30) return ago(Math.floor(days / 7), "week");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
