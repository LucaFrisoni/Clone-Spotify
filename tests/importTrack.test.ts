// Verifies how a Deezer track becomes a song in Storage and in the songs table.

import assert from "node:assert/strict";
import { test } from "node:test";
import { DuplicateTrackError, importTrack, storageName } from "../lib/importTrack.ts";

const TRACK = {
  id: 7,
  title: "AC/DC: Back?",
  artist: { name: "AC DC" },
  preview: "https://cdnt-preview.dzcdn.net/a.mp3",
  album: { cover_medium: "https://cdn-images.dzcdn.net/m.jpg", cover_xl: "https://cdn-images.dzcdn.net/xl.jpg" },
};

// Serves the Deezer track and its files, standing in for the network.
const fetcher = (async (url: string) => {
  if (url.includes("api.deezer.com")) return new Response(JSON.stringify(TRACK));
  const type = url.endsWith(".mp3") ? "audio/mpeg" : "image/jpeg";
  return new Response("bytes", { headers: { "content-type": type } });
}) as typeof fetch;

// Records uploads and inserts, and reports how many matching songs the user already has.
const createClient = (existing: number) => {
  const uploads: string[] = [];
  const inserts: any[] = [];
  const query: any = {
    select: () => query,
    eq: () => query,
    insert: (row: any) => (inserts.push(row), query),
    single: async () => ({ data: inserts[0], error: null }),
    then: (done: any) => done({ count: existing, error: null }),
  };
  const client: any = {
    from: () => query,
    storage: { from: (bucket: string) => ({ upload: async (name: string) => (uploads.push(`${bucket}/${name}`), { data: { path: name }, error: null }) }) },
  };
  return { client, uploads, inserts };
};

// Characters such as "/" and "?" would create broken Storage paths.
test("removes path characters from storage names", () => {
  assert.equal(storageName("song", "AC/DC: Back?", "x1"), "song-ACDC Back-x1");
  assert.equal(storageName("image", "???", "x1"), "image-track-x1");
});

// Adding the same song twice must not copy its files again.
test("rejects a song the user already has without uploading anything", async () => {
  const { client, uploads } = createClient(1);

  await assert.rejects(importTrack(client, "user", "7", fetcher), DuplicateTrackError);
  assert.equal(uploads.length, 0);
});

// The saved row must point to the files that were just uploaded.
test("uploads both files and saves the song with their paths", async () => {
  const { client, uploads, inserts } = createClient(0);

  await importTrack(client, "user", "7", fetcher);

  assert.equal(uploads.length, 2);
  assert.equal(`songs/${inserts[0].song_path}`, uploads[0]);
  assert.equal(`images/${inserts[0].image_path}`, uploads[1]);
  assert.equal(inserts[0].author, "AC DC");
});
