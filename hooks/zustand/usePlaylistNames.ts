
import { create } from "zustand";

interface Playlist {
    name: string;
    imgPlayList_path: string;
}

interface usePlaylistNamesProps {
  playlists: Playlist[];
  setPlayLists: (array: Playlist[]) => void;
  reset: () => void;
}

const usePlaylistNames = create<usePlaylistNamesProps>((set) => ({
  playlists: [], // Array vacío inicial
  setPlayLists: (array) => set({ playlists: array }),
  reset: () => set({ playlists: [] }), // Reiniciar a un array vacío
}));

export default usePlaylistNames;
