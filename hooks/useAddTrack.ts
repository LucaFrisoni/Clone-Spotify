// Adds an online song to the library and remembers which ones were added or are in progress.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export type AddStatus = "adding" | "added";

const useAddTrack = () => {
  const router = useRouter();
  const [statuses, setStatuses] = useState<Record<string, AddStatus>>({});

  const setStatus = (id: string, status?: AddStatus) =>
    setStatuses((current) => {
      const next = { ...current };
      status ? (next[id] = status) : delete next[id];
      return next;
    });

  const addTrack = async (id: string, title: string) => {
    setStatus(id, "adding");
    const response = await fetch("/api/tracks/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      setStatus(id, response.status === 409 ? "added" : undefined);
      return toast.error(body.error ?? "Could not add the song");
    }
    setStatus(id, "added");
    toast.success(`"${title}" added to your library`);
    router.refresh();
  };

  return { statuses, addTrack };
};

export default useAddTrack;
