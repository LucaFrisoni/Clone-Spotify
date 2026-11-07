// Keeps a growing list of songs and fetches the next page when the list asks for it.

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { mergeSongs, PAGE_SIZE } from "@/lib/songQueries";
import { Song } from "@/types";

const useInfiniteSongs = (initialSongs: Song[], loadPage?: (page: number) => Promise<Song[]>) => {
  const [songs, setSongs] = useState(initialSongs);
  const [hasMore, setHasMore] = useState(Boolean(loadPage) && initialSongs.length === PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(false);
  const nextPage = useRef(1);
  const isFetching = useRef(false);

  //Un refresh del servidor trae la primera pagina; se conserva lo que ya estaba cargado
  useEffect(() => {
    setSongs((current) => mergeSongs(initialSongs, current));
  }, [initialSongs]);

  const loadMore = useCallback(async () => {
    if (!loadPage || isFetching.current || !hasMore) {
      return;
    }
    isFetching.current = true;
    setIsLoading(true);
    try {
      const page = await loadPage(nextPage.current);
      nextPage.current += 1;
      setSongs((current) => mergeSongs(current, page));
      setHasMore(page.length === PAGE_SIZE);
    } catch (error: any) {
      toast.error(error.message);
      setHasMore(false);
    } finally {
      isFetching.current = false;
      setIsLoading(false);
    }
  }, [hasMore, loadPage]);

  return { songs, hasMore, isLoading, loadMore };
};

export default useInfiniteSongs;
