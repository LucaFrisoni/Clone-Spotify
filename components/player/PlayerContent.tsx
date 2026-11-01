import { Song } from "@/types";
import React from "react";
import usePlayerQueue from "@/hooks/usePlayerQueue";
import usePlayerVolume from "@/hooks/usePlayerVolume";
import useSongPlayback from "@/hooks/useSongPlayback";
import PlayerControls from "./PlayerControls";
import PlayerProgress from "./PlayerProgress";
import PlayerTrackInfo from "./PlayerTrackInfo";
import PlayerVolume from "./PlayerVolume";

interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const RESTART_THRESHOLD_SECONDS = 3;

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const queue = usePlayerQueue();
  const { volume, setVolume, saveVolume, toggleMute } = usePlayerVolume();
  const { isPlaying, togglePlay, sound, duration } = useSongPlayback({
    song,
    songUrl,
    volume,
    onEnded: queue.playNext,
  });

  const onPrevious = () => {
    if (sound && sound.seek() > RESTART_THRESHOLD_SECONDS) {
      return sound.seek(0);
    }
    queue.playPrevious();
  };

  return (
    <div className="relative flex h-full items-center gap-x-3 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] md:gap-x-4">
      <PlayerTrackInfo song={song} />
      <div className="flex shrink-0 flex-col items-center gap-y-1">
        <PlayerControls
          isPlaying={isPlaying}
          shuffle={queue.shuffle}
          onTogglePlay={togglePlay}
          onToggleShuffle={queue.toggleShuffle}
          onNext={queue.playNext}
          onPrevious={onPrevious}
        />
        <PlayerProgress sound={sound} durationMs={duration} />
      </div>
      <PlayerVolume
        volume={volume}
        onChange={setVolume}
        onCommit={saveVolume}
        onToggleMute={toggleMute}
      />
    </div>
  );
};

export default PlayerContent;
