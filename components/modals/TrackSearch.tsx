"use client";
// Second view of the add song modal: find a song online and add it with its cover.

import Image from "next/image";
import React, { useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import useTrackSearch from "@/hooks/useTrackSearch";
import useAddTrack, { AddStatus } from "@/hooks/useAddTrack";
import type { TrackResult } from "@/lib/deezer";
import Input from "../Input";
import Button from "../Button";

const LABELS: Record<AddStatus | "idle", string> = { idle: "Add", adding: "Adding...", added: "Added" };

const TrackRow: React.FC<{ track: TrackResult; status?: AddStatus; onAdd: () => void }> = ({ track, status, onAdd }) => (
  <div className="flex items-center gap-x-3 rounded-md p-2 hover:bg-neutral-700/50">
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
      <Image src={track.cover} alt={track.title} fill sizes="48px" unoptimized className="object-cover" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm text-white">{track.title}</p>
      <p className="flex items-center gap-x-2 text-xs text-neutral-400">
        <span className="shrink-0 rounded-sm bg-neutral-700 px-1 text-[10px] font-semibold uppercase text-neutral-300">30s</span>
        <span className="truncate">{track.artist}</span>
      </p>
    </div>
    <Button
      onClick={onAdd}
      disabled={Boolean(status)}
      className={status === "added" ? "w-auto bg-transparent px-4 py-1.5 text-sm text-green-500" : "w-auto px-4 py-1.5 text-sm"}
    >
      {LABELS[status ?? "idle"]}
    </Button>
  </div>
);

const SearchMessage: React.FC<{ text: string }> = ({ text }) => (
  <p className="py-6 text-center text-sm text-neutral-400">{text}</p>
);

const TrackSearch = () => {
  const [query, setQuery] = useState("");
  const { tracks, isSearching, error } = useTrackSearch(useDebounce(query, 400));
  const { statuses, addTrack } = useAddTrack();

  return (
    <div className="flex flex-col gap-y-3">
      <Input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a song or artist" />
      <p className="rounded-md bg-neutral-900 px-3 py-2 text-xs text-neutral-400">
        Results from Deezer. Songs found here are added as <span className="font-semibold text-white">30-second previews</span>. To add a full song, use Upload file.
      </p>
      <div className="-mx-2 max-h-[45vh] overflow-y-auto">
        {error && <SearchMessage text={error} />}
        {!error && isSearching && tracks.length === 0 && <SearchMessage text="Searching..." />}
        {!error && !isSearching && query.trim().length >= 2 && tracks.length === 0 && <SearchMessage text="No songs found." />}
        {tracks.map((track) => (
          <TrackRow key={track.id} track={track} status={statuses[track.id]} onAdd={() => addTrack(track.id, track.title)} />
        ))}
      </div>
    </div>
  );
};

export default TrackSearch;
