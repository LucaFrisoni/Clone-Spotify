// Searches songs online while the user types, dropping answers to older queries.

import { useEffect, useState } from "react";
import type { TrackResult } from "@/lib/deezer";

const useTrackSearch = (query: string) => {
  const [tracks, setTracks] = useState<TrackResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    if (query.trim().length < 2) {
      setTracks([]);
      return;
    }

    setIsSearching(true);
    setError(null);
    fetch(`/api/tracks/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error ?? "Search failed");
        setTracks(body.tracks);
      })
      .catch((reason) => reason.name !== "AbortError" && setError(reason.message))
      .finally(() => !controller.signal.aborted && setIsSearching(false));

    return () => controller.abort();
  }, [query]);

  return { tracks, isSearching, error };
};

export default useTrackSearch;
